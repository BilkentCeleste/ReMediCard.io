import redis
import json
from typing import Any


class RedisQueue:
    def __init__(self, queue_name: str, host: str = 'localhost', port: int = 6379, db: int = 0, password: str = ''):

        self.queue_name = queue_name
        try:
            self.client = redis.Redis(
                host=host, port=port, db=db, decode_responses=True, password=password)
            print("Connected to Redis successfully.")
        except redis.ConnectionError as e:
            raise Exception(f"Failed to connect to Redis: {str(e)}")

    def enqueue(self, message: Any) -> bool:
        try:

            if not isinstance(message, str):
                message = json.dumps(message)

            self.client.lpush(self.queue_name, message)
            print(f"Enqueued message: {message}")
            return True
        except Exception as e:
            print(f"Error enqueuing message: {str(e)}")
            return False

    def get_queue_length(self) -> int:
        return self.client.llen(self.queue_name)

    def wait_message(self, queue_name='my_queue', host='localhost', port=6379, db=0, password=""):
        try:

            r = redis.Redis(
                host=host,
                port=port,
                db=db,
                password=password,
                decode_responses=True
            )

            print(
                f"Connected to Redis. Waiting for messages on queue '{queue_name}'...")
            print("Press Ctrl+C to stop")

            while True:

                message = r.blpop(queue_name, timeout=0)

                if message:
                    print(f"Received message: {message[1]}")
                    return message
                else:
                    print("No message received (this shouldn't happen with timeout=0)")

                time.sleep(0.1)

        except redis.ConnectionError as e:
            print(f"Failed to connect to Redis: {e}")
        except KeyboardInterrupt:
            print("\nStopping queue reader...")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            if 'r' in locals():
                r.close()
                print("Redis connection closed")
