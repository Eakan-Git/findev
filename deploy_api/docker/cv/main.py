from tika import parser
import cv2
import json
import re
import os
import numpy as np
import shutil
import pyrebase
from pdf2image import convert_from_path
import dlib
import urllib.parse
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
# Define vietnamese component in list
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
def ReadCollege(string):
    result = []
    pattern = r'\d{4} - \d{4}' # Year pattern
    split_n = string.split('\n')
    split_n.remove('')
    for i in split_n[:]:
        if "Đại Học" in i: # Get school
            result.append(i)
            split_n.remove(i)
        if re.search(pattern, i): # Check year
            years = re.findall(r'\d{4}', i)
            result.extend(years)
            split_n.remove(i)
    result.extend(split_n) # Get Major
    return result
def ReadDot(string):
    result = []
    split_n = string.split('\n')
    if any(element == '' for element in split_n):
    # Remove empty elements from the list
        split_n = [element for element in split_n if element != '']
    result = [string.replace('• ', '') for string in split_n] # Delete •
    return result
def ReadExperience(string):
    result = []
    content = []
    time_pattern = r'\d{2}/\d{2}/\d{4} - \d{2}/\d{2}/\d{4}'
    matches = re.findall(time_pattern, string) # Get date
    for i in range (0, len(matches) - 1): # Get content between 2 dates
        start = matches[i]
        end = matches[i + 1]
        pattern = rf"(?<=\b{start}\b)(.*?)(?=\b{end}\b)"
        match = re.search(pattern, string, re.DOTALL)
        if match:
            content_between_words = match.group().strip()
            content.append(content_between_words)
    last = matches[-1] # Get content of last date
    temp = string.split(last, 1)[-1].strip()
    content.append(temp)

    # Fit into form
    year_pattern = r'\d{2}/\d{2}/\d{4}'
    for i in range (0, len(matches)):
        temp = re.findall(year_pattern, matches[i]) # time
        lines = content[i].splitlines()
        data = ({"title":lines[1].replace('• ', ''), 
                    "position": lines[0],
                    "description": ''.join(lines[2:]).replace('\n',''),
                    "start": temp[0],
                    "end": temp[1]})
        result.append(data)
    return result
def ReadContent(string):
    split = string.split('\n') # split '\n'
    split = [string for string in split if string] # delete empty component
    # Read tittle
    tittle = []
    for i in split:
        if i.isupper():
            if '•' not in i and 'SĐT' not in i and 'ĐH' not in i and 'HTML' not in i:
                tittle.append(i)
    # Check form  
    if len(tittle) <= 1:
        return [], []

    # Read name
    name = tittle.pop(0)

    # Get content 
    content = []
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
   
    # Check number of upper tittle not equal to content
    if len(content) != len(tittle):
        return [], []
    
    # Check component LIÊN HỆ
    if "LIÊN HỆ" not in tittle:
        return [], []
    
    # Key and Value of content
    key = ['TÊN', 'VỊ TRÍ', 'GIỚI THIỆU']
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
            if 'LIÊN HỆ' in temp_1: # Read each information in contact
                # Add birthday
                key.append('NGÀY SINH')
                tmp = ReadBirthday(temp_2)
                if tmp != None:
                    temp_2 = DeleteLine(temp_2, tmp)
                value.append(tmp)
                # Add phone number
                key.append('ĐIỆN THOẠI')
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
                    tmp = tmp.replace(":","").replace(' ','')
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
                key.append('ĐỊA CHỈ')
                temp_2 = temp_2.replace("\n", "").replace("Địa chỉ: ", "")
                value.append(temp_2)
                continue
            if 'HỌC VẤN' in temp_1:
                tmp = ReadCollege(temp_2)
                # Add Start Year
                key.append('NĂM BẮT ĐẦU')
                value.append(tmp.pop(0))
                # Add Start End
                key.append('NĂM KẾT THÚC')
                value.append(tmp.pop(0))
                # Add School
                key.append('TRƯỜNG')
                value.append(tmp.pop(0))
                # Add Major
                key.append('CHUYÊN NGÀNH')
                value.append(tmp.pop(0))
                continue
            if 'KĨ NĂNG' in temp_1:
                key.append(temp_1)
                tmp = ReadDot(temp_2)
                value.append(tmp)
                continue
            if 'THÀNH TỰU' in temp_1:
                key.append(temp_1)
                tmp = ReadDot(temp_2)
                value.append(tmp)
                continue
            if 'KINH NGHIỆM LÀM VIỆC' in temp_1:
                key.append(temp_1)
                tmp = ReadExperience(temp_2)
                value.append(tmp)
                continue
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
    if image is None:
        link = 'NULL IMAGE'
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
            x -= int(w * (scale_factor - 1) / 1.5)
            y -= int(h * (scale_factor - 1) / 1.5)
            w = int(w * scale_factor)
            h = int(h * scale_factor)
            # Save cropped face image
            cropped_image = image[max(0, y):y + h, max(0, x):x + w]
            # Convert into RGB channels
            cropped_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB)
            # save the cropped face image
            face_image_path = f'face__{x}_{y}.jpg'
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
    link = ''
    link = DetectFaces(path)
    raw_text = parser.from_file(path)
    text = raw_text['content']
    key, value = ReadContent(text)
    if len(key) != 0 and len(value) != 0:
        # Get name
        name = about = position = birthday = address= email = phone = ''
        experience = achievements = skills = github = info = ''
        university = end = start = major = ''
        tmp = None # None value
        for i in range(0, len(key)):
            if(key[i] == "TÊN"):
                name = value[i]
                continue
            if(key[i] == "VỊ TRÍ"):
                position = value[i]
                continue 
            if(key[i] == "GIỚI THIỆU"):
                about = value[i]
                continue     
            if(key[i] == "NGÀY SINH"):
                birthday = value[i]
                continue
            if(key[i] == "ĐỊA CHỈ"):
                address = value[i] 
                continue
            if(key[i] == "GMAIL"):
                email = value[i]  
                continue
            if(key[i] == "ĐIỆN THOẠI"):
                phone = value[i] 
                continue
            if(key[i] == "TRƯỜNG"):
                university = value[i]
                continue
            if(key[i] == "NĂM BẮT ĐẦU"):
                start = value[i]
                continue
            if(key[i] == "NĂM KẾT THÚC"):
                end = value[i]
                continue
            if(key[i] == "CHUYÊN NGÀNH"):
                major = value[i]
                continue
            if(key[i] == "KINH NGHIỆM LÀM VIỆC"):
                experience = value[i] 
                continue
            if(key[i] == "THÀNH TỰU"):
                achievements = value[i]  
                continue
            if(key[i] == "KĨ NĂNG"):
                skills = value[i]  
                continue
            if(key[i] == "GITHUB"):
                github = value[i]  
                continue
            if(key[i] == "LINK"):
                info = value[i]  
                continue
        skill = [{"skill": skill} for skill in skills] # form into json
        achievement = [{"description": achievement} for achievement in achievements] # form into json
        result = {
        "error": False,
        "message": "Trích xuất thông tin CV thành công",
        "data":{
            "user_profile":{
                "full_name": name,
                "avatar": link,
                "about_me": about,
                "good_at_position": position,
                "date_of_birth": birthday,
                "address": address,
                "email": email,
                "phone": phone,
                "educations": [
                    {
                    "university": university,
                    "major": major,
                    "start": start,
                    "end": end, 
                    }
                ],
                "experiences": experience,
                "achievements": achievement,
                "skills" : skill,
                "github" : github, 
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
# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with the appropriate origins if needed
    allow_methods=["*"],  # Or specify the allowed HTTP methods
    allow_headers=["*"],  # Or specify the allowed headers
)
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