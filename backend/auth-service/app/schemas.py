from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    username: str
    email: str
    password: str  

class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str

class FollowRequestSchema(BaseModel):
    follower_username: str
    following_username: str
    status: str  

class UserResponse(BaseModel):
    username: str
    email: str
    following: List[str]
    followers: List[str]
    pending_requests: List[str]

class FollowStatus(BaseModel):
    following_username: str
    status: str  

class Token(BaseModel):
    access_token: str
    token_type: str
