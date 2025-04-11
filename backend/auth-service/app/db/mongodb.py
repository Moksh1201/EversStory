from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client.auth_db
user_collection = db.get_collection("users")
