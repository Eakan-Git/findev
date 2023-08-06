import os
from typing import Optional
import uvicorn
from typing import List
import urllib.parse
from dotenv import load_dotenv
from paginate_sqlalchemy import SqlalchemyOrmPage
import math
import pandas as pd
import mysql.connector
from elasticsearch import Elasticsearch
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi import HTTPException, status
from requests.exceptions import ConnectionError, Timeout
import numpy as np
import warnings
import re
import json
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import datetime
from bson.regex import Regex
import warnings; warnings.simplefilter('ignore')

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with the appropriate origins if needed
    allow_methods=["*"],  # Or specify the allowed HTTP methods
    allow_headers=["*"],  # Or specify the allowed headers
)

# Define Elasticsearch connection
es = Elasticsearch([os.environ.get("ELASTICSEARCH_HOST")])

host = os.environ.get('HOST')
user = os.environ.get('USER')
password = os.environ.get('PASSWORD')
database = os.environ.get('DATABASE')
port = os.environ.get('PORT')
ssl_ca = os.environ.get('SSL_CA')

# Establish the connection
cnx = mysql.connector.connect(
    host=host,
    user=user,
    password=password,
    database=database,
    port=port,
    ssl_ca=ssl_ca
)

cursor = cnx.cursor()

index_name = "jobs_index"

# Đường dẫn đến tệp trên Google Drive
file_stpwd = os.environ.get("GOOGLE_DRIVE_FILE_URL")

# Tên biến toàn cục để lưu trữ nội dung của tệp
stopwords_vn = None

def load_stopwords():
    global stopwords_vn

    if stopwords_vn is None:
        # Tải tệp từ URL nếu chưa được tải
        response = requests.get(file_stpwd)
        stopwords_vn = response.text.splitlines()

    return stopwords_vn

# Gọi hàm load_stopwords() để đảm bảo tệp đã được tải trước khi sử dụng
stop_words = load_stopwords()

# Define the SQL query for jobs
query_jobs = """
SELECT
    j.id AS job_id,
    j.title,
    j.description,
    j.min_salary,
    j.max_salary,
    j.recruit_num,
    j.position,
    j.type,
    j.min_yoe,
    j.max_yoe,
    j.benefit,
    j.gender,
    DATE_FORMAT(j.deadline, '%d-%m-%Y') AS deadline,
    j.requirement,
    j.location,
    GROUP_CONCAT(DISTINCT s.skill SEPARATOR ', ') AS skills,
    company_profiles.id AS company_id,
    company_profiles.name AS company_name,
    company_profiles.logo AS company_logo,
    company_profiles.description AS company_description,
    company_profiles.site AS company_site,
    company_profiles.address AS company_address,
    company_profiles.size AS company_size,
    company_profiles.phone AS company_phone,
    company_profiles.email AS company_email,
    GROUP_CONCAT(DISTINCT c.description SEPARATOR ', ') AS categories
FROM
    jobs j
    JOIN job_skills s ON j.id = s.job_id
    JOIN employer_profiles ON j.employer_id = employer_profiles.id
    JOIN company_profiles ON employer_profiles.company_id = company_profiles.id
    JOIN job_category jc ON j.id = jc.job_id
    JOIN categories c ON c.id = jc.category_id
GROUP BY
    j.id,
    j.title,
    j.description,
    j.min_salary,
    j.max_salary,
    j.recruit_num,
    j.position,
    j.type,
    j.min_yoe,
    j.max_yoe,
    j.benefit,
    j.deadline,
    j.requirement
    """

# Execute the jobs query and fetch the results
cursor.execute(query_jobs)
job_results = cursor.fetchall()

# Get the column names for jobs
job_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for jobs
df = pd.DataFrame(job_results, columns=job_columns)

# Delete all data in Elasticsearch
def delete_all_data():
    response = es.indices.delete(index="_all")
    return response

delete_all_data()

# Create or update Elasticsearch index
index_mapping = {
    "settings": {
        "analysis": {
            "filter": {
                "vietnamese_stop": {
                    "type": "stop",
                    "stopwords": stop_words
                }
            },
            "analyzer": {
                "vietnamese_analyzer": {
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "vietnamese_stop"
                    ]
                },
                "custom_analyzer": {
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "vietnamese_stop",
                        "word_delimiter"
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "job_id": {"type": "integer"},
            "title": {"type": "text", "boost": 3, "analyzer": "custom_analyzer"},
            "description": {"type": "text", "analyzer": "custom_analyzer"},  # Changed to "text"
            "min_salary": {"type": "integer"},
            "max_salary": {"type": "integer"},
            "recruit_num": {"type": "integer"},
            "position": {"type": "text", "analyzer": "vietnamese_analyzer"},  # Changed to "text"
            "type": {"type": "text", "analyzer": "vietnamese_analyzer"},  # Changed to "text"
            "min_yoe": {"type": "integer"},
            "max_yoe": {"type": "integer"},
            "benefit": {"type": "text", "analyzer": "vietnamese_analyzer"},  # Changed to "text"
            "gender": {"type": "text", "analyzer": "vietnamese_analyzer"},  # Changed to "text"
            "requirement": {"type": "text", "analyzer": "vietnamese_analyzer"},  # Changed to "text"
            "location": {"type": "text", "analyzer": "vietnamese_analyzer"},
            "skills": {"type": "text", "analyzer": "vietnamese_analyzer"},
            "company_name": {"type": "text", "analyzer": "vietnamese_analyzer"},
            "categories": {"type": "text", "analyzer": "vietnamese_analyzer"},
        }
    }
}

if not es.indices.exists(index=index_name):
    es.indices.create(index=index_name, body=index_mapping)
else:
    es.indices.put_mapping(index=index_name, body=index_mapping['mappings'])

# Index job data into Elasticsearch
for _, row in df.iterrows():
    job_data = row.to_dict()
    # Convert skills to a list
    job_data['skills'] = [skill.strip() for skill in job_data['skills'].split(",")]
    es.index(index=index_name, body=job_data)

# tìm kiếm công việc theo keyword
@app.get("/jobs")
def search_jobs(
    keyword: Optional[str] = Query(None, description="Keyword to search for"),
    addresses: Optional[str] = Query(None, description="Addresses filter"),
    skill: Optional[str] = Query(None, description="Skill filter"),
    categories: Optional[str] = Query(None, description="Categories filter"),
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Number of results per page"),
):
    try:
        # Search for jobs in Elasticsearch
        body = {
            "size": limit,
            "from": (page - 1) * limit,
            "query": {
                "bool": {
                    "must": [],
                    "filter": []
                }
            }
        }

        # Should clause for keyword
        if keyword:
            # Match full phrase "toàn thời gian" in title, description, and other fields
            body["query"]["bool"]["must"].append({
                "multi_match": {
                    "query": keyword,
                    "type": "phrase",
                    "fields": ["title^3", "description^2", "position", "type^3", "requirement"]
                }
            })

        # Filter clauses for skill, address, and categories
        if addresses:
            body["query"]["bool"]["filter"].append({"match": {"location": addresses}})

        if skill:
            body["query"]["bool"]["filter"].append({"match": {"skills": skill}})

        if categories:
            decoded_categories = urllib.parse.unquote(categories)
            body["query"]["bool"]["filter"].append({"match": {"categories": decoded_categories}})

        result = es.search(index="jobs_index", body=body)

        if result and result.get('hits') and result['hits'].get('hits'):
            hits = result["hits"]["hits"]

            max_score = result['hits']['max_score']
            min_score = max_score * 0

            jobs = []
            for hit in hits:
                job_info = hit["_source"]
                job_info["score"] = hit["_score"]

                # Process categories and convert it to a list
                categories_str = job_info.get("categories")
                if categories_str:
                    job_info["categories"] = [cat.strip() for cat in categories_str.split(",")]

                jobs.append(job_info)

            filtered_jobs = [job for job in jobs if job["score"] > min_score]

            total = result["hits"]["total"]["value"]  # Get the total number of jobs across all pages

            if total == 0:
                return {
                    "error": False,
                    "message": "Không tìm thấy công việc thoả yêu cầu",
                    "data": [],
                    "status_code": 404
                }

            # Calculate pagination information
            total_pages = math.ceil(total / limit)
            base_url = f"http://localhost:8001/jobs?keyword={keyword}&addresses={addresses}&skill={skill}&categories={categories}"
            first_page_url = f"{base_url}&page=1"
            last_page = total_pages
            last_page_url = f"{base_url}&page={last_page}"
            next_page = page + 1 if page < total_pages else None
            prev_page = page - 1 if page > 1 else None

            links = [
                {
                    "url": None,
                    "label": "&laquo; Previous",
                    "active": False
                },
                {
                    "url": first_page_url,
                    "label": "1",
                    "active": page == 1
                }
            ]

            for i in range(2, total_pages + 1):
                links.append({
                    "url": f"{base_url}&page={i}",
                    "label": str(i),
                    "active": page == i
                })

            if next_page:
                links.append({
                    "url": f"{base_url}&page={next_page}",
                    "label": "Next &raquo;",
                    "active": False
                })

            pagination_info = {
                "first_page_url": first_page_url,
                "from": (page - 1) * limit + 1,
                "last_page": last_page,
                "last_page_url": last_page_url,
                "links": links,
                "next_page_url": f"{base_url}&page={next_page}" if next_page else None,
                "path": f"http://localhost:8001/jobs?keyword={keyword}&addresses={addresses}&skill={skill}&categories={categories}",
                "per_page": limit,
                "prev_page_url": f"{base_url}&page={prev_page}" if prev_page else None,
                "to": min(page * limit, total),
                "total": total
            }

            return {
                "error": False,
                "message": "Xử lí thành công",
                "data": {
                    "jobs": {
                        "current_page": page,
                        "data": filtered_jobs,
                        "pagination_info": pagination_info
                    }
                },
                "status_code": 200
            }
        else:
            return {
                "error": False,
                "message": "Không tìm thấy công việc thoả yêu cầu",
                "data": [],
                "status_code": 404
            }

    except ConnectionError:
        # Xử lý lỗi mạng
        return {
            "error": True,
            "message": "Lỗi mạng",
            "data": [],
            "status_code": 503
        }
    except (ValueError, TypeError):
        # Xử lý lỗi đầu vào gây crash hoặc lỗi xử lý không mong muốn
        return {
            "error": True,
            "message": "Lỗi đầu vào gây crash",
            "data": [],
            "status_code": 400
        }
    except Exception as e:
        return {
            "error": True,
            "message": "Lổi đầu vào không hợp lệ/ Lỗi website đang gặp sự cố",
            "data": [],
            "status_code": 500
        }


query = """
SELECT
    j.id AS job_id,
    j.title,
    j.description,
    j.min_salary,
    j.max_salary,
    j.recruit_num,
    j.position,
    j.type,
    j.min_yoe,
    j.max_yoe,
    j.benefit,
    j.gender,
    DATE_FORMAT(j.deadline, '%d-%m-%Y') AS deadline,
    j.requirement,
    j.location,
    GROUP_CONCAT(DISTINCT s.skill SEPARATOR ', ') AS skills,
    company_profiles.id AS company_id,
    company_profiles.name AS company_name,
    company_profiles.logo AS company_logo,
    company_profiles.description AS company_description,
    company_profiles.site AS company_site,
    company_profiles.address AS company_address,
    company_profiles.size AS company_size,
    company_profiles.phone AS company_phone,
    company_profiles.email AS company_email,
    GROUP_CONCAT(DISTINCT c.description SEPARATOR ', ') AS categories
FROM
    jobs j
    JOIN job_skills s ON j.id = s.job_id
    JOIN employer_profiles ON j.employer_id = employer_profiles.id
    JOIN company_profiles ON employer_profiles.company_id = company_profiles.id
    JOIN job_category jc ON j.id = jc.job_id
    JOIN categories c ON c.id = jc.category_id
GROUP BY
    j.id,
    j.title,
    j.description,
    j.min_salary,
    j.max_salary,
    j.recruit_num,
    j.position,
    j.type,
    j.min_yoe,
    j.max_yoe,
    j.benefit,
    j.deadline,
    j.requirement
"""

cursor.execute(query)
results_job = cursor.fetchall()
job_col = [desc[0] for desc in cursor.description]
job_TOPCV = pd.DataFrame(results_job, columns=job_col)

index_mapping_title = {
    "settings": {
        "analysis": {
            "filter": {
                "vietnamese_stop": {
                    "type": "stop",
                    "stopwords": stop_words
                }
            },
            "analyzer": {
                "vietnamese_analyzer": {
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "vietnamese_stop"
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
        "job_id": {"type": "integer"},
	    "title": {"type": "text", "boost": 3},
	    "description": {"type": "text"},
        "min_salary": {"type": "integer"},
        "max_salary": {"type": "integer"},
        "recruit_num": {"type": "integer"},
        "position": {"type": "text"},
        "type": {"type": "text"},
        "min_yoe": {"type": "integer"},
        "max_yoe": {"type": "integer"},
	    "benefit": {"type": "text"},
	    "gender": {"type": "text"},
	    "requirement": {"type": "text"},
        "location": {"type": "text"},  
        "skills": {"type": "text"},  
        "categories": {"type": "text"}, 
        }
    }
}

es.indices.create(index="title_index", body=index_mapping_title)

for _, row in job_TOPCV.iterrows():
    job_data = row.to_dict()
    job_data['skills'] = [skill.strip() for skill in job_data['skills'].split(",")]
    es.index(index="title_index", body=job_data)

if not es.indices.exists(index="title_index"):
    es.indices.create(index="title_index", body=index_mapping_title)
else:
    es.indices.put_mapping(index="title_index", body=index_mapping_title['mappings'])

# Gợi ý công việc liên quan
@app.get("/title")
def search_jobs_by_title(
    title: str = Query(None, description="Title to search for"),
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Number of results per page"),
):
    try:
        if title is None:
            return {
                "error": True,
                "message": "Hãy nhập tiêu đề",
                "data": [],
                "status_code": 400
            }

        # Search for jobs in Elasticsearch
        body = {
            "size": limit,
            "from": (page - 1) * limit,
            "query": {
                "bool": {
                    "must": [
                        {"multi_match": {"query": title, "fields": ["*"]}}
                    ],
                    "must_not": [
                        {"match": {"title": title}}
                    ]
                }
            }
        }

        result = es.search(index="title_index", body=body)

        if result and result.get('hits') and result['hits'].get('hits'):
            hits = result["hits"]["hits"]

            jobs = []
            for hit in hits:
                job_info = hit["_source"]
                jobs.append(job_info)

                # Process categories and convert it to a list
                categories_str = job_info.get("categories")
                if categories_str:
                    job_info["categories"] = [cat.strip() for cat in categories_str.split(",")]

            total = len(jobs)

            # Calculate pagination information
            total_pages = math.ceil(total / limit)
            base_url = f"http://localhost:8001/title?title={title}"
            first_page_url = f"{base_url}&page=1"
            last_page = total_pages
            last_page_url = f"{base_url}&page={last_page}"
            next_page = page + 1 if page < total_pages else None
            prev_page = page - 1 if page > 1 else None

            links = [
                {
                    "url": None,
                    "label": "&laquo; Previous",
                    "active": False
                },
                {
                    "url": first_page_url,
                    "label": "1",
                    "active": page == 1
                }
            ]

            for i in range(2, total_pages + 1):
                links.append({
                    "url": f"{base_url}&page={i}",
                    "label": str(i),
                    "active": page == i
                })

            links.append({
                "url": f"{base_url}&page={next_page}" if next_page else None,
                "label": "Next &raquo;",
                "active": False
            })

            pagination_info = {
                "first_page_url": first_page_url,
                "from": (page - 1) * limit + 1,
                "last_page": last_page,
                "last_page_url": last_page_url,
                "links": links,
                "next_page_url": f"{base_url}&page={next_page}" if next_page else None,
                "path": f"http://localhost:8001/title?title={title}",
                "per_page": limit,
                "prev_page_url": f"{base_url}&page={prev_page}" if prev_page else None,
                "to": min(page * limit, total),
                "total": total
            }

            return {
                "error": False,
                "message": "Xử lí thành công",
                "data": {
                    "jobs": {
                        "current_page": page,
                        "data": jobs,
                        "pagination_info": pagination_info
                    }
                },
                "status_code": 200
            }
        else:
            return {
                "error": False,
                "message": "Không tìm thấy công việc",
                "data": None,
                "status_code": 404
            }

    except (ConnectionError, TimeoutError, Timeout) as e:
        # Handle network error
        return {
            "error": True,
            "message": "Lỗi mạng",
            "data": [],
            "status_code": 503
        }
    except (ValueError, TypeError) as e:
        # Handle input error or unexpected processing error
        return {
            "error": True,
            "message": "Lỗi đầu vào gây crash",
            "data": [],
            "status_code": 400
        }
    except Exception as e:
        return {
            "error": True,
            "message": "Lổi đầu vào không hợp lệ/ Lỗi website đang gặp sự cố",
            "data": [],
            "status_code": 500
        }