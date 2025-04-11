# from datetime import timedelta
# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordRequestForm
# from ..schemas import UserCreate, UserOut, Token
# from ..services.auth import (
#     authenticate_user,
#     create_user,
#     create_access_token,
#     ACCESS_TOKEN_EXPIRE_MINUTES,
# )
# from ..core.security import get_current_active_user
# from ..models import UserModel

# router = APIRouter(prefix="/auth", tags=["auth"])

# @router.post("/register", response_model=UserOut)
# async def register(user: UserCreate):
#     created_user = await create_user(user)
#     return created_user

# @router.post("/login", response_model=Token)
# async def login(form_data: OAuth2PasswordRequestForm = Depends()):
#     user = await authenticate_user(form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.email}, expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.get("/me", response_model=UserOut)
# async def read_users_me(current_user: UserModel = Depends(get_current_active_user)):
#     return current_user 