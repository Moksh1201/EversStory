from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["EveryStory"]

user_collection = db.get_collection("users")
followers_collection = db.get_collection("followers")

# You might want to add a function to get the database instance for dependency injection
def get_database():
    return db