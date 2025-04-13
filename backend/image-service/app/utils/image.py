# from fastapi import APIRouter, File, UploadFile, HTTPException
# from fastapi.responses import StreamingResponse
# from app.utils.compress_utils import compress_image
# from app.utils.s3_utils import upload_to_s3, delete_from_s3, fetch_from_s3

# router = APIRouter()

# @router.post("/upload/")
# async def upload_image(file: UploadFile = File(...)):
#     try:
#         compressed = await compress_image(file)
#         image_url = await upload_to_s3(compressed, file.filename)
#         return {"message": "Image uploaded", "url": image_url}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.put("/update/{image_name}")
# async def update_image(image_name: str, file: UploadFile = File(...)):
#     try:
#         await delete_from_s3(image_name)  # delete old
#         compressed = await compress_image(file)
#         new_url = await upload_to_s3(compressed, image_name)
#         return {"message": "Image updated", "url": new_url}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.delete("/delete/{image_name}")
# async def delete_image(image_name: str):
#     try:
#         await delete_from_s3(image_name)
#         return {"message": "Image deleted"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/fetch/{image_name}")
# async def fetch_image(image_name: str):
#     try:
#         file_stream = await fetch_from_s3(image_name)
#         return StreamingResponse(file_stream, media_type="image/jpeg")
#     except Exception as e:
#         raise HTTPException(status_code=404, detail=str(e))
