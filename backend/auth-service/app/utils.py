# app/utils.py (Corrected code 3)
from passlib.context import CryptContext
from jose import JWTError, jwt  # Import necessary modules

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# You can keep the Pydantic models in a separate schemas.py file
from pydantic import BaseModel
from typing import List, Optional

class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str

class FollowRequestSchema(BaseModel):
    follower_username: str
    following_username: str
    status: str  # 'pending', 'accepted', 'rejected'

class UserResponse(BaseModel):
    username: str
    email: str
    following: List[str]  # List of users the current user is following
    followers: List[str]  # List of users following the current user
    pending_requests: List[str]  # List of users who have sent follow requests