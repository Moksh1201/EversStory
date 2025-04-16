from pydantic import BaseModel
from datetime import datetime
from typing import List

class FriendshipRequest(BaseModel):
    requester: str  
    accepter: str   

class FriendshipResponse(BaseModel):
    id: str
    requester: str
    accepter: str
    status: str
    created_at: datetime
    updated_at: datetime

class FriendListResponse(BaseModel):
    friends: List[FriendshipResponse]