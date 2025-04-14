from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URL, tls=True, tlsAllowInvalidCertificates=True)

db = client["EveryStory"]

def get_database_connection():
    return db
