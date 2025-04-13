from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Load MongoDB URI from environment variables
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

# Access the database
db = client["EveryStory"]

# Function to get the database connection
def get_database_connection():
    return db
