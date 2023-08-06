import os
from typing import Optional
import mysql.connector
import pandas as pd
from pymongo import MongoClient
from fastapi import FastAPI, Query
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import math
from requests.exceptions import ConnectionError, Timeout

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

def find_user_ids_by_job_title(job_id: int = Query(...)):
    # Connect to MongoDB
    client = MongoClient(os.environ.get("MONGODB_CONNECTION_STRING"))
    db = client['BaseOnAL']
    collection = db['test_3']
    
    pipeline = [
        {"$match": {"jobs.job_id": job_id}},
        {"$unwind": "$jobs"},
        {"$group": {
            "_id": "$user_id",
            "max_score": {"$max": "$jobs.Similarity Score"}
        }},
        {"$sort": {"max_score": -1}},
        {"$project": {"_id": 0, "user_id": "$_id"}}
    ]

    result = collection.aggregate(pipeline)
    user_ids = [doc["user_id"] for doc in result]
    
    if not user_ids:
        return None  
  
    return user_ids

def get_user_profiles(job_id):
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

    user_ids = find_user_ids_by_job_title(job_id)
    if user_ids is None:
        return pd.DataFrame() 

    # Lấy top10 user_ids nếu có nhiều hơn 10
    if len(user_ids) > 11:
        user_ids = user_ids[:10]

    # Truy vấn MySQL
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
            GROUP_CONCAT(DISTINCT ue.title ORDER BY ue.user_id SEPARATOR '; ') AS experiences_title,
            cv.cv_path,
            tm.coordinate
        FROM
            user_profiles up
        LEFT JOIN user_skills us ON up.id = us.user_id
        LEFT JOIN time_tables tm ON up.id = tm.user_id
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
            up.phone,
            cv.cv_path,
            tm.coordinate
        ORDER BY FIELD(up.id, {', '.join(str(id) for id in user_ids)});
    """

    # Thực thi truy vấn và lấy kết quả từ MySQL
    cursor.execute(query)
    results = cursor.fetchall()

    if not results:
        return pd.DataFrame()
       
    columns = [column[0] for column in cursor.description]
    df = pd.DataFrame(results, columns=columns)
    df = df[(~df['full_name'].isnull()) & (~df['good_at_position'].isnull()) & (~df['cv_path'].isnull()) & ((~df['email'].isnull()) | (~df['phone'].isnull()))]
    
    if len(df) > 11:
        df = df[:10]    

    return df

# Define the user_recommend endpoint
@app.get("/user_recommend/")
async def get_recommendations(
    job_id: int = Query(..., description="Job ID"),
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Number of results per page"),
):
    try:
        # Call the get_user_profiles function and pass the job_id
        user_profiles_df = get_user_profiles(job_id)

        if user_profiles_df.empty:
            return {
                "error": True,
                "message": "No user profiles available.",
                "data": None,
                "status_code": 404
            }

        # Filter user_profiles_df where 'is_private' == 0
        user_profiles_df = user_profiles_df[user_profiles_df['is_private'] == 0]

        if len(user_profiles_df) > 11:
            user_profiles_df = user_profiles_df[:10]    
    

        # Calculate the start and end indices for pagination
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Get the paginated data
        paginated_profiles = user_profiles_df.iloc[start_index:end_index].to_dict(orient="records")

        # Calculate pagination information
        total = len(user_profiles_df)
        total_pages = math.ceil(total / limit)
        base_url = f"http://localhost:8001/user_recommend/?job_id={job_id}"
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

        pagination_info = {
            "first_page_url": first_page_url,
            "from": (page - 1) * limit + 1,
            "last_page": last_page,
            "last_page_url": last_page_url,
            "links": links,
            "next_page_url": f"{base_url}&page={next_page}&limit={limit}" if next_page else None,
            "path": f"http://localhost:8001/user_recommend/?job_id={job_id}",
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
                    "data": paginated_profiles,
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