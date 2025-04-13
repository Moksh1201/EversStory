from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from . import utils, schemas
from bson.objectid import ObjectId
from fastapi.responses import FileResponse
import os

router = APIRouter()

# Upload image route
@router.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Compress the image before uploading
        compressed_file = await utils.compress_image(file)
        
        # Upload the image to S3
        image_url = await utils.upload_to_s3(compressed_file, file.filename)
        
        return {"message": "Image uploaded successfully", "image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

# Update image route (Assuming we are updating the image itself)
@router.put("/update/{image_id}/")
async def update_image(image_id: str, file: UploadFile = File(...)):
    try:
        # Compress the new image before uploading
        compressed_file = await utils.compress_image(file)
        
        # Replace old image in S3
        new_image_url = await utils.upload_to_s3(compressed_file, file.filename)
        
        # Optionally delete the old image from S3 (if necessary)
        # old_image_url = await utils.get_image_url_from_db(image_id)  # Example if you store URL in MongoDB
        # await utils.delete_from_s3(old_image_url)
        
        return {"message": "Image updated successfully", "new_image_url": new_image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating image: {str(e)}")

# Delete image route
@router.delete("/delete/{image_id}/")
async def delete_image(image_id: str):
    try:
        # Get image URL from DB (if stored in DB)
        # image_url = await utils.get_image_url_from_db(image_id)
        
        # Delete the image from S3
        # await utils.delete_from_s3(image_url)
        
        return {"message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting image: {str(e)}")
