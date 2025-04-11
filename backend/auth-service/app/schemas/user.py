from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserPublic(UserBase):
    bio: Optional[str] = None
    profile_image: Optional[HttpUrl] = None
    followers_count: int = 0
    following_count: int = 0
    created_at: datetime

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, max_length=30)
    bio: Optional[str] = Field(None, max_length=160)
    profile_image: Optional[HttpUrl] = None
