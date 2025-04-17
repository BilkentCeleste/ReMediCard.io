from moviepy.editor import VideoFileClip
from queue_service import RedisQueue
from storage_service import S3_Service
import os
import json
import uuid


def extract_audio(video_path, voice_path):
    try:
        video = VideoFileClip(video_path)
        audio = video.audio
        audio.write_audiofile(voice_path, codec='mp3')

        audio.close()
        video.close()

        print(f"Audio successfully extracted to {voice_path}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")


def main():

    HOST = os.getenv("HOST")
    PORT = int(os.getenv("PORT"))
    DB = int(os.getenv("DB"))
    PASSWORD = os.getenv("PASSWORD")
    AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
    REGION = os.getenv("REGION")
    VIDEO_QUEUE_NAME = os.getenv("VIDEO_QUEUE_NAME")
    VOICE_QUEUE_NAME = os.getenv("VOICE_QUEUE_NAME")
    BUCKET_NAME = os.getenv("BUCKET_NAME")

    queue = RedisQueue(host=HOST, port=PORT, db=DB, password=PASSWORD)
    s3Service = S3_Service(AWS_ACCESS_KEY, AWS_SECRET_KEY, REGION)

    while True:
        message = queue.wait_message(queue=VIDEO_QUEUE_NAME)
        message = json.loads(message[1])
        addresses = message["addresses"]

        video_path = './video.mp4'
        random_uuid = uuid.uuid4()
        voice_path = f'./voice_{random_uuid}.mp3'

        s3Service.download_from_s3_url(
            s3_url=addresses[0], local_path=video_path)
        extract_audio(video_path, voice_path)

        start = addresses[0].rfind("com/") + 4
        end = addresses[0].rfind("/") + 1

        key = f"{addresses[0][start:end]}voice_{random_uuid}.mp3"

        s3Service.upload_to_s3(voice_path, BUCKET_NAME, key)

        message["addresses"] = [
            f"{addresses[0][0:end]}voice_{random_uuid}.mp3"]
        queue.enqueue(VOICE_QUEUE_NAME, message)

        os.remove(video_path)
        os.remove(voice_path)


if __name__ == "__main__":
    main()
