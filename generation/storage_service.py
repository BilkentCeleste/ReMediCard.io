import boto3
from botocore.exceptions import ClientError
import os
from urllib.parse import urlparse


class S3_Service:

    def __init__(self, aws_access_key_id, aws_secret_access_key, region_name='us-east-1'):
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        self.region_name = region_name

    def download_from_s3_url(self, s3_url, local_path):

        try:

            parsed_url = urlparse(s3_url)

            if parsed_url.scheme == 's3':

                bucket_name = parsed_url.netloc
                s3_key = parsed_url.path.lstrip('/')
            elif parsed_url.scheme in ('http', 'https') and 's3' in parsed_url.netloc:

                bucket_name = parsed_url.netloc.split('.')[0]
                s3_key = parsed_url.path.lstrip('/')
            else:
                raise ValueError(
                    "Invalid S3 URL format. Use 's3://...' or 'https://bucket-name.s3...'")

            if not bucket_name or not s3_key:
                raise ValueError("Could not parse bucket name or key from URL")

            s3_client = boto3.client(
                's3',
                aws_access_key_id=self.aws_access_key_id,
                aws_secret_access_key=self.aws_secret_access_key,
                region_name=self.region_name
            )

            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            print(f"Downloading from {s3_url} to {local_path}...")
            print(f"Bucket: {bucket_name}, Key: {s3_key}")

            s3_client.download_file(
                Bucket=bucket_name,
                Key=s3_key,
                Filename=local_path
            )

            print("Download completed successfully!")

            if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
                print(f"File size: {os.path.getsize(local_path)} bytes")
            else:
                print("Warning: Downloaded file appears to be empty")

        except ClientError as e:
            print(f"Failed to download file: {e}")
            if e.response['Error']['Code'] == '404':
                print("The object does not exist in S3", e)
            elif e.response['Error']['Code'] == '403':
                print("Access denied - check your credentials and permissions")
        except ValueError as e:
            print(f"URL parsing error: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
