FROM python:3.11-slim

WORKDIR /app

COPY content-generator/ .

COPY *.py .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "worker.py"]