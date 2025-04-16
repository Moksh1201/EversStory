from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from app import image, utils, schemas, database

import os

app = FastAPI()

origins = [
    "http://localhost:5180",
    "http://127.0.0.1:5180"
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
