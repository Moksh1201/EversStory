import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URL = os.getenv("MONGO_URL")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

settings = Settings()
