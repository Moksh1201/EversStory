from pydantic import BaseModel
from typing import Optional

class ImageUpload(BaseModel):
    user_id: str
    visibility: str = "public"
    caption: Optional[str] = None
    file_name: str

class ImageOut(BaseModel):
    image_url: str
    caption: Optional[str]
    visibility: str
    user_id: str
