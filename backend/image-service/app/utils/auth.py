from fastapi import Header, HTTPException
import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET", "fvaUDvrU834r8@YE&@&1y")

def get_current_user_id(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid auth scheme")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
