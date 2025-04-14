# from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form
# from . import utils, schemas, models, database
# from bson.objectid import ObjectId
# from .utils.compress_utils import compress_image
# from .utils.s3_utils import upload_to_s3, fetch_from_s3, delete_from_s3
# from datetime import datetime
# import mimetypes
# from fastapi.responses import StreamingResponse
# from fastapi.responses import RedirectResponse

# router = APIRouter()

# @router.post("/upload/")
# async def upload_image(
#     file: UploadFile = File(...),
#     user_id: str = Form(...),
#     visibility: str = Form("public"),
#     caption: str = Form(None)
# ):
#     try:
#         db = database.get_database_connection()
        
#         compressed = await compress_image(file)
        
#         image_url = await upload_to_s3(compressed, file.filename)

#         image_data = {
#             "user_id": user_id,
#             "file_name": file.filename,
#             "image_url": image_url,
#             "caption": caption,
#             "visibility": visibility,
#             "created_at": datetime.utcnow()
#         }

#         result = db.images.insert_one(image_data)
#         image_data["_id"] = str(result.inserted_id)

#         return {"message": "Image uploaded successfully", "data": image_data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")


# @router.get("/fetch/{image_id}")
# async def fetch_image(image_id: str):
#     try:
#         db = database.get_database_connection()
#         image = db.images.find_one({"_id": ObjectId(image_id)})
#         if not image:
#             raise HTTPException(status_code=404, detail="Image not found")

#         image_url = image.get("image_url")
#         if not image_url:
#             raise HTTPException(status_code=500, detail="Image URL not found in database")

#         # Directly redirect to the stored image URL
#         return RedirectResponse(url=image_url, status_code=303)  # Use 303 See Other

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching image: {str(e)}")

# @router.delete("/delete/{image_id}")
# async def delete_image(image_id: str):
#     try:
#         db = database.get_database_connection()
#         image = db.images.find_one({"_id": ObjectId(image_id)})
#         if not image:
#             raise HTTPException(status_code=404, detail="Image not found")

#         image_url = image.get("image_url")
#         if image_url:
#             await delete_from_s3(image_url)

#         delete_result = db.images.delete_one({"_id": ObjectId(image_id)})
#         if delete_result.deleted_count == 1:
#             return {"message": "Image deleted successfully"}
#         else:
#             raise HTTPException(status_code=500, detail="Failed to delete image record")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error deleting image: {str(e)}")


from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status, Request
from typing import List, Optional
from app.schemas import ImageOut
from app.utils import s3_utils
from app.database import db
from app import database
from app.models import create_image_metadata, get_image_metadata, delete_image_metadata
from app.utils.auth import get_current_user_id

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from bson import ObjectId
import os

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("SECRET_KEY", "yoursecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@router.post("/upload", response_model=ImageOut)
async def upload_image(
    file: UploadFile = File(...),
    caption: str = "",
    visibility: str = "public",
    db=Depends(database.get_database_connection),
    user_id: str = Depends(get_current_user_id)
):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    file_bytes = await file.read()
    image_url = await s3_utils.upload_to_s3(file_bytes, file.filename)

    image_id = models.create_image_metadata(
        db=db,
        user_id=user_id,
        file_name=file.filename,
        image_url=image_url,
        caption=caption,
        visibility=visibility
    )

    return {
        "image_url": image_url,
        "caption": caption,
        "visibility": visibility,
        "user_id": user_id
    }

@router.get("/user-feed/{user_id}", response_model=list[ImageOut])
def get_user_feed(
    user_id: str,
    viewer_id: str = Depends(get_current_user_id),
    db=Depends(database.get_database_connection)
):
    images_collection = db["images"]
    user_collection = db["users"]
    # Check if user_id is public or followed by viewer
    user = user_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["visibility"] == "public" or viewer_id in user.get("followers", []):
        images = images_collection.find({"user_id": user_id})
        return [ImageOut(**img) for img in images]

    raise HTTPException(status_code=403, detail="You do not have permission to view these images.")


@router.delete("/{image_id}", status_code=204)
async def delete_image(
    image_id: str,
    db=Depends(database.get_database_connection),
    user_id: str = Depends(get_current_user_id)
):
    image = db["images"].find_one({"_id": ObjectId(image_id)})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    if image["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this image")

    await s3_utils.delete_from_s3(image["image_url"])
    db["images"].delete_one({"_id": ObjectId(image_id)})

    return {"detail": "Image deleted successfully"}


@router.get("/{image_id}", response_model=ImageOut)
async def get_image(
    image_id: str,
    db=Depends(database.get_database_connection),
    user_id: str = Depends(get_current_user_id)
):
    image = db["images"].find_one({"_id": ObjectId(image_id)})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    if image["visibility"] == "private" and image["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this image")

    return {
        "image_url": image["image_url"],
        "caption": image["caption"],
        "visibility": image["visibility"],
        "user_id": image["user_id"]
    }


@router.get("/feed", response_model=List[ImageOut])
def get_feed(
    db=Depends(database.get_database_connection),
    user_id: str = Depends(get_current_user_id)
):
    # Show all public images + own private ones
    images = db["images"].find({
        "$or": [
            {"visibility": "public"},
            {"user_id": user_id}
            # Future: Include private images of followed users
        ]
    }).sort("created_at", -1)

    return [
        ImageOut(
            image_url=img["image_url"],
            caption=img.get("caption"),
            visibility=img["visibility"],
            user_id=img["user_id"]
        )
        for img in images
    ]


@router.put("/{image_id}", response_model=ImageOut)
def update_image_metadata(
    image_id: str,
    caption: Optional[str] = "",
    visibility: Optional[str] = "public",
    db=Depends(database.get_database_connection),
    user_id: str = Depends(get_current_user_id)
):
    image = db["images"].find_one({"_id": ObjectId(image_id)})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    if image["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db["images"].update_one(
        {"_id": ObjectId(image_id)},
        {"$set": {"caption": caption, "visibility": visibility}}
    )

    updated = db["images"].find_one({"_id": ObjectId(image_id)})
    return {
        "image_url": updated["image_url"],
        "caption": updated.get("caption"),
        "visibility": updated["visibility"],
        "user_id": updated["user_id"]
    }
