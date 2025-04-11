from fastapi import HTTPException
from app.db.mongodb import user_collection
from app.schemas.user import UserCreate, UserLogin, Token
from app.core.security import get_password_hash, verify_password, create_access_token

async def register_user(user: UserCreate):
    existing = await user_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_password,
        "followers": [],
        "following": [],
    }
    await user_collection.insert_one(user_doc)
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

async def authenticate_user(user: UserLogin):
    db_user = await user_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

async def follow_user(username: str):
    # You should extract authenticated user info (e.g., via dependency injection)
    # For now, assume placeholder
    current_email = "test@example.com"
    current_user = await user_collection.find_one({"email": current_email})
    target_user = await user_collection.find_one({"username": username})

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target_user["email"] in current_user["following"]:
        return {"detail": "Already following"}
    
    await user_collection.update_one({"email": current_email}, {"$push": {"following": target_user["email"]}})
    await user_collection.update_one({"email": target_user["email"]}, {"$push": {"followers": current_email}})
    return {"detail": "Followed successfully"}

async def unfollow_user(username: str):
    current_email = "test@example.com"
    current_user = await user_collection.find_one({"email": current_email})
    target_user = await user_collection.find_one({"username": username})

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    await user_collection.update_one({"email": current_email}, {"$pull": {"following": target_user["email"]}})
    await user_collection.update_one({"email": target_user["email"]}, {"$pull": {"followers": current_email}})
    return {"detail": "Unfollowed successfully"}
