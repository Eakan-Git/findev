import os
from typing import Optional
import pandas as pd
import mysql.connector
from pymongo import MongoClient
from requests.exceptions import ConnectionError, Timeout
import numpy as np
import warnings
import re
import requests
import nltk
import spacy
import string
from nltk.stem import WordNetLemmatizer
from nltk import word_tokenize
import datetime
import math
import time
from fuzzywuzzy import fuzz
from pytz import timezone
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from typing import List, Optional
import threading
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
# Define the weights for each column
weights = {
    'title': 0.4,
    'requirement': 0.1,
    'description': 0.1,
    'skills': 0.4
}

def connection_mongo():
    # Connect to MongoDB
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        raise ValueError("MONGO_URL environment variable is not set.")
    
    client = MongoClient(mongo_url)
    db = client['BaseOnAL']
    collection = db['test_3']
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
        GROUP_CONCAT(DISTINCT c.description SEPARATOR ', ') AS categories
    FROM
        jobs j
    JOIN job_skills s ON j.id = s.job_id AND s.deleted_at IS NULL
    JOIN employer_profiles ON j.employer_id = employer_profiles.id
    JOIN company_profiles ON employer_profiles.company_id = company_profiles.id
    JOIN job_category jc ON j.id = jc.job_id  AND jc.deleted_at IS NULL
    JOIN categories c ON c.id = jc.category_id AND c.deleted_at IS NULL
    WHERE
        j.deleted_at IS NULL
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
        j.location,
        company_profiles.id,
        company_profiles.name,
        company_profiles.logo,
        company_profiles.description,
        company_profiles.site,
        company_profiles.address,
        company_profiles.size,
        company_profiles.phone,
        company_profiles.email;
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
        up.about_me,
        up.good_at_position,
        up.gender,
        up.address,
        up.year_of_experience,
        GROUP_CONCAT(DISTINCT us.skill ORDER BY ue.user_id SEPARATOR '; ') AS skills,
        GROUP_CONCAT(DISTINCT ue.description ORDER BY ue.user_id SEPARATOR '; ') AS experiences,
        GROUP_CONCAT(DISTINCT ue.title ORDER BY ue.user_id SEPARATOR '; ') AS experiences_title,
        GROUP_CONCAT(DISTINCT ua.description ORDER BY ua.user_id SEPARATOR '; ') AS achievements,
        up.created_at,
        up.updated_at
    FROM
        user_profiles up
    LEFT JOIN user_educations ued ON up.id = ued.user_id AND ued.deleted_at IS NULL
    LEFT JOIN user_achievements ua ON up.id = ua.user_id AND ua.deleted_at IS NULL
    LEFT JOIN user_skills us ON up.id = us.user_id AND us.deleted_at IS NULL
    LEFT JOIN (
        SELECT
            user_id,
            GROUP_CONCAT(description ORDER BY user_id SEPARATOR '; ') AS description,
            GROUP_CONCAT(title ORDER BY user_id SEPARATOR '; ') AS title
        FROM
            user_experiences
        WHERE
            deleted_at IS NULL
        GROUP BY
            user_id
    ) ue ON up.id = ue.user_id
    GROUP BY
        up.id, up.full_name, up.about_me, up.good_at_position, up.gender;
    """
    
    # Execute the user query and fetch the results
    cursor.execute(query_user)
    user_results = cursor.fetchall()
    
    # Get the column names for users
    user_columns = [desc[0] for desc in cursor.description]
    
    # Create a DataFrame for users
    users = pd.DataFrame(user_results, columns=user_columns)
    print(users.info())
    
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

    # Define the query to retrieve timetable data
    query_timetable = """
    SELECT *
    FROM time_tables
    """
    
    # Execute the timetable query and fetch the results
    cursor.execute(query_timetable)
    timetable_results = cursor.fetchall()
    
    # Get the column names for timetable
    timetable_columns = [desc[0] for desc in cursor.description]
    
    # Create a DataFrame for timetable
    timetable = pd.DataFrame(timetable_results, columns=timetable_columns)
    
    # Convert the 'coordinate' column values to strings
    timetable['coordinate'] = timetable['coordinate'].apply(lambda x: ','.join(x) if isinstance(x, list) else x)
    
    # Create a new Series with replacements
    replacements = timetable['coordinate'].replace(['', '[]'], '0,0')
    
    # Update the 'coordinate' column with the correct values
    timetable['coordinate'] = replacements
    
    # Chuyển cột 'deadline' sang dạng datetime
    jobs['deadline'] = pd.to_datetime(jobs['deadline'], format='%d-%m-%Y')
    
    users['experiences'].fillna('Không có', inplace=True)
    users['experiences_title'].fillna('Không có', inplace=True)
    users['achievements'].fillna('Không có', inplace=True)
    users['year_of_experience'].fillna('0', inplace=True)
    users['year_of_experience'] = users['year_of_experience'].astype(np.int64)
    
    return jobs, users, user_acc, timetable

def filter_current_jobs(jobs):
    # Get the current date and time
    now = datetime.datetime.now()
    # Filter out jobs with a deadline greater than or equal to the current date and time
    current_jobs= jobs[jobs['deadline'] >= now]
    current_jobs['deadline'] = current_jobs['deadline'].dt.strftime('%d-%m-%Y')

    return current_jobs


def calculate_sim_with_spacy(nlp, df, user_text, weights, n=10):
    list_sim = []

    # Process user_text using nlp
    doc1 = nlp(user_text)

    # Convert columns to text before applying nlp
    for col in weights.keys():
        df[col] = df[col].fillna('').map(str).apply(clean_txt, stopwords=stopwords_vn)

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

def recommend_job(id: int, users, timetable, current_jobs):
    target_position = None

    for index, row in users.iterrows():
        if row['id'] == id:
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
        t = "Bán thời gian"
        jobs_t = current_jobs[current_jobs['type'].str.contains(f'{t}', case=False)]
    else:
        jobs_t = current_jobs
    #print("job_t")
    #print(jobs_t)

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
    user_address = user_address.lower()
    print("user_address")
    print(user_address)
    #print("job_g location")
    #print(jobs_g['location'].value_counts())

    if any(keyword in user_address for keyword in ['tphcm', 'hồ chí minh', 'tp hcm', 'hcm', 'tp.hcm', 'thành phố hồ chí minh']):
        jobs_a = jobs_g[jobs_g['location'].str.lower().str.contains('hồ chí minh')]
    elif any(keyword in user_address for keyword in ['hà nội', 'hn']):
        jobs_a = jobs_g[jobs_g['location'].str.lower().str.contains('hà nội')]
    else:
        jobs_a = jobs_g

    #print("job_a location")
    #print(jobs_a['location'].value_counts())

    # Lấy YearsExperience của người dùng   
    user_experience = users[users['id'] == user_id]['year_of_experience'].values[0]
    min_yoe_condition = None
    max_yoe_condition = None
    if user_experience == 0:
        #min_yoe_condition = [0]
        max_yoe_condition = 0
    elif user_experience == 1:
        #min_yoe_condition = [0, 1]
        max_yoe_condition = 1
    elif user_experience == 2:
        #min_yoe_condition = [0, 2]
        max_yoe_condition = 2
    else:
        #min_yoe_condition = [0, user_experience]
        max_yoe_condition = user_experience

    jobs_ex = jobs_a[jobs_a['max_yoe'] <= max_yoe_condition]
    #print("job_ex")
    #print(jobs_ex)
    
    if jobs_ex is None or jobs_ex.empty:
        jobs_ex = jobs_a
        #print("job_ex")
        #print(jobs_ex)

    #jobs_ex = jobs_a
    jobs_ex['title'] = jobs_ex['title'].fillna('')
    jobs_ex['description'] = jobs_ex['description'].fillna('')
    jobs_ex['skills'] = jobs_ex['skills'].fillna('')
    jobs_ex['requirement'] = jobs_ex['requirement'].fillna('')
    # new column
    jobs_ex['combine'] = jobs_ex['title'] + " " + jobs_ex['description'] + " " + jobs_ex['skills'] + " " + jobs_ex['requirement']

    jobs_ex['combine'] = jobs_ex['combine'].map(str).apply(clean_txt, stopwords=stopwords_vn)
    print(jobs_ex.info())

    users['good_at_position'] = users['good_at_position'].fillna('')
    users['skills'] = users['skills'].fillna('')
    users['experiences'] = users['experiences'].fillna('')
    users['achievements'] = users['achievements'].fillna('')
    users['combine'] = users['good_at_position'] + " " + users['skills'] + " " + users['experiences'] + " " + users['achievements']
    users['combine'] = users['combine'].fillna('').map(str).apply(clean_txt, stopwords=stopwords_vn)

    nlp = spacy.load('vi_core_news_lg')
    
    # Get the user's combined text
    user_combine_text = users.loc[users['id'] == user_id, 'combine'].values[0]

    # Calculate similarity between user's combine text and jobs' combine text
    similarity_scores = calculate_sim_with_spacy(nlp, jobs_ex, user_combine_text, weights, n=10)
    
    # Sort the similarity scores in descending order based on similarity score
    sorted_scores = sorted(similarity_scores, key=lambda x: x[2], reverse=True)

    # Extract the recommended job IDs and similarity scores
    recommended_jobs = [(score[2], score[3]) for score in sorted_scores]

    # Filter the jobs dataframe based on the recommended job IDs
    recommended_jobs_df = jobs_ex.loc[jobs_ex.index.isin([job[0] for job in recommended_jobs])]

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
    #print(recommended_jobs_data_sorted)
    recommended_jobs_data_sorted = recommended_jobs_data_sorted.sort_values(by='Similarity Score', ascending=False)

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
    recommended_jobs_data_filtered['deadline'] = pd.to_datetime(recommended_jobs_data_filtered['deadline'])
    recommended_jobs_data_filtered['deadline'] = recommended_jobs_data_filtered['deadline'].dt.strftime('%d-%m-%Y')

    if recommended_jobs_data_filtered.empty or len(recommended_jobs_data_filtered) < 20:
        recommended_jobs_data_sorted = recommended_jobs_data_sorted.sort_values(by='Similarity Score', ascending=False)
        return recommended_jobs_data_sorted[:30]    
    elif len(recommended_jobs_data_filtered) > 30:
        return recommended_jobs_data_filtered[:30]
    else:
        return recommended_jobs_data_filtered

def get_recommendations_from_mongodb(collection, user_id):  
    # Find the document based on user_id
    document = collection.find_one({'user_id': user_id})

    # Return the recommended jobs as a JSON response with pagination
    if document:
        recommended_jobs = document['jobs']
        recommended_jobs_df = pd.DataFrame(recommended_jobs)

        return recommended_jobs_df

    return None

def save_recommendations_to_mongodb(user_id, jobs, current_datetime, collection):
    # Create a document to be inserted
    document = {
        'user_id': user_id,
        'jobs': jobs.to_dict('records'),  # Convert DataFrame to a list of dictionaries
        'last_recommended': current_datetime
    }
    
    # Insert the document into the collection
    collection.insert_one(document)


def update_recommendations_to_mongodb(user_id, jobs, collection):
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

def check_user(current_jobs, user_id, collection, users, timetable, mongo_user_ids):
    #current_datetime = datetime.datetime.now()
    #print(current_datetime)
    # Get the user's updated_date in the correct timezone and make it timezone-aware
    user_updated_date = users.loc[users['id'] == user_id, 'updated_at'].values[0]
    print("User Updated At (UTC):", user_updated_date)

    timetable_updated_date = timetable.loc[timetable['id'] == user_id, 'updated_at'].values[0]
    print("Timetable Updated At (UTC):", timetable_updated_date)      
    datetime_user = datetime.datetime.utcfromtimestamp(user_updated_date.tolist() / 1e9)  # Convert NumPy datetime64 to Python datetime
    print(datetime_user)
    datetime_timetable = datetime.datetime.utcfromtimestamp(timetable_updated_date.tolist() / 1e9)  # Convert NumPy datetime64 to Python datetime
    print(datetime_timetable)

    # Người dùng đã được gợi ý
    if user_id in mongo_user_ids:
        user_info_mongo = collection.find_one({'user_id': user_id}, {'_id': 0, 'last_recommended': 1})
        print(user_info_mongo)
        last_recommended_mongo = user_info_mongo.get('last_recommended')
        last_recommended_str = last_recommended_mongo.strftime('%Y-%m-%d %H:%M:%S') if last_recommended_mongo else "None"
        print("Last Recommended (UTC):", last_recommended_str)
        # Convert Timestamp objects to datetime objects
        datetime_mongo = datetime.datetime.strptime(last_recommended_str, "%Y-%m-%d %H:%M:%S")
        print(datetime_mongo)

        # Trường hợp update thông tin
        if datetime_mongo < datetime_user or datetime_mongo < datetime_timetable:
            print(f"{last_recommended_str} nhỏ hơn {user_updated_date}.")
            recommended_jobs = recommend_job(user_id, users, timetable, current_jobs)
            update_recommendations_to_mongodb(user_id, recommended_jobs, collection)
            if datetime_user < datetime_timetable:
                collection.update_one({'user_id': user_id}, {'$set': {'last_recommended': datetime_timetable}})
            else:
                collection.update_one({'user_id': user_id}, {'$set': {'last_recommended': datetime_user}})
            print("Cập nhật data MongoDB thành công")
            return recommended_jobs
        else:
            # Trường hợp không udpate thông tin
            print(f"{last_recommended_str} lớn hơn {user_updated_date}.")
            recommended_jobs_mongo = get_recommendations_from_mongodb(collection, user_id)
            print("Đọc data MongoDB thành công")
            return pd.DataFrame(recommended_jobs_mongo)
    else:
        start_recommend_job = time.time()               
        recommended_jobs = recommend_job(user_id, users, timetable, current_jobs)
        end_recommend_job = time.time()
        print("Time taken for recommend_job:", end_recommend_job - start_recommend_job, "seconds")

        if datetime_user < datetime_timetable:
            save_recommendations_to_mongodb(user_id, recommended_jobs, datetime_timetable, collection)
        else:
            save_recommendations_to_mongodb(user_id, recommended_jobs, datetime_user, collection)
        print("Lưu user thành công lên MongoDB")
        return recommended_jobs

        
def recommend(user_id):
    result = None
    
    # Thời điểm bắt đầu đọc dữ liệu từ MySQL
    start = time.time()
    
    # get data from mysql
    jobs, users, user_acc, timetable = read_data_mysql()
    
    # Thời điểm kết thúc đọc dữ liệu từ MySQL
    end = time.time()
    print("Time taken to read data from MySQL:", end - start, "seconds")
    print(user_id)

    # Kiểm tra xem ID người dùng có tồn tại trong DataFrame users hay không
    if user_id not in users['id'].values:
        return "Người dùng không tồn tại"
        # return resut

    # kiểm tra user có thông tin cá nhân
    user_acc_ids = set(user_acc['id'].values)
    users_ids = set(users['id'].values)
    missing_ids_acc = user_acc_ids - users_ids
    
    if user_id in missing_ids_acc:
        return "Người dùng có tài khoản nhưng không có thông tin cá nhân"
        #return result

    # Kiểm tra timetable
    if user_id not in timetable['user_id'].values:
        return "Người dùng không có timetable"
        #return result 

    # kiểm tra thông tin các cột
    for index, row in users.iterrows():
        if row['id'] == user_id:
            missing_columns = []
            if row['about_me'] is None:
                missing_columns.append('about_me')
            if row['good_at_position']is None:
                missing_columns.append('good_at_position')
            if row['skills'] is None:
                missing_columns.append('skills')
            if row['address'] is None:
                missing_columns.append('address')                
            if missing_columns:
                return "Cần cập nhật thêm 1 số thông tin trong hồ sơ sinh viên"
                # return result 
                
    # Call the filter_current_jobsfunction to get current jobs DataFrame
    current_jobs = filter_current_jobs(jobs)
      
    #load connection mongo
    collection = connection_mongo()
    # Cập nhật lại danh sách user ids đã chạy trong MongoDB
    mongo_user_ids = set([user['user_id'] for user in collection.find()])
    # Cập nhật lại danh sách các user ids chưa có thông tin trong MongoDB
    missing_ids = [user_id for user_id in users['id'] if user_id not in mongo_user_ids]
    print(mongo_user_ids)
    print(missing_ids)
    t = check_user(current_jobs, user_id, collection, users, timetable, mongo_user_ids)
    return t

# Calculate pagination information
def calculate_pagination_info(user_id, page, limit, recommended_jobs_df):
    total = len(recommended_jobs_df)
    total_pages = math.ceil(total / limit)
    base_url = f"https://ethi-team.pw/api/job-recommend/recommend/"
    user_id_param = f"user_id={user_id}"
    first_page_url = f"{base_url}?{user_id_param}&page=1&limit={limit}"
    last_page = total_pages
    last_page_url = f"{base_url}?{user_id_param}&page={last_page}&limit={limit}"
    next_page = page + 1 if page < total_pages else None
    prev_page = page - 1 if page > 1 else None

    links = [
        {
            "url": prev_page and f"{base_url}?{user_id_param}&page={prev_page}&limit={limit}",
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
            "url": f"{base_url}?{user_id_param}&page={i}&limit={limit}",
            "label": str(i),
            "active": page == i
        })

    links.append({
        "url": next_page and f"{base_url}?{user_id_param}&page={next_page}&limit={limit}",
        "label": "Next &raquo;",
        "active": page < total_pages
    })

    pagination_info = {
        "first_page_url": first_page_url,
        "from": (page - 1) * limit + 1,
        "last_page": last_page,
        "last_page_url": last_page_url,
        "links": links,
        "next_page_url": next_page and f"{base_url}?{user_id_param}&page={next_page}&limit={limit}",
        "path": f"{base_url}?{user_id_param}",
        "per_page": limit,
        "prev_page_url": prev_page and f"{base_url}?{user_id_param}&page={prev_page}&limit={limit}",
        "to": min(page * limit, total),
        "total": total
    }

    return pagination_info

def run_recommendation(user_id):
    global recommended_jobs_df
    recommended_jobs_df = recommend(user_id)

@app.get("/recommend/")
async def get_recommendations(
    user_id: int = Query(..., description="User ID"),
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Number of results per page"),
):
    try:
        global recommended_jobs_df
        
        # Start the recommendation process in a separate thread
        recommendation_thread = threading.Thread(target=run_recommendation, args=(user_id,))
        recommendation_thread.start()

        # Set a timeout of 3 minutes
        timeout = 180
        recommendation_thread.join(timeout)

        # Check if the recommendation_thread is still alive (i.e., the function is running)
        if recommendation_thread.is_alive():
            return {
                "error": True,
                "message": "Recommendation took too long to process.",
                "data": None,
                "status_code": 408
            }

        # Check if recommended_jobs_df is None
        if recommended_jobs_df is None:
            return {
                "error": True,
                "message": "User not found or no recommendations available.",
                "data": None,
                "status_code": 404
            }

        # Check if recommended_jobs_df is an error message
        if isinstance(recommended_jobs_df, str):
            return {
                "error": True,
                "message": recommended_jobs_df,
                "data": None,
                "status_code": 500
            }

        # Check if recommended_jobs_df is empty
        if recommended_jobs_df.empty:
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
        paginated_jobs = recommended_jobs_df.iloc[start_index:end_index].to_dict(orient="records")

        # Calculate pagination information
        pagination_info = calculate_pagination_info(user_id, page, limit, recommended_jobs_df)

        # Return the paginated data along with pagination information
        return {
            "error": False,
            "message": "Xử lí thành công",
            "data": {
                "jobs": {
                    "current_page": page,
                    "data": paginated_jobs
                },
                "pagination": pagination_info
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