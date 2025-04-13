from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["EveryStory"]

user_collection = db.get_collection("users")
followers_collection = db.get_collection("followers")

def get_database():
    return db