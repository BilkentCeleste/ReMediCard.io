import redis
import json
from typing import Any


class RedisQueue:
    def __init__(self, host: str = 'localhost', port: int = 6379, db: int = 0, password: str = ''):

        try:
            self.client = redis.Redis(
                host=host, port=port, db=db, decode_responses=True, password=password)
            print("Connected to Redis successfully.")
        except redis.ConnectionError as e:
            raise Exception(f"Failed to connect to Redis: {str(e)}")

    def enqueue(self, queue, message: Any) -> bool:
        try:

            if not isinstance(message, str):
                message = json.dumps(message)

            self.client.lpush(queue, message)
            print(f"Enqueued message: {message}")
            return True
        except Exception as e:
            print(f"Error enqueuing message: {str(e)}")
            return False

    def get_queue_length(self, queue) -> int:
        return self.client.llen(queue)

    def wait_message(self, queue):
        try:
            print(
                f"Connected to Redis. Waiting for messages on queue '{queue}'...")
            print("Press Ctrl+C to stop")

            while True:
                message = self.client.blpop(queue, timeout=0)

                if message:
                    print(f"Received message: {message[1]}")
                    return message
                else:
                    print("No message received (this shouldn't happen with timeout=0)")

        except Exception as e:
            print(f"An error occurred: {e}")
