# import jwt
# import os
# from datetime import datetime, timedelta
# from dotenv import load_dotenv
# from fastapi import Depends, HTTPException, status, APIRouter
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from pydantic import BaseModel
# from typing import Optional

# from app.database import user_collection
# from app.utils import get_password_hash, verify_password
# from app.schemas import User  # This User includes username, email, password
# import logging
# load_dotenv()

# router = APIRouter()

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# SECRET_KEY = os.getenv("JWT_SECRET")
# ALGORITHM = os.getenv("JWT_ALGORITHM")
# ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


# # Token response schema
# class Token(BaseModel):
#     access_token: str
#     token_type: str


# # This is only used for current user (not to be confused with imported User model)
# class CurrentUser(BaseModel):
#     username: str


# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
#     if expires_delta is None:
#         expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode = data.copy()
#     expire = datetime.utcnow() + expires_delta
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt


# @router.post("/register")
# async def register_user(user: User):
#     existing_user = user_collection.find_one({
#         "$or": [{"username": user.username}, {"email": user.email}]
#     })
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Username or email already taken")

#     hashed_password = get_password_hash(user.password)

#     user_collection.insert_one({
#         "username": user.username,
#         "email": user.email,
#         "password": hashed_password,
#         "followers": [],
#         "following": [],
#         "pending_requests": []
#     })

#     return {"message": "User registered successfully"}


# @router.post("/login", response_model=Token)
# async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
#     user = user_collection.find_one({"username": form_data.username})
#     if not user or not verify_password(form_data.password, user["password"]):
#         raise HTTPException(status_code=400, detail="Incorrect username or password")

#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
#     # 🔥 Email in sub, username as additional info
#     access_token = create_access_token(
#         data={
#             "sub": user["email"],  # Should be email
#             "username": user["username"]
#         },
#         expires_delta=access_token_expires
#     )

#     return Token(access_token=access_token, token_type="bearer")



# @router.get("/me", response_model=CurrentUser)
# async def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         logging.info("Attempting to validate token")
#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM],
#             options={"verify_exp": True}  # Ensure token expiration is checked
#         )
#         logging.info(f"Token validated successfully for payload: {payload}")
        
#         email: str = payload.get("sub")
#         if not email:
#             logging.error("No email found in token payload")
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid token: no email claim found",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )
            
#         user_data = user_collection.find_one({"email": email})
#         if not user_data:
#             logging.error(f"No user found for email: {email}")
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="User not found",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )
            
#         logging.info(f"Successfully retrieved user data for {email}")
#         return CurrentUser(username=user_data["username"])
        
#     except jwt.ExpiredSignatureError:
#         logging.error("Token has expired")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Token has expired",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     except jwt.InvalidTokenError as e:
#         logging.error(f"Invalid token: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=f"Invalid token: {str(e)}",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     except Exception as e:
#         logging.error(f"Unexpected error in /me endpoint: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An unexpected error occurred",
#         )

import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from app.database import user_collection
from app.utils import get_password_hash, verify_password
import logging
from app.schemas import User 


load_dotenv()

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")  # Default to HS256 if not set
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Token response schema
class Token(BaseModel):
    access_token: str
    token_type: str

# This is used for the current user (not to be confused with imported User model)
class CurrentUser(BaseModel):
    username: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register")
async def register_user(user: User):
    existing_user = user_collection.find_one({
        "$or": [{"username": user.username}, {"email": user.email}]
    })
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already taken")

    hashed_password = get_password_hash(user.password)

    user_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "followers": [],
        "following": [],
        "pending_requests": []
    })

    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    user = user_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        data={
            "sub": user["email"],  # Use email as the "sub" claim
            "username": user["username"]
        },
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=CurrentUser)
async def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        logging.info("Attempting to validate token")
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],  # Ensure algorithm matches
            options={"verify_exp": True}  # Ensure expiration is checked
        )
        logging.info(f"Token validated successfully for payload: {payload}")
        
        email: str = payload.get("sub")
        if not email:
            logging.error("No email found in token payload")
            raise credentials_exception
            
        user_data = user_collection.find_one({"email": email})
        if not user_data:
            logging.error(f"No user found for email: {email}")
            raise credentials_exception
        
        logging.info(f"Successfully retrieved user data for {email}")
        return CurrentUser(username=user_data["username"])
        
    except jwt.ExpiredSignatureError:
        logging.error("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        logging.error(f"Invalid token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logging.error(f"Unexpected error in /me endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred",
        )
