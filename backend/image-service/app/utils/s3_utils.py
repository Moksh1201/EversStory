# import boto3
# import mimetypes
# from io import BytesIO
# from botocore.exceptions import NoCredentialsError, PartialCredentialsError
# import os
# import logging

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Log the environment variables (without exposing sensitive values)
# logger.info(f"AWS Region: {os.getenv('AWS_REGION')}")
# logger.info(f"AWS Bucket: {os.getenv('AWS_S3_BUCKET_NAME')}")
# logger.info("AWS Access Key ID present: " + str(bool(os.getenv('AWS_ACCESS_KEY_ID'))))
# logger.info("AWS Secret Access Key present: " + str(bool(os.getenv('AWS_SECRET_ACCESS_KEY'))))

# # Create S3 client using environment variables
# s3 = boto3.client(
#     's3',
#     aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
#     aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
#     aws_session_token=os.getenv('AWS_SESSION_TOKEN'), 
#     region_name=os.getenv('AWS_REGION')
# )

# bucket_name = os.getenv("AWS_S3_BUCKET_NAME")  # Make sure this is set in your .env

# async def upload_to_s3(file_bytes, file_name):
#     try:
#         mime_type, _ = mimetypes.guess_type(file_name)

#         file_obj = BytesIO(file_bytes)
#         file_obj.seek(0)

#         s3.upload_fileobj(
#             file_obj,
#             bucket_name,
#             file_name,
#             ExtraArgs={'ContentType': mime_type or 'application/octet-stream'}
#         )
#         image_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
#         return image_url

#     except (NoCredentialsError, PartialCredentialsError):
#         raise Exception("AWS credentials not found. Make sure you ran `aws configure` or `aws sso login`.")
#     except Exception as e:
#         raise Exception(f"Error uploading to S3: {str(e)}")

# async def delete_from_s3(image_url):
#     try:
#         file_name = image_url.split("/")[-1]
#         s3.delete_object(Bucket=bucket_name, Key=file_name)
#     except Exception as e:
#         raise Exception(f"Error deleting image from S3: {str(e)}")

# async def fetch_from_s3(file_name: str):
#     try:
#         response = s3.get_object(Bucket=bucket_name, Key=file_name)
#         return BytesIO(response["Body"].read())
#     except Exception as e:
#         raise Exception(f"Error fetching: {str(e)}")


import boto3
import mimetypes
from io import BytesIO
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log the environment variables (without exposing sensitive values)
logger.info(f"AWS Region: {os.getenv('AWS_REGION')}")
logger.info(f"AWS Bucket: {os.getenv('AWS_S3_BUCKET_NAME')}")
logger.info("AWS Access Key ID present: " + str(bool(os.getenv('AWS_ACCESS_KEY_ID'))))
logger.info("AWS Secret Access Key present: " + str(bool(os.getenv('AWS_SECRET_ACCESS_KEY'))))

# Create S3 client using environment variables
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN'), 
    region_name=os.getenv('AWS_REGION')
)

bucket_name = os.getenv("AWS_S3_BUCKET_NAME")  # Make sure this is set in your .env

# Function to upload file to S3
async def upload_to_s3(file_bytes, file_name):
    try:
        mime_type, _ = mimetypes.guess_type(file_name)

        file_obj = BytesIO(file_bytes)
        file_obj.seek(0)

        # Upload file to S3 without specifying ACL to avoid ACL errors
        s3.upload_fileobj(
            file_obj,
            bucket_name,
            file_name,
            ExtraArgs={'ContentType': mime_type or 'application/octet-stream'}
        )
        image_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        return image_url

    except (NoCredentialsError, PartialCredentialsError):
        raise Exception("AWS credentials not found. Make sure you ran `aws configure` or `aws sso login`.")
    except Exception as e:
        raise Exception(f"Error uploading to S3: {str(e)}")

# Function to delete image from S3
async def delete_from_s3(image_url):
    try:
        file_name = image_url.split("/")[-1]
        s3.delete_object(Bucket=bucket_name, Key=file_name)
    except Exception as e:
        raise Exception(f"Error deleting image from S3: {str(e)}")

# Function to fetch file from S3
async def fetch_from_s3(file_name: str):
    try:
        response = s3.get_object(Bucket=bucket_name, Key=file_name)
        return BytesIO(response["Body"].read())
    except Exception as e:
        raise Exception(f"Error fetching: {str(e)}")
