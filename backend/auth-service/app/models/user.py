from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId

class UserModel(BaseModel):
    email: EmailStr
    username: str
    hashed_password: str
    followers: List[str] = []
    following: List[str] = []
