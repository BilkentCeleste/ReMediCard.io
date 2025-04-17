from queue_service import RedisQueue
from storage_service import S3_Service
import os
import json
import fitz


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    all_text = ""
    for page in doc:
        all_text += page.get_text()
    return all_text


def main():

    HOST = os.getenv("HOST")
    PORT = int(os.getenv("PORT"))
    DB = int(os.getenv("DB"))
    PASSWORD = os.getenv("PASSWORD")
    AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
    REGION = os.getenv("REGION")
    LECTURE_NOTES_PDF_QUEUE_NAME = os.getenv(
        "LECTURE_NOTES_PDF_QUEUE_NAME")
    GENERATION_QUEUE_NAME = os.getenv("GENERATION_QUEUE_NAME")

    queue = RedisQueue(host=HOST, port=PORT, db=DB, password=PASSWORD)
    s3Service = S3_Service(AWS_ACCESS_KEY, AWS_SECRET_KEY, REGION)

    while True:
        message = queue.wait_message(queue=LECTURE_NOTES_PDF_QUEUE_NAME)
        message = json.loads(message[1])
        addresses = message["addresses"]

        file_path = "./document.pdf"

        s3Service.download_from_s3_url(
            s3_url=addresses[0], local_path=file_path)

        pdf_text = extract_text_from_pdf(file_path)

        message["text"] = pdf_text

        queue.enqueue(GENERATION_QUEUE_NAME, message)

        os.remove(file_path)


if __name__ == "__main__":
    main()
