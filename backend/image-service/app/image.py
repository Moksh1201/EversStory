from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form
from . import utils, schemas, models, database
from bson.objectid import ObjectId
from .utils.compress_utils import compress_image
from .utils.s3_utils import upload_to_s3
from datetime import datetime

router = APIRouter()

@router.post("/upload/")
async def upload_image(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    visibility: str = Form("public"),
    caption: str = Form(None)
):
    try:
        db = database.get_database_connection()
        
        compressed = await compress_image(file)
        
        image_url = await upload_to_s3(compressed, file.filename)

        image_data = {
            "user_id": user_id,
            "file_name": file.filename,
            "image_url": image_url,
            "caption": caption,
            "visibility": visibility,
            "created_at": datetime.utcnow()
        }

        result = db.images.insert_one(image_data)
        image_data["_id"] = str(result.inserted_id)

        return {"message": "Image uploaded successfully", "data": image_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")
