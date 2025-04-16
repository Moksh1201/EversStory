# from fastapi import HTTPException, APIRouter
# from fastapi.responses import JSONResponse
# from bson import ObjectId
# from datetime import datetime
# from app.schemas import FriendshipRequest, FriendListResponse, FriendshipResponse
# router = APIRouter()
# def build_friendship_record(requester, accepter, status):
#     return {
#         "requester": requester,
#         "accepter": accepter,
#         "status": status,
#         "created_at": datetime.utcnow(),
#         "updated_at": datetime.utcnow()
#     }


# async def create_request_logic(request: FriendshipRequest, db, current_user: str):
#     if request.requester != current_user:
#         raise HTTPException(status_code=403, detail="Unauthorized request")
#     if request.requester == request.accepter:
#         raise HTTPException(status_code=400, detail="Cannot request yourself")

#     existing = db.find_one({
#         "$or": [
#             {"requester": request.requester, "accepter": request.accepter, "status": "Pending"},
#             {"requester": request.accepter, "accepter": request.requester, "status": "Pending"}
#         ]
#     })
#     if existing:
#         raise HTTPException(status_code=400, detail="Request already exists")

#     db.insert_one(build_friendship_record(request.requester, request.accepter, "Pending"))
#     return JSONResponse(content={"message": "Friendship request sent!"})


# async def accept_request_logic(request: FriendshipRequest, db, current_user: str):
#     if request.accepter != current_user:
#         raise HTTPException(status_code=403, detail="Unauthorized to accept request")

#     friendship = db.find_one({
#         "requester": request.requester,
#         "accepter": request.accepter,
#         "status": "Pending"
#     })
#     if not friendship:
#         raise HTTPException(status_code=404, detail="Friendship request not found")

#     db.update_one({"_id": friendship["_id"]}, {
#         "$set": {
#             "status": "Accepted",
#             "updated_at": datetime.utcnow()
#         }
#     })

#     from app.database import client
#     user_collection = client["auth-service"]["users"]
#     user_collection.update_one({"email": request.accepter}, {"$addToSet": {"followers": request.requester}})
#     user_collection.update_one({"email": request.requester}, {"$addToSet": {"following": request.accepter}})

#     return JSONResponse(content={"message": "Friendship request accepted!"})


# async def reject_request_logic(request: FriendshipRequest, db):
#     friendship = db.find_one({
#         "requester": request.requester,
#         "accepter": request.accepter,
#         "status": "Pending"
#     })
#     if not friendship:
#         raise HTTPException(status_code=404, detail="Request not found")

#     db.update_one({"_id": friendship["_id"]}, {
#         "$set": {
#             "status": "Rejected",
#             "updated_at": datetime.utcnow()
#         }
#     })
#     return JSONResponse(content={"message": "Friendship request rejected!"})


# @router.get("/pending-requests/{email}")
# async def get_pending_requests_logic(email: str, db):
#     # Query to get pending requests for a user, either as requester or accepter
#     pending_requests = db.find({
#         "$or": [
#             {"requester": email, "status": "Pending"},
#             {"accepter": email, "status": "Pending"}
#         ]
#     })

#     if not pending_requests:
#         raise HTTPException(status_code=404, detail="No pending requests found for this user")

#     # Prepare response from the pending requests
#     pending_requests_list = [
#         FriendshipResponse(
#             id=str(doc["_id"]),
#             requester=doc["requester"],
#             accepter=doc["accepter"],
#             status=doc["status"],
#             created_at=doc["created_at"],
#             updated_at=doc["updated_at"]
#         )
#         for doc in pending_requests
#     ]
    
#     return FriendListResponse(friends=pending_requests_list)

# async def get_friends_logic(user_id: str, db):
#     friendships = db.find({
#         "$or": [
#             {"requester": user_id, "status": "Accepted"},
#             {"accepter": user_id, "status": "Accepted"}
#         ]
#     })

#     friends = [
#         FriendshipResponse(
#             id=str(doc["_id"]),
#             requester=doc["requester"],
#             accepter=doc["accepter"],
#             status=doc["status"],
#             created_at=doc["created_at"],
#             updated_at=doc["updated_at"]
#         )
#         for doc in friendships
#     ]
#     return FriendListResponse(friends=friends)

# async def cancel_request_logic(request: FriendshipRequest, db, current_user: str):
#     if request.requester != current_user:
#         raise HTTPException(status_code=403, detail="Unauthorized to cancel this request")

#     friendship = db.find_one({
#         "requester": request.requester,
#         "accepter": request.accepter,
#         "status": "Pending"
#     })

#     if not friendship:
#         raise HTTPException(status_code=404, detail="No pending request found")

#     db.delete_one({"_id": friendship["_id"]})
#     return JSONResponse(content={"message": "Friendship request cancelled!"})


# async def unfollow_logic(request: FriendshipRequest, db, current_user: str):
#     if current_user != request.requester and current_user != request.accepter:
#         raise HTTPException(status_code=403, detail="Unauthorized to unfollow")

#     friendship = db.find_one({
#         "$or": [
#             {"requester": request.requester, "accepter": request.accepter},
#             {"requester": request.accepter, "accepter": request.requester}
#         ],
#         "status": "Accepted"
#     })

#     if not friendship:
#         raise HTTPException(status_code=404, detail="No existing friendship to unfollow")

#     db.delete_one({"_id": friendship["_id"]})

#     from app.database import client
#     user_collection = client["auth-service"]["users"]
#     user_collection.update_one({"email": request.accepter}, {"$pull": {"followers": request.requester}})
#     user_collection.update_one({"email": request.requester}, {"$pull": {"following": request.accepter}})
#     user_collection.update_one({"email": request.requester}, {"$pull": {"followers": request.accepter}})
#     user_collection.update_one({"email": request.accepter}, {"$pull": {"following": request.requester}})

#     return JSONResponse(content={"message": "Unfollowed successfully!"})
from fastapi import HTTPException, APIRouter
from fastapi.responses import JSONResponse
from bson import ObjectId
from datetime import datetime
from app.schemas import FriendshipRequest, FriendListResponse, FriendshipResponse
from app.database import client

router = APIRouter()

# Helper function to create a friendship record
def build_friendship_record(requester, accepter, status):
    return {
        "requester": requester,
        "accepter": accepter,
        "status": status,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

async def create_request_logic(request: FriendshipRequest, db, current_user: str):
    if request.requester != current_user:
        raise HTTPException(status_code=403, detail="Unauthorized request")
    if request.requester == request.accepter:
        raise HTTPException(status_code=400, detail="Cannot request yourself")

    existing = db.find_one({
        "$or": [
            {"requester": request.requester, "accepter": request.accepter, "status": "Pending"},
            {"requester": request.accepter, "accepter": request.requester, "status": "Pending"}
        ]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Request already exists")

    db.insert_one(build_friendship_record(request.requester, request.accepter, "Pending"))
    return JSONResponse(content={"message": "Friendship request sent!"})

async def accept_request_logic(request: FriendshipRequest, db, current_user: str):
    if request.accepter != current_user:
        raise HTTPException(status_code=403, detail="Unauthorized to accept request")

    friendship = db.find_one({
        "requester": request.requester,
        "accepter": request.accepter,
        "status": "Pending"
    })
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship request not found")

    db.update_one({"_id": friendship["_id"]}, {
        "$set": {
            "status": "Accepted",
            "updated_at": datetime.utcnow()
        }
    })

    user_collection = client["auth-service"]["users"]
    user_collection.update_one({"username": request.accepter}, {"$addToSet": {"followers": request.requester}})
    user_collection.update_one({"username": request.requester}, {"$addToSet": {"following": request.accepter}})

    return JSONResponse(content={"message": "Friendship request accepted!"})

async def reject_request_logic(request: FriendshipRequest, db):
    friendship = db.find_one({
        "requester": request.requester,
        "accepter": request.accepter,
        "status": "Pending"
    })
    if not friendship:
        raise HTTPException(status_code=404, detail="Request not found")

    db.update_one({"_id": friendship["_id"]}, {
        "$set": {
            "status": "Rejected",
            "updated_at": datetime.utcnow()
        }
    })
    return JSONResponse(content={"message": "Friendship request rejected!"})

@router.get("/pending-requests/{username}")
async def get_pending_requests_logic(username: str, db):
    pending_requests = db.find({
        "$or": [
            {"requester": username, "status": "Pending"},
            {"accepter": username, "status": "Pending"}
        ]
    })

    if not pending_requests:
        raise HTTPException(status_code=404, detail="No pending requests found for this user")

    pending_requests_list = [
        FriendshipResponse(
            id=str(doc["_id"]),
            requester=doc["requester"],
            accepter=doc["accepter"],
            status=doc["status"],
            created_at=doc["created_at"],
            updated_at=doc["updated_at"]
        )
        for doc in pending_requests
    ]
    
    return FriendListResponse(friends=pending_requests_list)

async def get_friends_logic(username: str, db):
    friendships = db.find({
        "$or": [
            {"requester": username, "status": "Accepted"},
            {"accepter": username, "status": "Accepted"}
        ]
    })

    friends = [
        FriendshipResponse(
            id=str(doc["_id"]),
            requester=doc["requester"],
            accepter=doc["accepter"],
            status=doc["status"],
            created_at=doc["created_at"],
            updated_at=doc["updated_at"]
        )
        for doc in friendships
    ]
    return FriendListResponse(friends=friends)

async def cancel_request_logic(request: FriendshipRequest, db, current_user: str):
    if request.requester != current_user:
        raise HTTPException(status_code=403, detail="Unauthorized to cancel this request")

    friendship = db.find_one({
        "requester": request.requester,
        "accepter": request.accepter,
        "status": "Pending"
    })

    if not friendship:
        raise HTTPException(status_code=404, detail="No pending request found")

    db.delete_one({"_id": friendship["_id"]})
    return JSONResponse(content={"message": "Friendship request cancelled!"})

async def unfollow_logic(request: FriendshipRequest, db, current_user: str):
    if current_user != request.requester and current_user != request.accepter:
        raise HTTPException(status_code=403, detail="Unauthorized to unfollow")

    friendship = db.find_one({
        "$or": [
            {"requester": request.requester, "accepter": request.accepter},
            {"requester": request.accepter, "accepter": request.requester}
        ],
        "status": "Accepted"
    })

    if not friendship:
        raise HTTPException(status_code=404, detail="No existing friendship to unfollow")

    db.delete_one({"_id": friendship["_id"]})

    user_collection = client["auth-service"]["users"]
    user_collection.update_one({"username": request.accepter}, {"$pull": {"followers": request.requester}})
    user_collection.update_one({"username": request.requester}, {"$pull": {"following": request.accepter}})
    user_collection.update_one({"username": request.requester}, {"$pull": {"followers": request.accepter}})
    user_collection.update_one({"username": request.accepter}, {"$pull": {"following": request.requester}})

    return JSONResponse(content={"message": "Unfollowed successfully!"})
