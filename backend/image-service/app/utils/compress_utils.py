from PIL import Image as PILImage
from io import BytesIO

async def compress_image(file):
    # Open the uploaded file
    image = PILImage.open(file.file)
    
    # Compress the image (resize and save in a more compressed format)
    image = image.convert("RGB")
    image.thumbnail((1024, 1024))  # Resize to fit in a 1024x1024 box
    
    # Save image to buffer
    buffered = BytesIO()
    image.save(buffered, format="JPEG", quality=85)  # Save with compression
    compressed_image = buffered.getvalue()
    
    return compressed_image
