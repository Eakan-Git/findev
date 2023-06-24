import os
from dotenv import load_dotenv
from paginate_sqlalchemy import SqlalchemyOrmPage
import math
import pandas as pd
import mysql.connector
from elasticsearch import Elasticsearch
from fastapi import FastAPI
from fastapi import Query
from pymongo import MongoClient
import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from gensim.models import Word2Vec
import warnings
from tika import parser
import cv2
import re
import shutil
import pyrebase
from pdf2image import convert_from_path
import dlib
import urllib.parse
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import os
import requests
from fastapi.middleware.cors import CORSMiddleware

warnings.simplefilter('ignore')

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
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
collection = db['user_history']

# Establish MySQL connection
cnx = mysql.connector.connect(
    user=os.environ.get("MYSQL_USER"),
    database=os.environ.get("MYSQL_DATABASE"),
    password=os.environ.get("MYSQL_PASSWORD")
)
cursor = cnx.cursor()


def find_user_ids_by_job_title(job_title):
    pipeline = [
        {"$match": {"jobs.title": job_title}},
        {"$project": {"_id": 0, "user_id": "$userid"}}
    ]
    
    result = collection.aggregate(pipeline)
    user_ids = list(set(doc["user_id"] for doc in result))
    
    return user_ids

def get_user_profiles(job_title, page: int = 1, limit: int = 10):
    user_ids = find_user_ids_by_job_title(job_title)
    if not user_ids:
        return []

    random.shuffle(user_ids)  # Xáo trộn danh sách user_ids

    # Lấy ngẫu nhiên 10 user_ids nếu có nhiều hơn 10
    if len(user_ids) > 10:
        user_ids = user_ids[:10]

    # Câu truy vấn để lấy thông tin hồ sơ người dùng từ MySQL
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

    # Thực thi truy vấn và lấy kết quả từ MySQL
    cursor = cnx.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    

    columns = [column[0] for column in cursor.description]
    df = pd.DataFrame(results, columns=columns)

    user_profiles = df.to_dict('records')
    return user_profiles

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
    DATE_FORMAT(j.deadline, '%d-%m-%Y') AS deadline,
    j.requirement,
    j.location,
    GROUP_CONCAT(s.skill SEPARATOR ', ') AS skills,
    company_profiles.id AS company_id,
    company_profiles.name AS company_name,
    company_profiles.logo AS company_logo,
	company_profiles.description AS company_description,
    company_profiles.site AS company_site,
    company_profiles.address AS company_address,
    company_profiles.size AS company_size,
    company_profiles.phone AS company_phone,
    company_profiles.email AS company_email
    FROM
    jobs j
	JOIN job_skills s ON j.id = s.job_id
    JOIN employer_profiles ON j.employer_id = employer_profiles.id
    JOIN company_profiles ON employer_profiles.company_id = company_profiles.id
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
df_job = pd.DataFrame(job_results, columns=job_columns)

# Define the SQL query for users
query_user = """
SELECT
  up.id,
  up.full_name,
  up.about_me,
  up.good_at_position,
  up.gender,
  GROUP_CONCAT(DISTINCT us.skill) AS skills,
  GROUP_CONCAT(DISTINCT ue.description ORDER BY ue.user_id SEPARATOR '; ') AS experiences,
  GROUP_CONCAT(DISTINCT ue.title ORDER BY ue.user_id SEPARATOR '; ') AS experiences_title
FROM
  user_profiles up
LEFT JOIN user_educations ued ON up.id = ued.user_id
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

# Execute the users query and fetch the results
cursor.execute(query_user)
user_results = cursor.fetchall()

# Get the column names for users
user_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for users
df_user = pd.DataFrame(user_results, columns=user_columns)

@app.on_event("startup")
def startup_event():
    # Execute SQL query to retrieve job data
    cursor = cnx.cursor()
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
    DATE_FORMAT(j.deadline, '%d-%m-%Y') AS deadline,
    j.requirement,
    j.location,
    GROUP_CONCAT(s.skill SEPARATOR ', ') AS skills,
    company_profiles.id AS company_id,
    company_profiles.name AS company_name,
    company_profiles.logo AS company_logo,
	company_profiles.description AS company_description,
    company_profiles.site AS company_site,
    company_profiles.address AS company_address,
    company_profiles.size AS company_size,
    company_profiles.phone AS company_phone,
    company_profiles.email AS company_email
    FROM
    jobs j
	JOIN job_skills s ON j.id = s.job_id
    JOIN employer_profiles ON j.employer_id = employer_profiles.id
    JOIN company_profiles ON employer_profiles.company_id = company_profiles.id
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
    cursor.close()

    # Create DataFrame from the SQL results
    columns = ['job_id', 'title', 'description', 'min_salary', 'max_salary', 'recruit_num', 'position', 'type',
               'min_yoe', 'max_yoe', 'benefit', 'deadline', 'requirement', 'location', 'skills', 'company_id', 'company_name', 'company_logo', 'company_description',
               'company_site', 'company_address', 'company_size', 'company_phone', 'company_email']

    df = pd.DataFrame(results, columns=columns)

    # Delete all data in Elasticsearch
    def delete_all_data():
        response = es.indices.delete(index="_all")
        return response

    delete_all_data()

    index_name = "jobs_index"
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)

    # Create or update Elasticsearch index
    index_name = "jobs_index"
    index_mapping = {
        "mappings": {
            "properties": {
                "job_id": {"type": "integer"},
                "title": {"type": "text"},
                "description": {"type": "text"},
                "min_salary": {"type": "integer"},
                "max_salary": {"type": "integer"},
                "recruit_num": {"type": "integer"},
                "position": {"type": "keyword"},
                "min_yoe": {"type": "integer"},
                "max_yoe": {"type": "integer"},
                "benefit": {"type": "text"},
                "deadline": {"type": "date", "format": "dd-MM-yyyy"},
                "requirement": {"type": "text"},
                "location": {"type": "text"},
                "skills": {"type": "text"}
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

@app.get("/jobs")
def search_jobs(
    keyword: str = Query(..., description="Keyword to search for"),
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Number of results per page"),
):
    # Search for jobs in Elasticsearch
    body = {
        "size": limit,
        "from": (page - 1) * limit,
        "query": {
            "multi_match": {
                "query": keyword,
                "fields": ["*"]
            }
        }
    }

    result = es.search(index="jobs_index", body=body)
    hits = result["hits"]["hits"]

    jobs = []
    for hit in hits:
        job_info = hit["_source"]
        jobs.append(job_info)

    total = result["hits"]["total"]["value"]

    # Calculate pagination information
    total_pages = math.ceil(total / limit)
    base_url = f"http://localhost:8000/jobs?keyword={keyword}"
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

    if len(jobs) == 0:
        return {
            "error": True,
            "message": "Không tìm thấy công việc",
            "data": None,
            "status_code": 400
        }
    
    pagination_info = {
        "first_page_url": first_page_url,
        "from": (page - 1) * limit + 1,
        "last_page": last_page,
        "last_page_url": last_page_url,
        "links": links,
        "next_page_url": f"{base_url}&page={next_page}" if next_page else None,
        "path": f"http://localhost:8000/jobs?keyword={keyword}",
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
                "first_page_url": first_page_url,
                "from": (page - 1) * limit + 1,
                "last_page": last_page,
                "last_page_url": last_page_url,
                "links": links,
                "next_page_url": f"{base_url}&page={next_page}" if next_page else None,
                "path": f"http://localhost:8000/jobs?keyword={keyword}",
                "per_page": limit,
                "prev_page_url": f"{base_url}&page={prev_page}" if prev_page else None,
                "to": min(page * limit, total),
                "total": total
            }
        },
        "status_code": 200
    }

@app.get("/user_profiles/{job_title}")
def get_user_profiles_by_job_title(job_title: str, page: int = Query(1, gt=0), limit: int = Query(10, gt=0, le=100)):
    user_profiles = get_user_profiles(job_title, page, limit)
    
    total = len(user_profiles)
    total_pages = math.ceil(total / limit)
    base_url = f"http://localhost:8000/user_profiles/{job_title}"
    first_page_url = f"{base_url}?page=1&limit={limit}"
    last_page = total_pages
    last_page_url = f"{base_url}?page={last_page}&limit={limit}"
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
            "url": f"{base_url}?page={i}&limit={limit}",
            "label": str(i),
            "active": page == i
        })

    links.append({
        "url": f"{base_url}?page={next_page}&limit={limit}" if next_page else None,
        "label": "Next &raquo;",
        "active": False
    })

    if len(user_profiles) == 0:
        return {
            "error": True,
            "message": "Không tìm thấy thông tin người dùng",
            "data": None,
            "status_code": 400
        }
    
    pagination_info = {
        "first_page_url": first_page_url,
        "from": (page - 1) * limit + 1,
        "last_page": last_page,
        "last_page_url": last_page_url,
        "links": links,
        "next_page_url": f"{base_url}?page={next_page}&limit={limit}" if next_page else None,
        "path": f"http://localhost:8000/user_profiles/{job_title}",
        "per_page": limit,
        "prev_page_url": f"{base_url}?page={prev_page}&limit={limit}" if prev_page else None,
        "to": min(page * limit, total),
        "total": total
    }

    return {
        "error": False,
        "message": "Xử lí thành công",
        "data": {
            "user_profiles": {
                "current_page": page,
                "data": user_profiles,
                "pagination_info": pagination_info
            }
        },
        "status_code": 200
    }

# Connect to MongoDB for job_add collection
client_job_add = MongoClient(os.environ.get("MONGODB_CONNECTION_STRING"))
db_job_add = client_job_add['BaseOnAL']
collection_job_add = db_job_add['job_add']

# Read data from the collection
data = collection_job_add .find()

# Create a list of dictionaries
documents = [document for document in data]

# Create a DataFrame
df = pd.DataFrame(documents)

## Preprocess job descriptions, skills, and requirements
df_job['description'] = df_job['description'].fillna('')
df_job['skills'] = df_job['skills'].fillna('')
df_job['requirement'] = df_job['requirement'].fillna('')

# Preprocess user profiles
df_user['about_me'] = df_user['about_me'].fillna('')
df_user['skills'] = df_user['skills'].fillna('')
df_user['experiences'] = df_user['experiences'].fillna('')

# Preprocess job descriptions, requirements, and benefits from df
df['Mô tả công việc'] = df['Mô tả công việc'].fillna('')
df['Yêu cầu ứng viên'] = df['Yêu cầu ứng viên'].fillna('')
df['Quyền lợi'] = df['Quyền lợi'].fillna('')

# Train Word2Vec model
corpus = (
    df_job['description'].fillna('').astype(str) + ' ' +
    df_job['skills'].fillna('').astype(str) + ' ' +
    df_job['requirement'].fillna('').astype(str) + ' ' +
    df_user['about_me'].fillna('').astype(str) + ' ' +
    df_user['skills'].fillna('').astype(str) + ' ' +
    df['Mô tả công việc'].fillna('').astype(str) + ' ' +
    df['Yêu cầu ứng viên'].fillna('').astype(str) + ' ' +
    df['Quyền lợi'].fillna('').astype(str) + ' ' +
    df_user['experiences'].fillna('').astype(str)
)

corpus_tokens = []
for sentence in corpus:
    try:
        tokens = sentence.split()
        corpus_tokens.append(tokens)
    except AttributeError:
        continue

model = Word2Vec(corpus_tokens, vector_size=100, window=5, min_count=1, workers=4)

def calculate_job_similarity(user_description, user_skills, user_requirements, job_description, job_skills, job_requirements):
    # Tokenize user information and job information
    user_info_tokens = user_description.split() + user_skills.split() + user_requirements.split()
    job_info_tokens = job_description.split() + job_skills.split() + job_requirements.split()

    # Generate Word2Vec embeddings for user information and job information
    user_info_embeddings = np.array([model.wv[word] for word in user_info_tokens if word in model.wv.key_to_index])
    job_info_embeddings = np.array([model.wv[word] for word in job_info_tokens if word in model.wv.key_to_index])

    # Calculate the cosine similarity between user information and job information
    similarity_scores = cosine_similarity(user_info_embeddings, job_info_embeddings)

    # Return the average cosine similarity score
    return np.mean(similarity_scores)

def recommend_jobs_for_user(user_id):
    # Retrieve the user information based on user_id
    user = df_user.loc[df_user['id'] == user_id]
    user_description = user['about_me'].values[0]
    user_skills = user['skills'].values[0]
    user_requirements = ""

    # Calculate the similarity between the user and each job
    job_similarity_scores = []
    for index, job in df_job.iterrows():
        job_description = job['description']
        job_skills = job['skills']
        job_requirements = job['requirement']
        similarity_score = calculate_job_similarity(user_description, user_skills, user_requirements, job_description, job_skills, job_requirements)
        job_similarity_scores.append((job['job_id'], job['title'], similarity_score))

    # Remove None values from similarity scores
    job_similarity_scores = [score for score in job_similarity_scores if score[2] is not None]

    # Sort the jobs based on similarity score in descending order
    job_similarity_scores.sort(key=lambda x: np.mean(x[2]) if np.iterable(x[2]) else x[2], reverse=True)

    # Create a list to store the detailed job information
    detailed_jobs_info = []

    # Get detailed information for all recommended jobs
    for job in job_similarity_scores:
        job_id = job[0]
        job_title = job[1]
        similarity_score = job[2]

        # Retrieve detailed job information from the DataFrame
        job_info = df_job.loc[df_job['job_id'] == job_id].iloc[0].to_dict()

        # Add similarity score to the job information
        job_info['similarity_score'] = similarity_score

        # Append the job information to the list
        detailed_jobs_info.append(job_info)

    # Create a DataFrame from the detailed job information list
    detailed_jobs_df = pd.DataFrame(detailed_jobs_info)

    # Print the detailed job information
    return detailed_jobs_df

@app.get("/recommend_jobs/{user_id}")
def get_recommended_jobs(user_id: int, page: int = Query(1, ge=1), limit: int = Query(10, ge=1)):
    page_size = limit
    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    recommended_jobs = recommend_jobs_for_user(user_id)
    paginated_jobs = recommended_jobs[start_index:end_index].to_dict(orient='records')

    total_jobs = len(recommended_jobs)
    total_pages = math.ceil(total_jobs / limit)

    first_page_url = f"http://localhost:8000/recommend_jobs/{user_id}?page=1"
    last_page = total_pages
    last_page_url = f"http://localhost:8000/recommend_jobs/{user_id}?page={last_page}"
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
            "url": f"http://localhost:8000/recommend_jobs/{user_id}?page={i}",
            "label": str(i),
            "active": page == i
        })

    links.append({
        "url": f"http://localhost:8000/recommend_jobs/{user_id}?page={next_page}" if next_page else None,
        "label": "Next &raquo;",
        "active": False
    })

    pagination_info = {
        "current_page": page,
        "data": paginated_jobs,
        "first_page_url": first_page_url,
        "from": start_index + 1,
        "last_page": last_page,
        "last_page_url": last_page_url,
        "links": links,
        "next_page_url": f"http://localhost:8000/recommend_jobs/{user_id}?page={next_page}" if next_page else None,
        "path": f"http://localhost:8000/recommend_jobs/{user_id}",
        "per_page": limit,
        "prev_page_url": f"http://localhost:8000/recommend_jobs/{user_id}?page={prev_page}" if prev_page else None,
        "to": min(end_index, total_jobs),
        "total": total_jobs
    }

    if len(paginated_jobs) == 0:
        return {
            "error": True,
            "message": "Xử lí lổi",
            "data": None,
            "status_code": 400
        }

    return {
        "error": False,
        "message": "Xử lí thành công",
        "data": {
            "jobs": pagination_info
        },
        "status_code": 200
    }

# Hoang
# Define vietnamese component in list
def HasVietnamese(string):
    pattern = re.compile(r'\b\w*[àáạảãăắằẳẵặâấầẩẫậèéẹẻẽêếềểễệìíịỉĩòóọỏõôốồổỗộơớờởỡợùúụủũưứừửữựỳýỵỷỹđ]+\w*\b', re.IGNORECASE)
    if pattern.search(string):
        return True
    return False
# Remove character isn't alphabet
def RemoveNonAlphabet(strings):
    alphabet_pattern = re.compile('[^a-zA-ZÀ-ỹ ]')
    cleaned_strings = []
    for string in strings:
        cleaned_string = alphabet_pattern.sub('', string)
        cleaned_strings.append(cleaned_string)
    return cleaned_strings
# Delete line contains string
def DeleteLine(string, remove):
    lines = string.split('\n')
    filtered_lines = [line for line in lines if remove not in line]
    updated_text = '\n'.join(filtered_lines)
    return updated_text
# Read Information
def ReadBirthday(string):
    birthday = None
    split_n= string.split('\n') # split '\n'
    split_n = [string for string in split_n if string] # delete empty component
    Birthday_pattern_1 = r'\d{2}/\d{2}/\d{4}'
    Birthday_pattern_2 = r'\d{2}-\d{2}-\d{4}'
    Birthday_pattern_3 = r"(?i)(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}"    
    for birthday in split_n:
        if re.search(Birthday_pattern_1, birthday):
            birthday = (re.search(Birthday_pattern_1, birthday)).group(0)
            if (birthday[-4:] <= '2005'):
                return birthday
        if re.search(Birthday_pattern_2, birthday):
            birthday = (re.search(Birthday_pattern_2, birthday)).group(0)
            if (birthday[-4:] <= '2005'):
                return birthday
        if re.search(Birthday_pattern_3, birthday):
            birthday = (re.search(Birthday_pattern_3, birthday)).group(0)
            if (birthday[-4:] <= '2005'):
                return birthday
def ReadPhoneNumber(string):
    number = None
    split_n= string.split('\n') # split '\n'
    split_n = [string for string in split_n if string] # delete empty component
    Phone_pattern = r"[^0-9/]"
    Phone_pattern_1 = r'\b0\d{9}'
    Phone_pattern_2 = r'\b84\d{9}'
    for phone in split_n:
        phone = phone.replace(' ', '') # Delete space
        if re.findall(Phone_pattern_1, phone): # start with 0
            number = re.findall(Phone_pattern_1, phone)
        if number == None: # but have - or . or space between
            phone = re.sub(Phone_pattern, '', phone)
            if re.findall(Phone_pattern_1, phone): # start with 0
                number = re.findall(Phone_pattern_1, phone)
            if re.findall(Phone_pattern_2, phone): # start with 84
                number = re.findall(Phone_pattern_2, phone)
    if number == None:
        return number
    else:
        return number.pop()
def ReadEmail(string):
    email = None
    split_n= string.split('\n') # split '\n'
    split_n = [string for string in split_n if string] # delete empty component
    # Read Email
    for email in split_n:
        if "@gmail" in email and 'mailto' not in email:
            email = email.replace("Email", '') # delete word
            return email
def ReadGithub(string):
    github = None
    split_n= string.split('\n') # split '\n'
    split_n = [string for string in split_n if string] # delete empty component
    # Read Email
    for github in split_n:
        if "github" in github and 'https' in github:
            index = github.find("https")
            github = github[index:]
            return github
def ReadLink(string):
    result = []
    link = None
    split_n= string.split('\n') # split '\n'
    split_n = [string for string in split_n if string] # delete empty component
    # Read Email
    for link in split_n:
        if "www." in link:
            index = link.find("www.")
            link = link[index:]
            result.append(link)
    return result
def ReadContent(string):
    split = string.split('\n') # split '\n'
    split = [string for string in split if string] # delete empty component
    # Read tittle
    tittle = []
    for i in split:
        if i.isupper():
            tittle.append(i)
    # Check form
    if len(tittle) <= 1:
        return [], []
    # Delete non alphabet in tittle
    tittle = RemoveNonAlphabet(tittle)
    # Read name
    name = tittle.pop(0)
    content = []
    # Get content 
    for i in range (0, len(tittle) - 1): # Get content between 2 upper words
        start = tittle[i]
        end = tittle[i + 1]
        pattern = rf"(?<=\b{start}\b)(.*?)(?=\b{end}\b)"
        match = re.search(pattern, string, re.DOTALL)
        if match:
            content_between_words = match.group().strip()
            content.append(content_between_words)
    last = tittle[-1] # Get content of last upper word
    temp = string.split(last, 1)[-1].strip()
    content.append(temp)
    # Number of upper tittle not equal to content
    if len(content) != len(tittle):
        return [], []
    if(len(name.split()) < 3):
        return [], []
    # Check component Contact
    if "CONTACT" not in tittle:
        if "PROFILE" not in tittle:
            return [], []
    # Check Vietnamese
    for i in tittle:
        if HasVietnamese(i):
            return [], []
    # Return default form
    key = ['NAME', 'POSITION', 'PERSONAL']
    value = []
    # Add name
    name = name.replace('\n', '') # Delete '/n'
    value.append(name) 
    # Add position
    if(len(tittle) == len(content)):
        position = tittle.pop(0) 
        position = position.replace('\n', '') # Delete '/n'
        value.append(position)
    else:
        value.append([])
    # Add personal
    personal = content.pop(0)
    personal = personal.replace('\n', '') # Delete '/n'
    value.append(personal)
    # Add another one
    if tittle != None and content != None:
        while tittle:
            temp_1 = tittle.pop()
            temp_2 = content.pop()
            if 'CONTACT' in temp_1 or 'PROFILE:' in temp_1: # Read each information in contact
                # Add birthday
                key.append('BIRTHDAY')
                tmp = ReadBirthday(temp_2)
                if tmp != None:
                    temp_2 = DeleteLine(temp_2, tmp)
                value.append(tmp)
                # Add phone number
                key.append('PHONE')
                tmp = ReadPhoneNumber(temp_2)
                if tmp != None:
                    temp_2 = DeleteLine(temp_2, tmp[-3:])
                    if tmp[:2] == "84": # Change 84 to 0
                        tmp = '0' + tmp[2:]
                value.append(tmp)
                # Add email
                key.append('GMAIL')
                tmp = ReadEmail(temp_2)
                if tmp != None:
                    temp_2 = DeleteLine(temp_2, tmp)
                value.append(tmp)
                # Add github
                key.append('GITHUB')
                tmp = ReadGithub(temp_2)
                if tmp != None:
                    temp_2 = DeleteLine(temp_2, tmp)
                value.append(tmp)
                # Add all link
                key.append('LINK')
                tmp = ReadLink(temp_2)
                if tmp != None:
                    for i in tmp:
                        temp_2 = DeleteLine(temp_2, i)
                value.append(tmp)
                # Add address
                key.append('ADDRESS')
                value.append(temp_2)
            else: # Read information
                key.append(temp_1)
                value.append(temp_2)
    # Return
    return key, value
# Get image
def UploadImage(path):
     # Set Config
    config = {
  "apiKey": os.environ.get("API_KEY"),
  "authDomain": os.environ.get("AUTH_DOMAIN"),
  "databaseURL": os.environ.get("DATABASE_URL"),
  "projectId": os.environ.get("PROJECT_ID"),
  "storageBucket": os.environ.get("STORAGE_BUCKET"),
  "messagingSenderId": os.environ.get("MESSAGING_SENDER_ID"),
  "appId": os.environ.get("APP_ID"),
  "measurementId": os.environ.get("MEASUREMENT_ID")}
    # Set information
    firebase = pyrebase.initialize_app(config)
    storage = firebase.storage() 
    # Upload image
    storage.child(path).put(path)   
    auth = firebase.auth()
    # Information
    email = os.environ.get("EMAIL")
    password = os.environ.get("PASSWORD")
    # Get URL
    user = auth.sign_in_with_email_and_password(email, password)
    url = storage.child(path).get_url(user['idToken'])
    # Hide token of URL
    url = urllib.parse.urlparse(url)
    query_params = urllib.parse.parse_qs(url.query)
    query_params.pop('token', None)
    url = urllib.parse.urlunparse(url._replace(query=urllib.parse.urlencode(query_params, doseq=True)))
    return(url)
def DetectFaces(path):
    # Link URL
    link = ""
    # Convert PDF to images
    images = convert_from_path(path)
    # Face detector 
    face_detector = dlib.get_frontal_face_detector()
    # Convet into MAT from
    image = np.array(images[0])
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Detect face in grayscale
    faces = face_detector(gray_image)
    # Scale 
    scale_factor = 1.5
    # Check if any faces are detected
    if len(faces) > 0:
        for face in faces:
            x, y, w, h = face.left(), face.top(), face.width(), face.height()
            dlib.rectangle(left=x, top=y, right=x + w, bottom=y + h)
            # Apply scaling factor to the dimensions
            x -= int(w * (scale_factor - 1) / 2)
            y -= int(h * (scale_factor - 1) / 2)
            w = int(w * scale_factor)
            h = int(h * scale_factor)
            # Save cropped face image
            cropped_image = image[max(0, y):y + h, max(0, x):x + w]
            # Convert into RGB channels
            cropped_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB)
            # save the cropped face image
            face_image_path = "crop.jpg"
            cv2.imwrite(face_image_path, cropped_image)
            # Upload image and get URL
            link = UploadImage(face_image_path)
            # Remove file at local
            os.remove(face_image_path)
    return link
# Return result
def ExtractTextFromPDF(path):
    key = []
    value = []
    result = ''
    link = DetectFaces(path)
    raw_text = parser.from_file(path)
    text = raw_text['content']
    key, value = ReadContent(text)
    if len(key) != 0 and len(value) != 0:
        # Get name
        name = about = position = birthday = address= email = phone = ''
        education = experience = achievement = skill = github = activity = info = ''
        tmp = None # None value
        for i in range(0, len(key)):
            if(key[i] == "NAME"):
                name = value[i]
                continue
            if(key[i] == "PERSONAL"):
                about = value[i]
                continue 
            if(key[i] == "POSITION"):
                position = value[i]
                continue     
            if(key[i] == "BIRTHDAY"):
                birthday = value[i]
                continue
            if(key[i] == "ADDRESS"):
                address = value[i] 
                continue
            if(key[i] == "GMAIL"):
                email = value[i]  
                continue
            if(key[i] == "PHONE"):
                phone = value[i] 
                continue
            if(key[i] == "UNIVERSITY PROJECTS"):
                education = value[i]  
                continue
            if(key[i] == "WORK EXPERIENCE"):
                experience = value[i]  
                continue
            if(key[i] == "ACHIEVEMENTS"):
                achievement = value[i]  
                continue
            if(key[i] == "SKILLS"):
                skill = value[i]  
                continue
            if(key[i] == "GITHUB"):
                github = value[i]  
                continue
            if(key[i] == "ACTIVITIES"):
                activity = value[i]  
                continue
            if(key[i] == "LINK"):
                info = value[i]  
                continue
        result = {
        "error": False,
        "message": "Trích xuất thông tin CV thành công",
        "data":{
            "user_profile":{
                "id": '',
                "full_name": name,
                "avatar": link,
                "about_me": about,
                "good_at_position": position,
                "year_of_experience": tmp,
                "date_of_birth": birthday,
                "gender": tmp,
                "address": address,
                "email": email,
                "phone": phone,
                "created_at": tmp,
                "updated_at": tmp,
                "educations": education,
                'cvs': tmp,
                "experiences": experience,
                "achievements": achievement,
                "skills" : skill,
                "time_tables": tmp,
                "github" : github, 
                "activities": activity,
                "link": info
            },
            "status_code": 200
        }
        }
    else: 
        result ={
            "error": True,
            "message": "Định dạng CV chưa được hỗ trợ",
            "data": ''
        }
    return JSONResponse(content=result)
# API  
app = FastAPI()
# Read_CV
def cleanup_temp_directory():
    if os.path.exists(UPLOAD_DIRECTORY):
        shutil.rmtree(UPLOAD_DIRECTORY)
UPLOAD_DIRECTORY = "temp_uploads"
@app.post("/read-cv")
async def read_cv(file: UploadFile = File(...)):
    try:
        if not os.path.exists(UPLOAD_DIRECTORY):
            os.makedirs(UPLOAD_DIRECTORY)
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
        result = ExtractTextFromPDF(file_path)
        os.remove(file_path)
        return result
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
       }
    finally:
        cleanup_temp_directory()
# Detect_Faces
@app.post("/detect-faces")
async def detect_faces(image: UploadFile = File(...)):
    try:
        # Read the uploaded image file
        image_data = await image.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # Face detector 
        face_detector = dlib.get_frontal_face_detector()
        # Convert to grayscale
        gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Detecting
        faces = face_detector(gray_image)
        # Check if any faces are detected
        if len(faces) > 0:
            bool_result = True
        else:
            bool_result = False
        # Return the boolean result as JSON response
        return JSONResponse({
            "error": False,
            "message": bool_result,})
    except Exception as e:
        return JSONResponse({"error": True,
                            "messsage": str(e)})