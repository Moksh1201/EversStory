# from pydantic import BaseModel
# from bson import ObjectId
# from datetime import datetime

# class Friendship(BaseModel):
#     requester: str
#     accepter: str
#     status: str  # Pending, Accepted, Rejected
#     created_at: datetime
#     updated_at: datetime

#     class Config:
#         orm_mode = True
#         json_encoders = {
#             ObjectId: str
#         }
