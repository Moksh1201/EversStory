from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: str  # MongoDB returns ObjectId as a string
    username: str
