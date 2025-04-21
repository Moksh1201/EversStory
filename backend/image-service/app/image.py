import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status, Header
from jose import JWTError, jwt
from app.schemas import ImageOut
from app.utils import s3_utils
from app import database
from app.models import create_image_metadata
from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
from app import models
from app.utils.jwt_utils import verify_jwt_token

# Setting up the router and OAuth2 password bearer
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Retrieve the secret key and algorithm from environment variables
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# Check if the secret key and algorithm are valid
if not JWT_SECRET or not ALGORITHM:
    raise ValueError("SECRET_KEY or ALGORITHM is not set in the environment variables")

# Function to get the current user ID from the authorization token
async def get_current_user_id(authorization: str = Header(...)) -> str:
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

        payload = verify_jwt_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user_id not found in token")

        return user_id

    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization format")


# Upload image endpoint
@router.post("/upload", response_model=ImageOut)
async def upload_image(
    file: UploadFile = File(...),
    caption: Optional[str] = "",
    visibility: Optional[str] = "public",
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


@router.get("/feed", response_model=List[ImageOut])
def get_feed(
    db=Depends(database.get_database_connection),
    user_id: str = Depends(get_current_user_id)
):
    images = db["images"].find({
        "$or": [
            {"visibility": "public"},
            {"user_id": user_id}
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

@router.get("/user-feed/{user_id}", response_model=List[ImageOut])
def get_user_feed(
    user_id: str,
    viewer_id: str = Depends(get_current_user_id),
    db=Depends(database.get_database_connection)
):
    images_collection = db["images"]
    user_collection = db["users"]

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
