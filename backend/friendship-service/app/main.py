from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
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
    unfollow_logic,
    get_pending_requests_logic
)

app = FastAPI()

origins = [
    "http://localhost:*",
    "http://127.0.0.1:*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Auth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")  
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

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

@app.get("/friends/{username}", response_model=FriendListResponse)
async def get_friends(username: str, db: Collection = Depends(get_db)):
    return await get_friends_logic(username, db)

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

@app.get("/pending-requests/{username}")
async def get_pending_requests(
    username: str,
    db: Collection = Depends(get_db)
):
    return await get_pending_requests_logic(username, db)