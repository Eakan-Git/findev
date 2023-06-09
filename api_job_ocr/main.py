import pandas as pd
import mysql.connector
from elasticsearch import Elasticsearch
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import mysql.connector
import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
import warnings
from tika import parser
import cv2
import numpy as np
import re
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import os
import shutil
import requests
warnings.simplefilter('ignore')

app = FastAPI()

# Define Elasticsearch connection
es = Elasticsearch(['http://localhost:9201'])

# Connect to MongoDB
client = MongoClient("mongodb+srv://tuansoi19127084:tuansoi19127084@cluster0.n8shx9d.mongodb.net/test?retryWrites=true&w=majority")
db = client['BaseOnAL']
collection = db['user_history']

# Establish MySQL connection
cnx = mysql.connector.connect(user='root', database='recommend', password="123456")
cursor = cnx.cursor()

# Đường dẫn đến tệp trên Google Drive
file_url = "https://drive.google.com/uc?id=1AQrnIFnqzPQbXXbYRADj5yh1I3_E_YMt"

# Tên biến toàn cục để lưu trữ nội dung của tệp
stopwords_vn = None

def load_stopwords():
    global stopwords_vn

    if stopwords_vn is None:
        # Tải tệp từ URL nếu chưa được tải
        response = requests.get(file_url)
        stopwords_vn = response.text.splitlines()

    return stopwords_vn


# Gọi hàm load_stopwords() để đảm bảo tệp đã được tải trước khi sử dụng
stop_words = load_stopwords()



def find_user_ids_by_job_title(job_title):
    pipeline = [
        {"$match": {"jobs.title": job_title}},
        {"$project": {"_id": 0, "user_id": "$userid"}}
    ]
    
    result = collection.aggregate(pipeline)
    user_ids = list(set(doc["user_id"] for doc in result))
    
    return user_ids

def get_user_profiles(job_title):
    user_ids = find_user_ids_by_job_title(job_title)
    if not user_ids:
        return []

    # Query to retrieve user profile information from MySQL
    query = f"SELECT * FROM user_profiles WHERE id IN ({', '.join(str(id) for id in user_ids)})"
    cursor = cnx.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()

    columns = [column[0] for column in cursor.description]
    df = pd.DataFrame(results, columns=columns)

    # Create a dictionary of user profiles in the order of user_ids
    filtered_profiles_dict = []
    for user_id in user_ids:
        profile = df[df['id'] == user_id].to_dict('records')
        if profile:
            filtered_profiles_dict.extend(profile)

    # Randomly select 10 user profiles if there are more than 10
    if len(filtered_profiles_dict) > 10:
        filtered_profiles_dict = random.sample(filtered_profiles_dict, 10)

    return filtered_profiles_dict

# Define the SQL query for jobs
jobs_query = """
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
    GROUP_CONCAT(s.skill SEPARATOR ', ') AS skills
    FROM
    jobs j
    LEFT JOIN job_skills s ON j.id = s.job_id
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
cursor.execute(jobs_query)
job_results = cursor.fetchall()

# Get the column names for jobs
job_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for jobs
job_TOPCV = pd.DataFrame(job_results, columns=job_columns)

# Define the SQL query for users
users_query = """
SELECT
  up.id,
  up.full_name,
  up.about_me,
  up.good_at_position,
  up.gender,
  GROUP_CONCAT(DISTINCT us.skill) AS skills,
  GROUP_CONCAT(DISTINCT ue.description ORDER BY ue.user_id SEPARATOR '; ') AS experiences
FROM
  user_profiles up
LEFT JOIN user_educations ued ON up.id = ued.user_id
LEFT JOIN user_skills us ON up.id = us.user_id
LEFT JOIN (
  SELECT
    user_id,
    GROUP_CONCAT(description ORDER BY user_id SEPARATOR '; ') AS description
  FROM
    user_experiences
  GROUP BY
    user_id
) ue ON up.id = ue.user_id
GROUP BY
  up.id, up.full_name, up.about_me, up.good_at_position, up.gender;
"""

# Execute the users query and fetch the results
cursor.execute(users_query)
user_results = cursor.fetchall()

# Get the column names for users
user_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for users
users_CV = pd.DataFrame(user_results, columns=user_columns)
users_CV['experiences'] = users_CV['experiences'].str.replace(r'\s+', ' ', regex=True)
users_CV['about_me'] = users_CV['about_me'].str.replace(r'\s+', ' ', regex=True)

# Define the SQL query for users
users_query = """
SELECT
  up.id,
  up.full_name,
  up.about_me,
  up.good_at_position,
  up.gender,
  up.address,
  up.year_of_experience,
  GROUP_CONCAT(DISTINCT us.skill) AS skills,
  GROUP_CONCAT(DISTINCT ue.description ORDER BY ue.user_id SEPARATOR '; ') AS experiences
FROM
  user_profiles up
LEFT JOIN user_educations ued ON up.id = ued.user_id
LEFT JOIN user_skills us ON up.id = us.user_id
LEFT JOIN (
  SELECT
    user_id,
    GROUP_CONCAT(description ORDER BY user_id SEPARATOR '; ') AS description
  FROM
    user_experiences
  GROUP BY
    user_id
) ue ON up.id = ue.user_id
GROUP BY
  up.id, up.full_name, up.about_me, up.good_at_position, up.gender;
"""

# Execute the users query and fetch the results
cursor.execute(users_query)
user_results = cursor.fetchall()

# Get the column names for users
user_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for users
candidate_df = pd.DataFrame(user_results, columns=user_columns)
candidate_df['experiences'] = candidate_df['experiences'].str.replace(r'\s+', ' ', regex=True)
candidate_df['about_me'] = candidate_df['about_me'].str.replace(r'\s+', ' ', regex=True)

# Define the SQL query for user_history
user_history_query = """
SELECT
    id,
    user_id,
    job_id,
    times
FROM
    user_history
"""

# Execute the user_history query and fetch the results
cursor.execute(user_history_query)
user_history_results = cursor.fetchall()

# Get the column names for user_history
user_history_columns = [desc[0] for desc in cursor.description]

# Create a DataFrame for user_history
users_CV_history = pd.DataFrame(user_history_results, columns=user_history_columns)

users_CV['good_at_position'] = users_CV['good_at_position'].fillna('')
users_CV['skills'] = users_CV['skills'].fillna('')
users_CV['about_me'] = users_CV['about_me'].fillna('')
users_CV['experiences'] = users_CV['experiences'].fillna('')
users_CV['good_at_position'] = users_CV['good_at_position'] + users_CV['skills'] + users_CV['about_me'] + users_CV['experiences']
tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 5), min_df=0, stop_words=stop_words)
tfidf_matrix = tf.fit_transform(users_CV['good_at_position'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
users_CV = users_CV.reset_index()
userid = users_CV['id']
indices = pd.Series(users_CV.index, index=users_CV['id'])

def get_recommendations_userwise(userid):
    idx = indices[userid]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: np.mean(x[1]) if np.iterable(x[1]) else x[1], reverse=True)
    user_indices = [i[0] for i in sim_scores]
    return user_indices[0:10]

def get_job_id(usrid_list):
    sorted_df = users_CV_history.sort_values(by=["times"], ascending=False)
    jobs_userwise = sorted_df['user_id'].isin(usrid_list)
    df1 = pd.DataFrame(data=sorted_df[jobs_userwise], columns=['job_id', 'user_id', 'times'])
    joblist = df1['job_id'].tolist()
    Job_list = job_TOPCV['job_id'].isin(joblist)
    df_temp = pd.DataFrame(data=job_TOPCV[Job_list],
                           columns=['job_id', 'title', 'description', 'min_salary', 'max_salary',
                                    'recruit_num', 'position', 'skills', 'min_yoe', 'max_yoe', 'benefit', 'requirement'])

    # Merge
    merged_df = pd.merge(df_temp, df1, on="job_id")
    sorted_df = merged_df.sort_values(by=["times"], ascending=False)
    return sorted_df


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
    GROUP_CONCAT(s.skill SEPARATOR ', ') AS skills
    FROM
    jobs j
    LEFT JOIN job_skills s ON j.id = s.job_id
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
               'min_yoe', 'max_yoe', 'benefit', 'deadline', 'requirement', 'skills']
    df = pd.DataFrame(results, columns=columns)

    # Xoá toàn bộ index và dữ liệu trong Elasticsearch
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

#Recommend applicant
@app.get("/user_profiles/{job_title}")
def get_user_profiles_by_job_title(job_title: str):
    user_profiles = get_user_profiles(job_title)
    return {"user_profiles": user_profiles}

#Recommend base on profile user
@app.get("/recommend/{user_id}")
def recommend_jobs(user_id: int):
    job_recommendations = get_job_id(get_recommendations_userwise(user_id))
    return JSONResponse(content=job_recommendations.to_dict(orient="records"))

@app.get("/jobs/{keyword}")
def search_jobs(keyword: str):
    # Search for jobs in Elasticsearch
    body = {
        "size": 10000,  # Adjust the size as per your requirements
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

    return jobs

# Hoang
# Write json
def JsonFile(key, value):
    data_dict = dict(zip(key, value))
    json_string = json.dumps(data_dict, ensure_ascii=False)
    return json_string
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
# Return result
def ExtractTextFromPDF(path):
    key = []
    value = []
    raw_text = parser.from_file(path)
    text = raw_text['content']
    key, value = ReadContent(text)
    if len(key) != 0 and len(value) != 0:
        json = JsonFile(key, value)
        return {
            "success": True,
            "message": "Trích xuất thông tin CV thành công",
            "data": json
        }
    else: 
        return {
            "success": False,
            "message": "Định dạng CV chưa được hỗ trợ"
        }

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
        return JSONResponse(content=result, media_type="application/json")
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
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # Load the pre-trained Haar cascade classifier for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        # Convert the image to grayscale
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # Detect faces in the grayscale image
        faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(faces) > 0:
            bool_result = True
        else:
            bool_result = False
        # Return the boolean result as JSON response
        return JSONResponse({"result": bool_result,})
    except Exception as e:
        return JSONResponse({"error": str(e)})