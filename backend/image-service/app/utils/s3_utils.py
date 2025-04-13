import boto3
import os
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv
import mimetypes

load_dotenv()

# AWS S3 client setup
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

bucket_name = os.getenv("AWS_S3_BUCKET_NAME")

async def upload_to_s3(file_content, file_name):
    try:
        mime_type, _ = mimetypes.guess_type(file_name)
        s3.upload_fileobj(file_content, bucket_name, file_name, ExtraArgs={'ContentType': mime_type})
        image_url = f"https://{bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{file_name}"
        return image_url
    except NoCredentialsError:
        raise Exception("AWS Credentials not found.")
    except Exception as e:
        raise Exception(f"Error uploading to S3: {str(e)}")

async def delete_from_s3(image_url):
    try:
        file_name = image_url.split("/")[-1]
        s3.delete_object(Bucket=bucket_name, Key=file_name)
    except Exception as e:
        raise Exception(f"Error deleting image from S3: {str(e)}")
