FROM python:3.11-slim

WORKDIR /app

#RUN apt-get update && apt-get install -y \
#    ffmpeg \
#    && rm -rf /var/lib/apt/lists/*

COPY image-text-extractor/ .

COPY *.py .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "worker.py"]