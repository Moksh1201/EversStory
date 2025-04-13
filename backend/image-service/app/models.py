from pydantic import BaseModel

class Image(BaseModel):
    image_url: str
    file_name: str
    size: int
    upload_time: str

class ImageUpdate(BaseModel):
    file_name: str
    new_size: int
