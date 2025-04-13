from pymongo import MongoClient
from pymongo.collection import Collection
from typing import Generator
import os
# MongoDB URI from environment variable
MONGO_URL = os.getenv("MONGO_URI")

# MongoDB setup
client = MongoClient(MONGO_URL)
db = client["friendship-service"]
friendships_collection: Collection = db["EveryStory"]

# Dependency for database access
def get_db() -> Generator:
    try:
        yield friendships_collection
    finally:
        pass  # MongoDB client doesn't need explicit closing
