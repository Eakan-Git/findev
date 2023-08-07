from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import pyrebase
import os
import urllib.parse
from dotenv import load_dotenv
import uuid

load_dotenv()
app = FastAPI()
# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with the appropriate origins if needed
    allow_methods=["*"],  # Or specify the allowed HTTP methods
    allow_headers=["*"],  # Or specify the allowed headers
)
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
def save_temp_image(image_data):
    # Create the 'temp_images' directory if it doesn't exist
    if not os.path.exists("temp_images"):
        os.makedirs("temp_images")

    # Create a unique filename using uuid
    unique_filename = str(uuid.uuid4()) + ".jpg"
    temp_file_path = os.path.join("temp_images", unique_filename)

    # Save the image data to the unique temporary file
    with open(temp_file_path, "wb") as f:
        f.write(image_data)

    return temp_file_path

@app.post("/upload_image")
async def detect_faces(image: UploadFile = File(...)):
    try:
        # Read the uploaded image file
        image_data = await image.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Save the image to a unique temporary file
        temp_file_path = save_temp_image(image_data)

        # Upload the image to Firebase Storage
        link = UploadImage(temp_file_path)

        # Clean up the temporary file after uploading
        os.remove(temp_file_path)

        return JSONResponse({
            'link': link
        })
    except Exception as e:
        return JSONResponse({"error": True, "message": str(e)})