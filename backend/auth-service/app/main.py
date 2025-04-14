# from fastapi import FastAPI
# from app.auth import router as auth_router
# from app.followers import router as followers_router

# app = FastAPI()

# app.include_router(auth_router)
# app.include_router(followers_router)
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.auth import router as auth_router
# from app.followers import router as followers_router

# app = FastAPI()

# # CORS config
# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173"
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # or ["*"] to allow all origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include routers
# app.include_router(auth_router, prefix="/auth")
# app.include_router(followers_router, prefix="/followers")


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router
from app.followers import router as followers_router

app = FastAPI()

# CORS config
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(followers_router, prefix="/followers")
