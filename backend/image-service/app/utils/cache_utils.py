import redis
import os
from dotenv import load_dotenv

load_dotenv()

# Redis setup (if you want to cache metadata)
r = redis.StrictRedis(host=os.getenv("REDIS_HOST"), port=6379, db=0)

def cache_image_metadata(image_id, metadata):
    r.set(image_id, str(metadata))  # Store metadata as a string for simplicity

def get_cached_image_metadata(image_id):
    metadata = r.get(image_id)
    return metadata if metadata else None
