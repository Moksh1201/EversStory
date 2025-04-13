# app/utils.py (Corrected code3 - renamed for clarity, and its function is now integrated into main.py)
from datetime import datetime
from bson import ObjectId
from typing import Optional

# Helper function to handle the status change for friendships
def update_friendship_status(requester: str, accepter: str, status: str) -> dict:
    return {
        "requester": requester,
        "accepter": accepter,
        "status": status,
        "updated_at": datetime.utcnow(),
        "created_at": datetime.utcnow() if status == "Pending" else None
    }

# Function to generate ObjectId for MongoDB documents (if needed)
def str_to_oid(oid_str: str) -> Optional[ObjectId]:
    try:
        return ObjectId(oid_str)
    except Exception as e:
        return None