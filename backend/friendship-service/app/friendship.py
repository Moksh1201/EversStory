from fastapi import APIRouter, HTTPException, Depends
from . import models, schemas, database
from .utils import update_friendship_status
from fastapi.responses import JSONResponse

friendship_router = APIRouter()

@friendship_router.post("/request")
async def create_friendship(request: schemas.FriendshipRequest, db: database.Db = Depends(get_db)):
    friendship_data = update_friendship_status(request.requester, request.accepter, "Pending")
    result = db.friendships.insert_one(friendship_data)

    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create friendship request")
    
    return JSONResponse(content={"message": "Friendship request sent!"}, status_code=200)

@friendship_router.post("/accept")
async def accept_friendship(request: schemas.FriendshipRequest, db: database.Db = Depends(get_db)):
    friendship = db.friendships.find_one({
        "requester": request.requester, 
        "accepter": request.accepter, 
        "status": "Pending"
    })
    
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship request not found")
    
    updated_friendship = update_friendship_status(request.requester, request.accepter, "Accepted")
    db.friendships.update_one({"_id": friendship["_id"]}, {"$set": updated_friendship})
    
    return JSONResponse(content={"message": "Friendship request accepted!"}, status_code=200)

@friendship_router.post("/reject")
async def reject_friendship(request: schemas.FriendshipRequest, db: database.Db = Depends(get_db)):
    friendship = db.friendships.find_one({
        "requester": request.requester, 
        "accepter": request.accepter, 
        "status": "Pending"
    })
    
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship request not found")
    
    updated_friendship = update_friendship_status(request.requester, request.accepter, "Rejected")
    db.friendships.update_one({"_id": friendship["_id"]}, {"$set": updated_friendship})
    
    return JSONResponse(content={"message": "Friendship request rejected!"}, status_code=200)
