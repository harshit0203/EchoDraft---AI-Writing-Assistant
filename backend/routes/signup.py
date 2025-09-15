from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from database import get_database
from app.schemas import SignUpRequest
from app.models import User
from app.auth import hash_password
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup")
async def signup(user: SignUpRequest, db= Depends(get_database)):
    users_collection = db.users
    if user.password != user.confirm_password:
        return JSONResponse(
            status_code=400,
            content={"message": "Passwords do not match", "status": False}
        )
    
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
         return JSONResponse(
            status_code=400,
            content={"message": "Email already registered", "status": False}
        )
    
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        created_at=datetime.utcnow().isoformat()
    )

    users = await users_collection.insert_one(new_user.dict())
    await db.settings.insert_one({"user_id": users.inserted_id, "default_tone": "", "default_platform": ""})
    return JSONResponse(
        status_code=201,
        content={"message": "User registered successfully", "status": True}
    )