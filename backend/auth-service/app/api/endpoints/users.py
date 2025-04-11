from fastapi import APIRouter
from app.services.user_service import follow_user, unfollow_user

router = APIRouter()

@router.post("/follow/{username}")
async def follow(username: str):
    return await follow_user(username)

@router.post("/unfollow/{username}")
async def unfollow(username: str):
    return await unfollow_user(username)
