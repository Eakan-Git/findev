FROM python:3.8.8

WORKDIR /src

RUN apt-get update -y && \
    apt-get install build-essential cmake pkg-config libopencv-dev python3-opencv openjdk-11-jre-headless poppler-utils -y

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
