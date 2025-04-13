# from fastapi import FastAPI, HTTPException, Depends, APIRouter
# from fastapi.security import OAuth2PasswordBearer
# from fastapi.responses import JSONResponse
# from datetime import datetime
# from typing import List
# from pymongo import MongoClient
# from pymongo.collection import Collection
# import os
# from pydantic import BaseModel
# import jwt
# from typing import Generator
# import logging



# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Add OAuth2PasswordBearer for token-based authentication
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# # MongoDB setup
# MONGO_URI = os.getenv("MONGO_URI")
# if MONGO_URI is None:
#     raise ValueError("MONGO_URI environment variable not set")
# client = MongoClient(MONGO_URI)
# db = client["friendship-service"]
# friendships_collection: Collection = db["EveryStory"]

# # Pydantic schemas
# class FriendshipRequest(BaseModel):
#     requester: str
#     accepter: str

# class FriendshipResponse(BaseModel):
#     id: str
#     requester: str
#     accepter: str
#     status: str
#     created_at: datetime
#     updated_at: datetime

# class FriendListResponse(BaseModel):
#     friends: List[FriendshipResponse]

# # Dependency for database access
# def get_db() -> Generator:
#     try:
#         yield friendships_collection
#     finally:
#         pass

# # Helper function to update friendship status
# def update_friendship_status(requester: str, accepter: str, status: str) -> dict:
#     return {
#         "requester": requester,
#         "accepter": accepter,
#         "status": status,
#         "updated_at": datetime.utcnow(),
#         "created_at": datetime.utcnow() if status == "Pending" else None
#     }

# SECRET_KEY = os.getenv("JWT_SECRET")
# if SECRET_KEY is None:
#     raise ValueError("JWT_SECRET environment variable not set")
    
# ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
#     try:
#         # Decode the JWT token and get the payload
#         logger.info(f"Decoding token with SECRET_KEY: {SECRET_KEY[:5]}...")
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         logger.info(f"Token payload: {payload}")
        
#         username = payload.get("sub")
#         if username is None:
#             logger.error("No 'sub' field found in token payload")
#             raise HTTPException(status_code=403, detail="Invalid token structure")
        
#         logger.info(f"Authenticated user: {username}")
#         return username
#     except jwt.ExpiredSignatureError:
#         logger.error("Token has expired")
#         raise HTTPException(status_code=403, detail="Token has expired")
#     except jwt.InvalidTokenError as e:
#         logger.error(f"Invalid token: {str(e)}")
#         raise HTTPException(status_code=403, detail="Could not validate credentials")
#     except Exception as e:
#         logger.error(f"Unexpected error during token validation: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")

# # Create FastAPI app instance
# app = FastAPI()
# friendship_router = APIRouter()

# # # Create a friendship request (follow request)
# @friendship_router.post("/request")
# async def create_friendship(request: FriendshipRequest, db: Collection = Depends(get_db)):
#     # Ensure the requester and accepter are not the same
#     if request.requester == request.accepter:
#         raise HTTPException(status_code=400, detail="Requester cannot be the same as the accepter")

#     # Prevent sending multiple requests to the same person
#     existing_request = db.find_one({
#         "$or": [
#             {"requester": request.requester, "accepter": request.accepter, "status": "Pending"},
#             {"requester": request.accepter, "accepter": request.requester, "status": "Pending"}
#         ]
#     })
#     if existing_request:
#         raise HTTPException(status_code=400, detail="Friendship request already exists")

#     friendship_data = update_friendship_status(request.requester, request.accepter, "Pending")
#     result = db.insert_one(friendship_data)

#     if not result.inserted_id:
#         raise HTTPException(status_code=500, detail="Failed to create friendship request")

#     return JSONResponse(content={"message": "Friendship request sent!"}, status_code=200)

# # Reject a friendship request
# @friendship_router.post("/reject")
# async def reject_friendship(request: FriendshipRequest, db: Collection = Depends(get_db)):
#     friendship = db.find_one({
#         "requester": request.requester,
#         "accepter": request.accepter,
#         "status": "Pending"
#     })

#     if not friendship:
#         raise HTTPException(status_code=404, detail="Friendship request not found")

#     updated_friendship = update_friendship_status(request.requester, request.accepter, "Rejected")
#     db.update_one({"_id": friendship["_id"]}, {"$set": updated_friendship})

#     return JSONResponse(content={"message": "Friendship request rejected!"}, status_code=200)

# # Get all friends of a user
# @friendship_router.get("/friends/{user_id}", response_model=FriendListResponse)
# async def get_friends(user_id: str, db: Collection = Depends(get_db)):
#     accepted_friendships = db.find({
#         "$or": [{"requester": user_id, "status": "Accepted"}, {"accepter": user_id, "status": "Accepted"}]
#     })

#     friends = []
#     for friendship in accepted_friendships:
#         friends.append(FriendshipResponse(
#             id=str(friendship["_id"]),
#             requester=friendship["requester"],
#             accepter=friendship["accepter"],
#             status=friendship["status"],
#             created_at=friendship["created_at"],
#             updated_at=friendship["updated_at"]
#         ))

#     return FriendListResponse(friends=friends)

# @friendship_router.post("/accept")
# async def accept_friendship(
#     request: FriendshipRequest,
#     db: Collection = Depends(get_db),
#     current_user: str = Depends(get_current_user)
# ):
#     # Ensure the user who accepts is the same as the accepter
#     if current_user != request.accepter:
#         raise HTTPException(status_code=403, detail="You are not authorized to accept this request")

#     # Check if the friendship request exists and is pending
#     friendship = db.find_one({
#         "requester": request.requester,
#         "accepter": request.accepter,
#         "status": "Pending"
#     })

#     if not friendship:
#         raise HTTPException(status_code=404, detail="Friendship request not found or already accepted/rejected")

#     # Update the friendship status to "Accepted"
#     updated_friendship = update_friendship_status(request.requester, request.accepter, "Accepted")
#     db.update_one({"_id": friendship["_id"]}, {"$set": updated_friendship})

#     return JSONResponse(content={"message": "Friendship request accepted!"}, status_code=200)

# # Register friendship routes
# app.include_router(friendship_router)


from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pymongo.collection import Collection
import os
import jwt

from app.database import get_db
from app.schemas import FriendshipRequest, FriendListResponse
from app.friendship import (
    create_request_logic,
    accept_request_logic,
    reject_request_logic,
    get_friends_logic,
    cancel_request_logic,
    unfollow_logic
)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload.get("sub")


@app.post("/request")
async def create_friendship(
    request: FriendshipRequest,
    db: Collection = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return await create_request_logic(request, db, current_user)


@app.post("/accept")
async def accept_friendship(
    request: FriendshipRequest,
    db: Collection = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return await accept_request_logic(request, db, current_user)


@app.post("/reject")
async def reject_friendship(
    request: FriendshipRequest,
    db: Collection = Depends(get_db)
):
    return await reject_request_logic(request, db)


@app.get("/friends/{user_id}", response_model=FriendListResponse)
async def get_friends(user_id: str, db: Collection = Depends(get_db)):
    return await get_friends_logic(user_id, db)


@app.post("/cancel-request")
async def cancel_request(
    request: FriendshipRequest,
    db: Collection = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return await cancel_request_logic(request, db, current_user)


@app.post("/unfollow")
async def unfollow(
    request: FriendshipRequest,
    db: Collection = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return await unfollow_logic(request, db, current_user)
