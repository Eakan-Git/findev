import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from fastapi import FastAPI
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware

cred_file = os.environ.get("FINDEV_FILE")
firebase_url = os.environ.get("FIREBASE_URL")

# cred = credentials.Certificate("E:\Study\DATT\Code\\findev.json")  # Replace with your service account key path
cred = credentials.Certificate(cred_file)  # Replace with your service account key path
# firebase_admin.initialize_app(cred, {'databaseURL': 'https://findev-fde4d-default-rtdb.asia-southeast1.firebasedatabase.app'})
firebase_admin.initialize_app(cred, {'databaseURL': firebase_url})
# API
app = FastAPI()
# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with the appropriate origins if needed
    allow_methods=["*"],  # Or specify the allowed HTTP methods
    allow_headers=["*"],  # Or specify the allowed headers
)
def get_rate_by_id_and_job_id(id_value, job_id_value):
    ref = db.reference()
    data = ref.get()
    for user_id, user_data in data.items():
        if 'id' in user_data and 'job_id' in user_data and 'rate' in user_data:
            if user_data['id'] == id_value and user_data['job_id'] == job_id_value:
                return user_data['rate']
    return None

@app.put("/update_data/")
async def update_data(job_id: int, id: int, rate: int):
    rand = str(uuid.uuid4())
    ref = db.reference(rand)
    # Retrieve the current data from the "excelData" node
    current_data = ref.get()
    # If "excelData" is empty or None, initialize it as an empty dictionary
    if current_data is None:
        current_data = {}
    data = {
        'job_id': job_id,
        "id": id,
        "rate": rate
    }
    ref.set(data)
    return {"message": "Data updated successfully!"}

@app.get("/get_rate/")
def get_rate(id: int, job_id: int):
    rate = get_rate_by_id_and_job_id(id, job_id)
    if rate is not None:
        return {
            'error': False,
            "rate": rate,
            "message": 'Success'}
    else:
        return {
            'error': False,
            "rate": None,
            "message": "No matching record found."}
