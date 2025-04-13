from pymongo.collection import Collection
from datetime import datetime

def create_image_metadata(db: Collection, user_id: str, file_name: str, image_url: str, caption: str, visibility: str):
    image_doc = {
        "user_id": user_id,
        "file_name": file_name,
        "image_url": image_url,
        "caption": caption,
        "visibility": visibility,
        "created_at": datetime.utcnow()
    }
    result = db["images"].insert_one(image_doc)
    return str(result.inserted_id)

def get_image_metadata(db: Collection, image_id: str):
    return db["images"].find_one({"_id": image_id})

def delete_image_metadata(db: Collection, image_id: str):
    return db["images"].delete_one({"_id": image_id})
