from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Load MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URI)

# Access the database
db = client["image_service_db"]

# Function to get the database connection
def get_database_connection():
    return db
