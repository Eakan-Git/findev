import os
from typing import Optional
import uvicorn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from typing import List
import urllib.parse
from dotenv import load_dotenv
from paginate_sqlalchemy import SqlalchemyOrmPage
import math
import pandas as pd
import mysql.connector
from elasticsearch import Elasticsearch
from pymongo import MongoClient
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi import HTTPException, status
from requests.exceptions import ConnectionError, Timeout
import numpy as np
import warnings
import re
import json
import requests
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse
import nltk
import spacy
import string
from pydantic import BaseModel
from typing import List
from nltk.stem import WordNetLemmatizer
from nltk import word_tokenize
import random
import datetime
from bson.regex import Regex
from fuzzywuzzy import fuzz
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

# Connect to MongoDB
client = MongoClient(os.environ.get("MONGODB_CONNECTION_STRING"))
db = client['BaseOnAL']
collection = db['user_recommend']

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
        "company_name": {"type": "text"}, 
        "categories": {"type": "text"}, 
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
    addresses: Optional[str] = Query(None, description="addresses filter"),
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
            body["query"]["bool"]["must"].append({"multi_match": {"query": keyword, "fields": ["*"]}})
        else:
            body["query"]["bool"]["must"].append({"match_all": {}})

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
            min_score = max_score * 0.7

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

            total = len(filtered_jobs)

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


def find_user_ids_by_job_title(job_title: str = Query(...)):
    pipeline = [
        {"$match": {"jobs.title": job_title}},
        {"$project": {"_id": 0, "user_id": "$user_id", "similarity_score": "$jobs.Similarity Score"}},
        {"$sort": {"similarity_score": -1}}
    ]
    
    result = collection.aggregate(pipeline)
    user_ids = [doc["user_id"] for doc in result]
    
    return user_ids

# gợi ý ứng viên
@app.get("/user_profiles/")
def get_user_profiles(job_title: str = Query(...), page: int = 1, limit: int = 10):
    try:
        user_ids = find_user_ids_by_job_title(job_title)
        
        if not user_ids:
            return {
                "error": False,
                "message": "Không có sinh viên được gợi ý job này",
                "data": {
                    "user_profiles": {
                        "current_page": page,
                        "data": [],
                        "pagination_info": {
                            "first_page_url": None,
                            "from": 0,
                            "last_page": 0,
                            "last_page_url": None,
                            "links": [],
                            "next_page_url": None,
                            "path": f"http://localhost:8001/user_profiles/?job_title={job_title}",
                            "per_page": limit,
                            "prev_page_url": None,
                            "to": 0,
                            "total": 0
                        }
                    }
                },
                "status_code": 404
            }

        # Get 10 random user_ids if there are more than 10
        if len(user_ids) > 10:
            user_ids = user_ids[:10]

        # Query to fetch user profile information from MySQL
        query = f"""
            SELECT
                up.id,
                up.full_name,
                up.avatar,
                up.about_me,
                up.good_at_position,
                up.year_of_experience,
                up.date_of_birth,
                up.gender,
                up.address,
                up.email,
                up.phone,
                up.is_private,
                GROUP_CONCAT(DISTINCT us.skill) AS skills,
                GROUP_CONCAT(DISTINCT ue.description ORDER BY ue.user_id SEPARATOR '; ') AS experiences,
                GROUP_CONCAT(DISTINCT ue.title ORDER BY ue.user_id SEPARATOR '; ') AS experiences_title
            FROM
                user_profiles up
            LEFT JOIN user_skills us ON up.id = us.user_id
            LEFT JOIN (
                SELECT
                    user_id,
                    GROUP_CONCAT(description ORDER BY user_id SEPARATOR '; ') AS description,
                    GROUP_CONCAT(title ORDER BY user_id SEPARATOR '; ') AS title
                FROM
                    user_experiences
                GROUP BY
                    user_id
            ) ue ON up.id = ue.user_id
            WHERE up.id IN ({', '.join(str(id) for id in user_ids)})
            GROUP BY
                up.id,
                up.full_name,
                up.avatar,
                up.about_me,
                up.good_at_position,
                up.year_of_experience,
                up.date_of_birth,
                up.gender,
                up.address,
                up.email,
                up.phone
            LIMIT {limit} OFFSET {(page - 1) * limit}
        """

        # Execute the query and fetch results from MySQL
        cursor = cnx.cursor()
        cursor.execute(query)
        results = cursor.fetchall()

        columns = [column[0] for column in cursor.description]
        df = pd.DataFrame(results, columns=columns)

        user_profiles = df.to_dict('records')
        public_user_profiles = [profile for profile in user_profiles if profile['is_private'] == 0]
        ordered_user_profiles = sorted(public_user_profiles, key=lambda profile: user_ids.index(profile['id']))

        total = len(ordered_user_profiles)
        total_pages = math.ceil(total / limit)
        base_url = f"http://localhost:8001/user_profiles/?job_title={job_title}"
        first_page_url = f"{base_url}&page=1&limit={limit}"
        last_page = total_pages
        last_page_url = f"{base_url}&page={last_page}&limit={limit}"
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
                "url": f"{base_url}&page={i}&limit={limit}",
                "label": str(i),
                "active": page == i
            })

        links.append({
            "url": f"{base_url}&page={next_page}&limit={limit}" if next_page else None,
            "label": "Next &raquo;",
            "active": False
        })

        if len(ordered_user_profiles) == 0:
            return {
                "error": False,
                "message": "Không tìm thấy thông tin người dùng",
                "data": None,
                "status_code": 404
            }
        
        pagination_info = {
            "first_page_url": first_page_url,
            "from": (page - 1) * limit + 1,
            "last_page": last_page,
            "last_page_url": last_page_url,
            "links": links,
            "next_page_url": f"{base_url}&page={next_page}&limit={limit}" if next_page else None,
            "path": f"http://localhost:8001/user_profiles/?job_title={job_title}",
            "per_page": limit,
            "prev_page_url": f"{base_url}&page={prev_page}&limit={limit}" if prev_page else None,
            "to": min(page * limit, total),
            "total": total
        }

        return {
            "error": False,
            "message": "Xử lí thành công",
            "data": {
                "user_profiles": {
                    "current_page": page,
                    "data": ordered_user_profiles,
                    "pagination_info": pagination_info
                }
            },
            "status_code": 200
        }
    
    except (ConnectionError, TimeoutError, Timeout) as e:
        # Xử lý lỗi mạng
        return {
            "error": True,
            "message": "Lỗi mạng",
            "data": [],
            "status_code": 503
        }
    except (ValueError, TypeError) as e:
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

class Job(BaseModel):
    title: str


@app.get("/recommendations/", response_model=dict)
def get_recommendations(title: str):
    try:
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

        job_TOPCV["new_col"] = (
            job_TOPCV["title"]
            + job_TOPCV["description"]
            + job_TOPCV["skills"]
            + job_TOPCV["requirement"]
            + job_TOPCV["categories"]
        )

        tf = TfidfVectorizer(
            analyzer="word", ngram_range=(1, 1), min_df=0.0, stop_words=stop_words
        )
        tfidf_matrix = tf.fit_transform(job_TOPCV["new_col"])

        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

        job_TOPCV = job_TOPCV.reset_index()
        titles = job_TOPCV["title"]

        indices = pd.Series(job_TOPCV.index, index=job_TOPCV["title"]).drop_duplicates()

        idx = indices[title]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(
            sim_scores,
            key=lambda x: np.mean(x[1]) if np.iterable(x[1]) else x[1],
            reverse=True,
        )
        job_indices = [i[0] for i in sim_scores]
        recommended_jobs = job_TOPCV.iloc[job_indices]

        filtered_jobs = recommended_jobs[recommended_jobs["title"] != title]
        filtered_jobs = filtered_jobs.head(20)

        # Convert DataFrame to JSON serializable format
        filtered_jobs_json = filtered_jobs.to_dict(orient="records")

        return {
            "error": False,
            "message": "Xử lí thành công",
            "data": filtered_jobs_json,
            "status_code": 200,
        }

    except (ConnectionError, TimeoutError, Timeout) as e:
        # Xử lý lỗi mạng
        return {"error": True, "message": "Lỗi mạng", "data": [], "status_code": 503}

    except (ValueError, TypeError) as e:
        print("e", e)
        # Xử lý lỗi đầu vào gây crash hoặc lỗi xử lý không mong muốn
        return {
            "error": True,
            "message": "Lỗi đầu vào gây crash",
            "data": [],
            "status_code": 400,
        }

    except Exception as e:
        print("e", e)
        return {
            "error": True,
            "message": "Lỗi đầu vào không hợp lệ/ Lỗi website đang gặp sự cố",
            "data": [],
            "status_code": 500,
        }

nltk.download('punkt', quiet=True, force=True)
nltk.download('wordnet', quiet=True, force=True)
nltk.download('averaged_perceptron_tagger', quiet=True, force=True)
nltk.download('omw-1.4', quiet=True, force=True)

# Tạo biến global để lưu trữ dữ liệu
#timetable = None
#users = None
#jobs = None
#user_acc = None

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
results = cursor.fetchall()
columns_job = [desc[0] for desc in cursor.description]

jobs = pd.DataFrame(results, columns=columns_job)

query_user = """
SELECT
  up.id,
  up.full_name,
  up.about_me,
  up.good_at_position,
  up.gender,
  up.address,
  up.year_of_experience,
  GROUP_CONCAT(DISTINCT us.skill) AS skills,
  GROUP_CONCAT(DISTINCT ue.description ORDER BY ue.user_id SEPARATOR ' ; ') AS experiences,
  GROUP_CONCAT(DISTINCT ue.title ORDER BY ue.user_id SEPARATOR ' ; ') AS experiences_title,
  GROUP_CONCAT(DISTINCT ua.description ORDER BY ua.user_id SEPARATOR ' ; ') AS achievements,
  up.created_at,
  up.updated_at
FROM
  user_profiles up
LEFT JOIN user_educations ued ON up.id = ued.user_id
LEFT JOIN user_achievements ua ON up.id = ua.user_id
LEFT JOIN user_skills us ON up.id = us.user_id
LEFT JOIN (
  SELECT
    user_id,
    GROUP_CONCAT(description ORDER BY user_id SEPARATOR '; ') AS description,
    GROUP_CONCAT(title ORDER BY user_id SEPARATOR '; ') AS title
  FROM
    user_experiences
  GROUP BY
    user_id
) ue ON up.id = ue.user_id
GROUP BY
  up.id, up.full_name, up.about_me, up.good_at_position, up.gender;
"""

cursor.execute(query_user)
user_results = cursor.fetchall()

# Get the column names for users
user_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for users
users = pd.DataFrame(user_results, columns=user_columns)

users['experiences'].fillna('Không có', inplace=True)
users['experiences_title'].fillna('Không có', inplace=True)
users['achievements'].fillna('Không có', inplace=True)
users['year_of_experience'].fillna('0', inplace=True)
users['year_of_experience'] = users['year_of_experience'].astype(np.int64)

# Define user_account
user_account = """
    select
      id,
      username,
      password,
      is_banned,
      locked_until,
      last_login
    from 
      user_accounts
    """
# Execute the timetable query and fetch the results
cursor.execute(user_account)
acc_results = cursor.fetchall()

# Get the column names for timetable
acc_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for timetable
user_acc = pd.DataFrame(acc_results, columns=acc_columns)

# Define timetable
time_table = """
    select
      id,
      user_id,
      coordinate
    from 
      time_tables
    """

# Execute the timetable query and fetch the results
cursor.execute(time_table)
timetable_results = cursor.fetchall()

# Get the column names for timetable
timetable_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for timetable
timetable = pd.DataFrame(timetable_results, columns=timetable_columns)
timetable['coordinate'] = timetable['coordinate'].replace('', '0,0')

# Chuyển cột 'deadline' sang dạng datetime
jobs['deadline'] = pd.to_datetime(jobs['deadline'], format='%d-%m-%Y')

# Lấy ngày tháng hiện tại
now = datetime.datetime.now()

# Loại bỏ các công việc đã hết hạn
current_jobs = jobs[jobs['deadline'] >= now]
current_jobs['deadline'] = current_jobs['deadline'].dt.strftime('%d-%m-%Y')

stop = stopwords_vn
stop_words_ = set(stopwords_vn)
wn = WordNetLemmatizer()
vietnamese_lower = "aáàảãạăắằẳẵặâấầẩẫậbcedđeéèẻẽẹêếềểễệghiíìỉĩịjklmnoóòỏõọôốồổỗộơớờởỡợpqrstuúùủũụưứừửữựvxyýỳỷỹỵ"

def black_txt(token):
    return  token not in stop_words_ and token not in list(string.punctuation)  and len(token)>2

def clean_txt(text):
    clean_text = []
    clean_text2 = []
    text = re.sub("'", "", text)
    text = re.sub("(\\d|\\W)+", " ", text)
    text = re.sub(r'(?<=[a-zÀ-ỸẠ-Ỵ])(?=[A-ZĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY])', ' ', text)
    clean_text = [wn.lemmatize(word, pos="v") for word in word_tokenize(text.lower()) if black_txt(word)]
    clean_text2 = [word.replace('_', ' ') for word in clean_text if word not in vietnamese_lower]
    return " ".join(clean_text2)

# Define the weights for each column
weights = {
    'title': 0.4,
    'requirement': 0.2,
    'description': 0.1,
    'skills': 0.35
}
  
# Define the calculate_sim_with_spacy function
def calculate_sim_with_spacy(nlp, df, user_text, weights, n=10):
    list_sim = []

    # Process user_text using nlp
    doc1 = nlp(user_text)

    # Convert columns to text before applying nlp
    for col in weights.keys():
        df[col] = df[col].fillna('').map(str).apply(clean_txt)

    # Calculate cosine similarity between user_text and columns specified in weights for each row
    for i, row in df.iterrows():
        score = 0
        for col, weight in weights.items():
            col_text = row[col]
            if col_text:
                col_doc = nlp(col_text)
                col_score = doc1.similarity(col_doc) * weight
                score += col_score

        list_sim.append((doc1, row['combine'], i, score))

    return list_sim

def replace_target_position(target_position):
    target_position = target_position.lower()
    if "backend developer" in target_position:
        return "backend"
    elif "frontend developer" in target_position:
        return "frontend"
    elif "full-stack developer" in target_position:
        return "fullstack"
    else:
        return target_position

def recommend_job(id: int, categories: str = None):
    # Kiểm tra xem ID người dùng có tồn tại trong DataFrame users hay không
    if id not in users['id'].values:
        return "User không tồn tại. Vui lòng kiểm tra lại."
    
    # Lấy tập hợp các ID từ user_acc
    user_acc_ids = set(user_acc['id'].values)

    # Lấy tập hợp các ID từ users
    users_ids = set(users['id'].values)

    # Tìm các ID có trong user_acc nhưng không có trong users
    missing_ids = user_acc_ids - users_ids

    # Kiểm tra xem id có trong user_acc nhưng không có trong users
    if id in missing_ids:
        return "Cần cập nhật thông tin trong hồ sơ sinh viên"

    # Kiểm tra nếu timetable['user_id'] không có id đang xét
    if id not in timetable['user_id'].values:
        return "Cần cập nhật thời gian bận"          

    target_position = None

    for index, row in users.iterrows():
        if row['id'] == id:
            missing_columns = []

            if not row['full_name']:
                missing_columns.append('full_name')
            if not row['about_me']:
                missing_columns.append('about_me')
            if not row['good_at_position']:
                missing_columns.append('good_at_position')
            if not row['gender']:
                missing_columns.append('gender')
            if not row['address']:
                missing_columns.append('address')
            if row['year_of_experience'] is None:
                missing_columns.append('year_of_experience')
            if not row['skills']:
                missing_columns.append('skills')
            if not row['experiences']:
                missing_columns.append('experiences')
            if not row['experiences_title']:
                missing_columns.append('experiences_title')
            if not row['achievements']:
                missing_columns.append('achievements')

            if missing_columns:
                return "Cần cập nhật thêm 1 số thông tin trong hồ sơ sinh viên"

            target_position = row['good_at_position']

    # Tạo ma trận 24x7
    matrix = np.zeros((24, 7), dtype=int)

    # Chọn user_id cần xem
    user_id = id

    # Lấy thông tin lịch trình của user_id
    user_timetable = timetable[timetable['user_id'] == user_id]['coordinate'].values[0]

    # Kiểm tra nếu user_timetable không phải NaN
    if not pd.isnull(user_timetable):
        # Chia các tọa độ thành danh sách con
        coordinate_list = user_timetable.split(";")

        # Kiểm tra mỗi tọa độ trong danh sách con
        for coordinate in coordinate_list:
            day, hour = map(int, coordinate.split(","))
            matrix[hour - 1][day - 1] = 1

    # Xét từng cột và đếm số lượng số 1 trong mỗi cột
    ones_count = np.sum(matrix[6:19, :], axis=0)

    # Tìm các cột có số lượng số 1 xuất hiện nhiều hơn hoặc bằng 8 lần
    busy_columns = np.where(ones_count >= 8)[0]

    if len(busy_columns) >= 2:
        t = "Bán thời gian|Không yêu cầu"
    else:
        t = "Thực tập|Toàn thời gian|Không yêu cầu"

     # Xử lý timetable
    jobs_t = current_jobs[current_jobs['type'].str.contains(f'{t}', case=False)]

    # Lọc các công việc dựa trên giới tính
    gender = users[users['id'] == user_id]['gender'].iloc[0]
    
    if gender == 'Nữ':
        jobs_g = jobs_t[(jobs_t['gender'] == 'Nữ') | (jobs_t['gender'] == 'Không yêu cầu')]
    elif gender == 'Nam':
        jobs_g = jobs_t[(jobs_t['gender'] == 'Nam') | (jobs_t['gender'] == 'Không yêu cầu')]
    else:
        jobs_g = jobs_t


    # Lọc các công việc dựa trên địa chỉ
    user_address = users.loc[users['id'] == user_id, 'address'].iloc[0]
    user_address = user_address.strip()

    jobs_a = None

    if user_address in ['TPHCM', 'Hồ Chí Minh']:
        jobs_a = jobs_g[jobs_g[['location', 'title']].apply(lambda x: any(keyword in x['location'] or keyword in x['title'] for keyword in ['TPHCM', 'Hồ Chí Minh']), axis=1)]
    elif user_address in ['Hà Nội', 'HN']:
        jobs_a = jobs_g[jobs_g[['location', 'title']].apply(lambda x: any(keyword in x['location'] or keyword in x['title'] for keyword in ['Hà Nội', 'HN']), axis=1)]

    if jobs_a is None:
        jobs_a = jobs_g[jobs_g[['location', 'title']].apply(lambda x: user_address in x['location'] or user_address in x['title'], axis=1)]

    if jobs_a.empty:
        jobs_a = jobs_g


    # Lấy YearsExperience của người dùng   
    user_experience = users[users['id'] == user_id]['year_of_experience'].values[0]
    if user_experience == 0:
        min_yoe_condition = [0]
        max_yoe_condition = [0]
    elif user_experience == 1:
        min_yoe_condition = [0, 1]
        max_yoe_condition = [1]
    elif user_experience == 2:
        min_yoe_condition = [0, 2]
        max_yoe_condition = [2]
    else:
        min_yoe_condition = [0, user_experience]
        max_yoe_condition = [user_experience]

    jobs_ex = jobs_a[(jobs_a['min_yoe'].isin(min_yoe_condition)) & (jobs_a['max_yoe'].isin(max_yoe_condition))]
    #print(jobs_ex)
    
    jobs_ex['title'] = jobs_ex['title'].fillna('')
    jobs_ex['description'] = jobs_ex['description'].fillna('')
    jobs_ex['skills'] = jobs_ex['skills'].fillna('')
    jobs_ex['requirement'] = jobs_ex['requirement'].fillna('')
    # new column
    jobs_ex['combine'] = jobs_ex['title'] + " " + jobs_ex['description'] + " " + jobs_ex['skills'] + " " + jobs_ex['requirement']

    jobs_ex['combine'] = jobs_ex['combine'].map(str).apply(clean_txt)

    users['good_at_position'] = users['good_at_position'].fillna('')
    users['skills'] = users['skills'].fillna('')
    users['experiences'] = users['experiences'].fillna('')
    users['achievements'] = users['achievements'].fillna('')
    users['combine'] = users['good_at_position'] + " " + users['skills'] + " " + users['experiences'] + " " + users['achievements']

    users['combine'] = users['combine'].map(str).apply(clean_txt)

    nlp = spacy.load('vi_core_news_lg')
    
    # Get the user's combined text
    user_combine_text = users.loc[users['id'] == user_id, 'combine'].values[0]
    
    # Calculate similarity between user's combine text and jobs' combine text
    similarity_scores = calculate_sim_with_spacy(nlp, jobs_ex, user_combine_text, weights, n=10)
    
    # Sort the similarity scores in descending order based on similarity score
    sorted_scores = sorted(similarity_scores, key=lambda x: x[3], reverse=True)

    # Extract the recommended job IDs and similarity scores
    recommended_jobs = [(score[2], score[3]) for score in sorted_scores]

    # Filter the jobs dataframe based on the recommended job IDs
    recommended_jobs_df = jobs.loc[jobs.index.isin([job[0] for job in recommended_jobs])]

    # Create a list to store the job data
    job_data = []

    # Iterate over the recommended jobs DataFrame
    for job in recommended_jobs_df.itertuples():
        similarity_score = next(score[1] for score in recommended_jobs if score[0] == job.Index)
        job_info = job._asdict()
        job_info['Similarity Score'] = similarity_score
        job_data.append(job_info)

    # Create a DataFrame from the job_data list
    recommended_jobs_data_sorted = pd.DataFrame(job_data)

    # Chuyển target_position sang chữ thường và thay đổi thành từ viết tắt tương ứng
    target_position = replace_target_position(target_position)

    # Tăng độ ưu tiên cho các công việc có title chứa target_position
    recommended_jobs_data_sorted['Title Similarity'] = recommended_jobs_data_sorted['title'].apply(lambda x: fuzz.partial_ratio(target_position, x.lower()))

    # Lọc các công việc trong recommended_jobs_data_sorted có độ tương đồng với target_position cao hơn 70% hoặc có title chứa target_position
    recommended_jobs_data_filtered = recommended_jobs_data_sorted[
        (recommended_jobs_data_sorted['Title Similarity'] >= 80) |
        (recommended_jobs_data_sorted.apply(lambda row: fuzz.partial_ratio(target_position, row['requirement'].lower()) >= 70 or
                                                      fuzz.partial_ratio(target_position, row['description'].lower()) >= 70, axis=1))
    ]

    # Sắp xếp lại các công việc dựa trên độ tương đồng với target_position
    recommended_jobs_data_filtered = recommended_jobs_data_filtered.sort_values(by='Title Similarity', ascending=False)
    recommended_jobs_data_filtered = recommended_jobs_data_filtered.sort_values(by='Similarity Score', ascending=False)
    recommended_jobs_data_filtered['deadline'] = recommended_jobs_data_filtered['deadline'].dt.strftime('%d-%m-%Y')

    if recommended_jobs_data_filtered.empty or len(recommended_jobs_data_filtered) < 2:
        recommended_jobs_data_sorted = recommended_jobs_data_sorted.sort_values(by='Similarity Score', ascending=False)
        return recommended_jobs_data_sorted[:15]
    
    # Trả về các công việc đã lọc
    return recommended_jobs_data_filtered[:15]

# Lấy danh sách người dùng vừa được thêm mới hoặc chỉnh sửa
target_date = datetime.date.today()

# Trích xuất ngày từ cột created_at và updated_at
users['created_date'] = users['created_at'].dt.date
users['updated_date'] = users['updated_at'].dt.date

# Hàm cập nhật các biến liên quan đến MongoDB
def update_mongo_variables():
    global updated_users, updated_user_ids, mongo_user_ids, missing_ids

    # Cập nhật lại danh sách người dùng đã được thêm mới hoặc chỉnh sửa
    updated_users = users[(users['created_date'] == pd.to_datetime(target_date).date()) | (users['updated_date'] == pd.to_datetime(target_date).date())]

    # Cập nhật lại danh sách các ID của người dùng đã được thêm mới hoặc chỉnh sửa
    updated_user_ids = updated_users['id'].tolist()

    # Cập nhật lại danh sách user ids đã chạy trong MongoDB
    mongo_user_ids = set([user['user_id'] for user in collection.find()])

    # Cập nhật lại danh sách các user ids chưa có thông tin trong MongoDB
    missing_ids = [user_id for user_id in users['id'] if user_id not in mongo_user_ids]

# Gọi hàm cập nhật biến lúc ban đầu để đảm bảo các biến được khởi tạo đúng giá trị ban đầu
update_mongo_variables()

def get_recommendations_from_mongodb(user_id, categories=None):  
    # Find the document based on user_id
    document = collection.find_one({'user_id': user_id})

    # Return the recommended jobs as a JSON response with pagination
    if document:
        recommended_jobs = document['jobs']
        recommended_jobs_df = pd.DataFrame(recommended_jobs)

        # Filter jobs based on categories
        if categories:
            filtered_jobs = recommended_jobs_df[recommended_jobs_df['categories'].str.contains(categories, case=False)]
            if not filtered_jobs.empty:
                recommended_jobs_df = filtered_jobs

        return recommended_jobs_df

    return None

def save_recommendations_to_mongodb(user_id, jobs):
    # Create a document to be inserted
    document = {
        'user_id': user_id,
        'jobs': jobs.to_dict('records')  # Convert DataFrame to a list of dictionaries
    }
    
    # Insert the document into the collection
    collection.insert_one(document)

def delete_user_data_from_mongodb(user_id):
    # Define the filter to find the document with the given user_id
    filter = {'user_id': user_id}

    # Delete the document with the specified user_id from the collection
    collection.delete_one(filter)

def update_recommendations_to_mongodb(user_id, jobs):
    # Define the filter to find the document with the given user_id
    filter = {'user_id': user_id}

    # Create a document to be updated
    update = {
        '$set': {
            'jobs': jobs.to_dict('records')  # Convert DataFrame to a list of dictionaries
        }
    }

    # Update the document with the specified user_id in the collection
    collection.update_one(filter, update)

def process_user(user_id, categories=None):
    # Cập nhật lại các biến sau mỗi lần gọi hàm process_user để đảm bảo dữ liệu luôn được cập nhật mới nhất
    update_mongo_variables()

    if user_id not in missing_ids and user_id not in updated_user_ids:
        # Connect to MongoDB and get recommendations
        recommended_jobs_mongo = get_recommendations_from_mongodb(user_id)

        if recommended_jobs_mongo is not None:
            # Process recommended jobs from MongoDB
            return recommended_jobs_mongo

    # Check conditions and take appropriate actions
    if user_id in missing_ids and user_id not in updated_user_ids:
        # If user_id is in missing_ids but not in updated_user_ids
        recommended_jobs = recommend_job(user_id, categories)
        save_recommendations_to_mongodb(user_id, recommended_jobs)
    elif user_id in updated_user_ids:
        # If user_id is in updated_user_ids
        recommended_jobs = recommend_job(user_id, categories)
        update_recommendations_to_mongodb(user_id, recommended_jobs)

    return recommended_jobs

# gợi ý công việc cho sinh viên
@app.get("/recommend-job/{user_id}")
async def recommend_job_mongo(
    user_id: Optional[int] = None,
    categories: Optional[str] = None,
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Number of results per page"),
):
    if user_id is None:
        return {
            "error": True,
            "message": "Kiểm tra input đầu vào",
            "data": None,
            "status_code": 400
        }

    if user_id < 0:
        return {
            "error": True,
            "message": "Đầu vào là số nguyên dương",
            "data": None,
            "status_code": 400
        }

    try:
        update_mongo_variables()
        # In giá trị của các biến
        print("Missing IDs:", missing_ids)
        print("Updated User IDs:", updated_user_ids)
        print("mongo_user_ids:", mongo_user_ids)

        recommended_jobs = process_user(user_id, categories)
        
        if recommended_jobs is not None:
            # Process "categories" and "skills" fields to convert them to lists
            recommended_jobs["categories"] = recommended_jobs["categories"].str.split(",")
            recommended_jobs["skills"] = recommended_jobs["skills"].str.split(",")
            
            # Pagination logic
            total_results = len(recommended_jobs)
            start_index = (page - 1) * limit
            end_index = start_index + limit
            paginated_jobs = recommended_jobs[start_index:end_index]
            
            return {
                "error": False,
                "message": "Xử lí thành công",
                "data": {
                    "jobs": {
                        "current_page": page,
                        "data": paginated_jobs.to_dict(orient="records")
                    }
                },
                "status_code": 200
            }
        else:
            return {
                "error": False,
                "message": "No recommended jobs found for the given user_id.",
                "data": {
                    "jobs": {
                        "current_page": page,
                        "data": []
                    }
                },
                "status_code": 200
            }
    except (ConnectionError, TimeoutError, Timeout) as e:
        # Xử lý lỗi mạng
        return {
            "error": True,
            "message": "Lỗi mạng",
            "data": None,
            "status_code": 503
        }
    except (ValueError, TypeError) as e:
        # Xử lý lỗi đầu vào gây crash hoặc lỗi xử lý không mong muốn
        return {
            "error": True,
            "message": "Lỗi đầu vào gây crash",
            "data": None,
            "status_code": 400
        }
    except Exception as e:
        return {
            "error": True,
            "message": "Lỗi đầu vào không hợp lệ/ Lỗi website đang gặp sự cố",
            "data": None,
            "status_code": 500
        }