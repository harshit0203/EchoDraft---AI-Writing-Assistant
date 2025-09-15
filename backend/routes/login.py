from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from database import get_database
from app.schemas import LoginRequest
from app.models import User
from app.auth import verify_password, create_access_token
from datetime import datetime
import json
from bson import json_util


router = APIRouter(prefix="/auth", tags=["Authentication"])

def convert_bson(doc):
    return json.loads(json_util.dumps(doc))

@router.post("/login")
async def login(user: LoginRequest, db=Depends(get_database)):
    users_collection = db.users

    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        return JSONResponse(status_code=400, content={"message": "Invalid credentials", "status": False})

    if not verify_password(user.password, db_user["password"]):
        return JSONResponse(status_code=400, content={"message": "Invalid credentials", "status": False})

    user_settings = await db.settings.find_one({"user_id": db_user["_id"]})

    db_user["_id"] = str(db_user["_id"])
    token = create_access_token(
        {"sub": db_user["_id"], "email": db_user["email"]},
        remember_me=user.remember_me
    )

    print(user_settings)

    return {"access_token": token, "token_type": "bearer", "status": True, "user_data": db_user, "user_settings": convert_bson(user_settings)}

@router.post("/logout")
async def logout():
    """
    Provides an endpoint for the client to call upon logging out.
    The primary action (deleting the token) happens on the client-side.
    This endpoint can be used for server-side logging or future token blacklisting.
    """

    return {"message": "Logout successful", "status": True}