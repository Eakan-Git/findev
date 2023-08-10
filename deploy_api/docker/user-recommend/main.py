import os
from typing import Optional
from typing import List
import urllib.parse
from paginate_sqlalchemy import SqlalchemyOrmPage
import math
import pandas as pd
import mysql.connector
from pymongo import MongoClient
from requests.exceptions import ConnectionError, Timeout
import numpy as np
import warnings
import re
import json
import requests
import urllib.parse
import nltk
import spacy
import string
from pydantic import BaseModel
from typing import List
from nltk.stem import WordNetLemmatizer
from nltk import word_tokenize
import datetime
from bson.regex import Regex
from fuzzywuzzy import fuzz
from pytz import timezone
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
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

nltk.download('punkt', quiet=True, force=True)
nltk.download('wordnet', quiet=True, force=True)
nltk.download('averaged_perceptron_tagger', quiet=True, force=True)
nltk.download('omw-1.4', quiet=True, force=True)
# Tên biến toàn cục để lưu trữ nội dung của tệp
global stopwords_vn 
stopwords_vn = None
wn = WordNetLemmatizer()

def connection_mongo():
    # Connect to MongoDB
    client = MongoClient(os.environ.get("MONGODB_CONNECTION_STRING"))
    db = client['BaseOnAL']
    collection = db['test_user']
    return collection


def load_stopwords():
    file_url = "https://drive.google.com/uc?id=1AQrnIFnqzPQbXXbYRADj5yh1I3_E_YMt"
    response = requests.get(file_url)
    stopwords_vn = response.text.splitlines()
    return stopwords_vn

def black_txt(word, stopwords):
    return word.lower() not in set(stopwords) and word.lower() not in list(string.punctuation)

stopwords_vn = load_stopwords()

def clean_txt(text, stopwords):
    vietnamese_lower = "aáàảãạăắằẳẵặâấầẩẫậbcedđeéèẻẽẹêếềểễệghiíìỉĩịjklmnoóòỏõọôốồổỗộơớờởỡợpqrstuúùủũụưứừửữựvxyýỳỷỹỵ"
    clean_text = []
    clean_text2 = []
    text = re.sub("'", "", text)
    text = re.sub("(\\d|\\W)+", " ", text)
    text = re.sub(r'(?<=[a-zÀ-ỸẠ-Ỵ])(?=[A-ZĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY])', ' ', text)
    clean_text = [wn.lemmatize(word, pos="v") for word in word_tokenize(text.lower()) if black_txt(word, stopwords)]
    clean_text2 = [word.replace('_', ' ') for word in clean_text if word not in vietnamese_lower]
    return " ".join(clean_text2)

# read data from mysql
def read_data_mysql():
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

    # Define the query to retrieve job data
    query_job = """
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
        GROUP_CONCAT(DISTINCT c.description SEPARATOR ', ') AS categories,
        j.created_at,
        j.updated_at
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
        j.requirement,
        j.created_at,
        j.updated_at;
    """
    # Execute the job query and fetch the results
    cursor.execute(query_job)
    job_results = cursor.fetchall()
    
    # Get the column names for jobs
    job_columns = [desc[0] for desc in cursor.description]
    
    # Create a DataFrame for jobs
    jobs = pd.DataFrame(job_results, columns=job_columns)
    
    # Define the query to retrieve user data
    query_user = """
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
        GROUP_CONCAT(DISTINCT ue.title ORDER BY ue.user_id SEPARATOR '; ') AS experiences_title,
        GROUP_CONCAT(DISTINCT ua.description ORDER BY ua.user_id SEPARATOR '; ') AS achievements,
        cv.cv_path,
        tm.coordinate,
        up.created_at,
        up.updated_at    
    FROM
        user_profiles up
    LEFT JOIN user_skills us ON up.id = us.user_id
    LEFT JOIN time_tables tm ON up.id = tm.user_id
    LEFT JOIN user_achievements ua ON up.id = ua.user_id
    LEFT JOIN (
        SELECT user_id, MAX(updated_at) AS max_updated_at
        FROM cv
        GROUP BY user_id
    ) latest_cv ON up.id = latest_cv.user_id
    LEFT JOIN cv ON latest_cv.user_id = cv.user_id AND latest_cv.max_updated_at = cv.updated_at
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
        cv.cv_path,
        tm.coordinate;
    """
    
    # Execute the user query and fetch the results
    cursor.execute(query_user)
    user_results = cursor.fetchall()
    
    # Get the column names for users
    user_columns = [desc[0] for desc in cursor.description]
    
    # Create a DataFrame for users
    users = pd.DataFrame(user_results, columns=user_columns)
    
    # # Define user_account
    # user_account = """
    #     select
    #     id,
    #     username,
    #     password,
    #     is_banned,
    #     locked_until,
    #     last_login
    #     from 
    #     user_accounts
    #     """
    # # Execute the timetable query and fetch the results
    # cursor.execute(user_account)
    # acc_results = cursor.fetchall()

    # # Get the column names for timetable
    # acc_columns = [desc[0] for desc in cursor.description]

    # # Create a DataFrame for timetable
    # user_acc = pd.DataFrame(acc_results, columns=acc_columns)

    # # Define the query to retrieve timetable data
    # query_timetable = """
    # SELECT *
    # FROM time_tables
    # """
    
    # # Execute the timetable query and fetch the results
    # cursor.execute(query_timetable)
    # timetable_results = cursor.fetchall()
    
    # # Get the column names for timetable
    # timetable_columns = [desc[0] for desc in cursor.description]
    
    # # Create a DataFrame for timetable
    # timetable = pd.DataFrame(timetable_results, columns=timetable_columns)
    
    # # Convert the 'coordinate' column values to strings
    # timetable['coordinate'] = timetable['coordinate'].apply(lambda x: ','.join(x) if isinstance(x, list) else x)
    
    # # Create a new Series with replacements
    # replacements = timetable['coordinate'].replace(['', '[]'], '0,0')
    
    # # Update the 'coordinate' column with the correct values
    # timetable['coordinate'] = replacements
    
    # Chuyển cột 'deadline' sang dạng datetime
    jobs['deadline'] = pd.to_datetime(jobs['deadline'], format='%d-%m-%Y')
    
    users['experiences'].fillna('Không có', inplace=True)
    users['experiences_title'].fillna('Không có', inplace=True)
    users['achievements'].fillna('Không có', inplace=True)
    users['year_of_experience'].fillna('0', inplace=True)
    users['year_of_experience'] = users['year_of_experience'].astype(np.int64)
    
    return jobs, users

def calculate_sim_with_spacy(nlp, df, job_title, job_skills, n=10, weights=(0.2, 0.8)):
    # Calculate similarity using spaCy
    list_sim = []
    doc_title = nlp(job_title)
    doc_skills = nlp(job_skills)
    for i in df.index:
        try:
            doc_user = nlp(df.loc[i, 'combine'])
            title_similarity = doc_title.similarity(doc_user)
            skills_similarity = doc_skills.similarity(doc_user)
            weighted_similarity = weights[0] * title_similarity + weights[1] * skills_similarity
            list_sim.append((doc_title, doc_skills, doc_user, i, weighted_similarity))
        except:
            continue
    return list_sim

def fuzzy_skill_similarity(job_skills, user_skills):
    if not job_skills or not user_skills:
        return 0  # Nếu một trong hai dãy rỗng, trả về 0 (hoặc giá trị tùy ý khác)

    return max(fuzz.partial_ratio(job_skill, user_skill) for job_skill in job_skills for user_skill in user_skills)

def recommend_user(job_id, jobs, users):
    jobs['title'] = jobs['title'].fillna('')
    jobs['skills'] = jobs['skills'].fillna('')

    users['good_at_position'] = users['good_at_position'].fillna('')
    users['skills'] = users['skills'].fillna('')
    users['experiences'] = users['experiences'].fillna('')
    users['achievements'] = users['achievements'].fillna('')
    users['combine'] = users['good_at_position'] + " " + users['skills'] + " " + users['experiences'] + " " + users['achievements']
    users['combine'] = users['combine'].fillna('').map(str).apply(clean_txt, stopwords=stopwords_vn)

    nlp = spacy.load('vi_core_news_lg')

    job_title = jobs.loc[jobs['job_id'] == job_id, 'title'].values[0]
    print(job_title)
    job_skills = jobs.loc[jobs['job_id'] == job_id, 'skills'].values[0]
    print(job_skills)
    similarity_scores = calculate_sim_with_spacy(nlp, users, job_title, job_skills, n=10, weights=(0.2, 0.8))
    # Sort the similarity scores in descending order based on similarity score
    sorted_scores = sorted(similarity_scores, key=lambda x: x[3], reverse=True)
    # Extract the recommended user IDs and similarity scores
    recommended_users = [(score[3], score[4]) for score in sorted_scores]
    # Filter the users dataframe based on the recommended user IDs
    recommended_users_df = users.loc[users.index.isin([user[0] for user in recommended_users])]
    recommended_users_df = recommended_users_df[
        (recommended_users_df['full_name'].notnull()) &
        (recommended_users_df['full_name'] != '') &
        (recommended_users_df['good_at_position'].notnull()) &
        (recommended_users_df['good_at_position'] != '') &
        (recommended_users_df['cv_path'].notnull()) &
        (recommended_users_df['cv_path'] != '') &
        (
            (recommended_users_df['email'].notnull()) |
            (recommended_users_df['phone'].notnull())
        )
    ] 
    # Create a list to store the user data
    user_data = []

    # Iterate over the recommended users DataFrame
    for user in recommended_users_df.itertuples():
        similarity_score = next(score[1] for score in recommended_users if score[0] == user.Index)
        user_info = user._asdict()
        user_info['Similarity Score'] = similarity_score
        user_data.append(user_info)

    # Sort the user_data based on similarity_score in descending order
    user_data_sorted = sorted(user_data, key=lambda x: x['Similarity Score'], reverse=True)
    recommended_users_data_sorted = pd.DataFrame(user_data_sorted)
    #pd.set_option('display.max_colwidth', 1000)
    #recommended_users_data_sorted['skills'].head(10)
    recommended_users_data_sorted['skills'] = recommended_users_data_sorted['skills'].apply(lambda x: x.lower())
    job_skills_list = re.findall(r'\b\w+\b', jobs.loc[jobs['job_id'] == job_id, 'skills'].values[0].lower())
    recommended_users_data_sorted['Skill Similarity'] = recommended_users_data_sorted['skills'].apply(
        lambda x: fuzzy_skill_similarity(set(re.findall(r'\b\w+\b', x.lower())), set(job_skills_list))
    )
    # Filter users based on skill similarity with the job skills
    threshold_skill_similarity = 90
    recommended_users_data_filtered = recommended_users_data_sorted[
        recommended_users_data_sorted['Skill Similarity'] >= threshold_skill_similarity
    ]
    
    # Drop duplicates based on 'full_name', 'email', and 'phone', keep the row with the most complete information
    recommended_users_data_filtered = recommended_users_data_filtered.sort_values(
        by=['full_name', 'email', 'phone'],
        key=lambda x: [x for x in range(len(x))],  # Create a list of ascending indices
        ascending=False
    ).drop_duplicates(subset=['full_name', 'email', 'phone'], keep='first')

    # Sort the filtered users based on both skill similarity and similarity score
    recommended_users_data_filtered = recommended_users_data_filtered.sort_values(
        by=['Skill Similarity', 'Similarity Score'],
        ascending=[False, False]
    )
    recommended_users_data_sorted = recommended_users_data_sorted[recommended_users_data_sorted['is_private'] == 0]
    return recommended_users_data_filtered[:10]


def get_recommendations_from_mongodb(collection, job_id):  
    # Find the document based on user_id
    document = collection.find_one({'job_id': job_id})
    # Return the recommended jobs as a JSON response with pagination
    if document:
        recommended_users = document['users']
        recommended_users_df = pd.DataFrame(recommended_users)

        return recommended_users_df

    return None

def update_recommendations_to_mongodb(job_id, recommended_users, collection):
    # Define the filter to find the document with the given user_id
    filter = {'job_id': job_id}
    # Chuyển đổi DataFrame sang dạng danh sách dictionaries
    recommended_users_dict_list = recommended_users.to_dict('records')
    # Create a document to be updated
    update = {
        '$set': {
            'users': recommended_users_dict_list  # Convert DataFrame to a list of dictionaries
        }
    }
    # Update the document with the specified user_id in the collection
    collection.update_one(filter, update)

def save_to_mongodb(job_id, recommended_users, datetime_job, collection):
    # Chuyển đổi DataFrame sang dạng danh sách dictionaries
    recommended_users_dict_list = recommended_users.to_dict('records')
    # Tạo document để lưu trữ dữ liệu
    document = {
        'job_id': job_id,
        'users': recommended_users_dict_list,
        'last_recommended': datetime_job
    }
    # Thêm document vào collection
    collection.insert_one(document)

def check_job(job_id, jobs, mongo_job_ids, collection, users):
    job_updated_date = jobs.loc[jobs['job_id'] == job_id, 'updated_at'].values[0]
    #print("Job Updated At: ", job_updated_date)
    datetime_job = datetime.datetime.utcfromtimestamp(job_updated_date.tolist() / 1e9)  # Convert NumPy datetime64 to Python datetime
    print(datetime_job)

    if job_id in mongo_job_ids:
        job_info_mongo = collection.find_one({'job_id': job_id}, {'_id': 0, 'last_recommended': 1})
        print(job_info_mongo)
        last_recommended_mongo = job_info_mongo.get('last_recommended')
        last_recommended_str = last_recommended_mongo.strftime('%Y-%m-%d %H:%M:%S') if last_recommended_mongo else "None"
        #print("Last Recommended:", last_recommended_str)
        # Convert Timestamp objects to datetime objects
        datetime_mongo = datetime.datetime.strptime(last_recommended_str, "%Y-%m-%d %H:%M:%S")
        print("Last Recommended:", datetime_mongo)

        # Trường hợp update thông tin
        if datetime_mongo < datetime_job:
            print(f"{last_recommended_str} nhỏ hơn {job_updated_date}.")
            recommended_users = recommend_user(job_id, jobs, users)
            update_recommendations_to_mongodb(job_id, recommended_users, collection)
            collection.update_one({'job_id': job_id}, {'$set': {'last_recommended': datetime_job}})
            print("Cập nhật data MongoDB thành công")
            return recommended_users
        else:
            # Trường hợp không udpate thông tin
            print(f"{last_recommended_str} lớn hơn {job_updated_date}.")
            recommended_users_mongo = get_recommendations_from_mongodb(collection, job_id)
            print("Đọc data MongoDB thành công")
            return pd.DataFrame(recommended_users_mongo)
    else:               
        recommended_users = recommend_user(job_id, jobs, users)
        save_to_mongodb(job_id, recommended_users, datetime_job, collection)
        print("Lưu user thành công lên MongoDB")
        return recommended_users

def recommend(job_id):
    # get data from mysql
    jobs, users = read_data_mysql()
    print(job_id)
    users['date_of_birth'] = users['date_of_birth'].apply(
        lambda x: x.strftime('%Y-%m-%d') if isinstance(x, datetime.date) else ''
    )    
    #print(timetable.info())
    #print(timetable)
    
    for index, row in jobs.iterrows():
        if row['job_id'] == job_id:
            missing_columns = []
            if row['title'] is None:
                missing_columns.append('title')
            if row['skills']is None:
                missing_columns.append('skills')               
            if missing_columns:
                return "Cần cập nhật thêm 1 số thông tin quan trọng"

    collection = connection_mongo()
    mongo_job_ids = set([job['job_id'] for job in collection.find()])
    missing_ids = [job_id for job_id in jobs['job_id'] if job_id not in mongo_job_ids]
    print(mongo_job_ids)
    #print(missing_ids)

    test = check_job(job_id, jobs, mongo_job_ids, collection, users)
    #test = recommend_user(job_id, jobs, users)
    return test

# t = recommend(3175)
# print(t.info())

@app.get("/recommend-user/")
async def get_user_recommendations(
    job_id: int = Query(..., description="User ID"),
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Number of results per page"),
):
    try:
        # Call the recommend function and pass the job_id
        recommended_users_df = recommend(job_id)

        if recommended_users_df is None:
            return {
                "error": True,
                "message": "User not found or no recommendations available.",
                "data": None,
                "status_code": 404
            }

        if isinstance(recommended_users_df, str):  # Check if recommend() returned an error message
            return {
                "error": True,
                "message": recommended_users_df,
                "data": None,
                "status_code": 500
            }

        if recommended_users_df.empty:
            return {
                "error": True,
                "message": "No recommendations available.",
                "data": None,
                "status_code": 404
            }

        # Calculate the start and end indices for pagination
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Get the paginated data
        paginated_jobs = recommended_users_df.iloc[start_index:end_index].to_dict(orient="records")

        # Calculate pagination information
        total = len(recommended_users_df)
        total_pages = math.ceil(total / limit)
        base_url = f"http://localhost:8000/recommend-user/?job_id={job_id}"
        first_page_url = f"{base_url}&page=1&limit={limit}"
        last_page = total_pages
        last_page_url = f"{base_url}&page={last_page}&limit={limit}"
        next_page = page + 1 if page < total_pages else None
        prev_page = page - 1 if page > 1 else None

        links = [
            {
                "url": prev_page and f"{base_url}&page={prev_page}&limit={limit}",
                "label": "&laquo; Previous",
                "active": page > 1
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
            "url": next_page and f"{base_url}&page={next_page}&limit={limit}",
            "label": "Next &raquo;",
            "active": page < total_pages
        })

        pagination_info = {
            "first_page_url": first_page_url,
            "from": (page - 1) * limit + 1,
            "last_page": last_page,
            "last_page_url": last_page_url,
            "links": links,
            "next_page_url": next_page and f"{base_url}&page={next_page}&limit={limit}",
            "path": f"http://localhost:8000/recommend-user/?job_id={job_id}",
            "per_page": limit,
            "prev_page_url": prev_page and f"{base_url}&page={prev_page}&limit={limit}",
            "to": min(page * limit, total),
            "total": total
        }

        return {
            "error": False,
            "message": "Xử lí thành công",
            "data": {
                "user_profiles": {
                    "current_page": page,
                    "data": paginated_jobs,
                    "pagination_info": pagination_info
                }
            },
            "status_code": 200
        }

    except Exception as e:
        # Return an error message if any exception occurs
        return {
            "error": True,
            "message": str(e),
            "data": None,
            "status_code": 500
        }