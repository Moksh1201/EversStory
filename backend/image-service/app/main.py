# from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
# from . import image, utils, schemas, database
# from fastapi.responses import FileResponse
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordBearer
# import os

# # Set up FastAPI
# app = FastAPI()

# # CORS (cross-origin resource sharing) configuration if you need it for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows all origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods
#     allow_headers=["*"],  # Allows all headers
# )

# # Dependency to get the database session
# def get_db():
#     db = database.get_database_connection()
#     try:
#         yield db
#     finally:
#         db.close()

# # Define the routes for images (Upload, Update, Delete)
# app.include_router(image.router)
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from . import image, utils, schemas, database
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import os

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.get_database_connection()
    try:
        yield db
    finally:
        db.close()

app.include_router(image.router, prefix="/images")
