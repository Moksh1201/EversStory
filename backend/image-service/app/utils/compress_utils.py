# app/utils/compress_utils.py

from PIL import Image as PILImage
from io import BytesIO

async def compress_image(file):
    image = PILImage.open(file.file)
    image = image.convert("RGB")
    image.thumbnail((1024, 1024))

    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=85)
    buffer.seek(0)

    return buffer.getvalue()
