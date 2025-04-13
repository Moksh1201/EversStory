from pymongo import MongoClient
from pymongo.collection import Collection
from typing import Generator
import os
MONGO_URL = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URL)
db = client["friendship-service"]
friendships_collection: Collection = db["EveryStory"]

def get_db() -> Generator:
    try:
        yield friendships_collection
    finally:
        pass  
