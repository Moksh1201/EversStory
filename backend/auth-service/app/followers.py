from fastapi import APIRouter, HTTPException, Depends
from app.database import followers_collection, user_collection
from app.schemas import FollowRequestSchema, UserResponse
from app.auth import get_current_user

router = APIRouter()

@router.post("/follow")
async def follow_user(follow_request: FollowRequestSchema, current_user: dict = Depends(get_current_user)):
    # Check if user exists
    follower = current_user["username"]
    following = follow_request.following_username

    existing_follow = followers_collection.find_one({"follower_username": follower, "following_username": following})
    if existing_follow:
        raise HTTPException(status_code=400, detail="Already following or pending follow request.")

    followers_collection.insert_one({
        "follower_username": follower,
        "following_username": following,
        "status": "pending"
    })
    return {"message": "Follow request sent"}

@router.post("/accept-follow")
async def accept_follow(follow_request: FollowRequestSchema, current_user: dict = Depends(get_current_user)):
    # Accept a pending follow request
    follower = follow_request.follower_username
    following = current_user["username"]

    request = followers_collection.find_one({"follower_username": follower, "following_username": following, "status": "pending"})
    if not request:
        raise HTTPException(status_code=404, detail="Follow request not found or already processed.")
    
    followers_collection.update_one(
        {"follower_username": follower, "following_username": following},
        {"$set": {"status": "accepted"}}
    )
    return {"message": "Follow request accepted"}

@router.get("/pending-requests")
async def pending_requests(current_user: dict = Depends(get_current_user)):
    pending = list(followers_collection.find({"following_username": current_user["username"], "status": "pending"}))
    return {"pending_requests": [request["follower_username"] for request in pending]}
