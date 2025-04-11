from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserLogin, Token
from app.services.user_service import register_user, authenticate_user

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    return await register_user(user)

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    return await authenticate_user(user)
