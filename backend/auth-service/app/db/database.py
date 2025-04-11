from dotenv import load_dotenv
load_dotenv()

import motor.motor_asyncio
import os

MONGO_URL = os.environ.get("MONGO_URL")  # ✅ This now matches .env

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client["EveryStory"]  # You can use any DB name you like
