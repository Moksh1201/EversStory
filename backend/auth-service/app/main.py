from fastapi import FastAPI
from app.auth import router as auth_router
from app.followers import router as followers_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(followers_router)
