from queue_service import RedisQueue
from storage_service import S3_Service
from generation_service import GenerationService
import os
import json
import base64


def main():

    HOST = os.getenv("HOST")
    PORT = int(os.getenv("PORT"))
    DB = int(os.getenv("DB"))
    PASSWORD = os.getenv("PASSWORD")
    AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
    REGION = os.getenv("REGION")
    LECTURE_NOTES_IMAGES_QUEUE_NAME = os.getenv(
        "LECTURE_NOTES_IMAGES_QUEUE_NAME")
    GENERATION_QUEUE_NAME = os.getenv("GENERATION_QUEUE_NAME")
    API_KEY = os.getenv("API_KEY")

    queue = RedisQueue(host=HOST, port=PORT, db=DB, password=PASSWORD)
    s3Service = S3_Service(AWS_ACCESS_KEY, AWS_SECRET_KEY, REGION)
    generationService = GenerationService(API_KEY)

    while True:
        message = queue.wait_message(queue=LECTURE_NOTES_IMAGES_QUEUE_NAME)
        message = json.loads(message[1])
        addresses = message["addresses"]

        files = []
        images = []
        for i, address in enumerate(addresses):
            dot_index = addresses[0].rfind(".") + 1
            ext = addresses[dot_index:]
            file_path = f'./image{i}.{ext}'
            files.append(file_path)
            s3Service.download_from_s3_url(
                s3_url=addresses[i], local_path=file_path)

            with open(file_path, "rb") as image:
                image = base64.b64encode(image.read()).decode("utf-8")
                images.append(image)

        response = generationService.generate_content(
            "Extract the texts inside these images as a one whole text add nothing else including comments or any description, just return the texts inside the images", images)

        message["text"] = response.text
        queue.enqueue(GENERATION_QUEUE_NAME, message)

        for file in files:
            os.remove(file)


if __name__ == "__main__":
    main()
