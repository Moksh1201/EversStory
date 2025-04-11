from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserPublic, UserUpdate
from app.services.user_service import get_user_profile, update_user_profile, get_followers, get_following
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=UserPublic)
async def read_own_profile(current_user: str = Depends(get_current_user)):
    """
    Get your own user profile.
    """
    user = await get_user_profile(current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/", response_model=UserPublic)
async def update_profile(payload: UserUpdate, current_user: str = Depends(get_current_user)):
    """
    Update your own profile details.
    """
    updated_user = await update_user_profile(current_user, payload)
    return updated_user


@router.get("/followers", response_model=list[UserPublic])
async def list_followers(current_user: str = Depends(get_current_user)):
    """
    List all followers of the current user.
    """
    return await get_followers(current_user)


@router.get("/following", response_model=list[UserPublic])
async def list_following(current_user: str = Depends(get_current_user)):
    """
    List all users the current user is following.
    """
    return await get_following(current_user)
