from fastapi import APIRouter, HTTPException, Depends
from database import get_database
from app.schemas import ResetPasswordRequest
from app.auth import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db= Depends(get_database)):
    users_collection = db.users
    
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    if verify_password(data.old_password, user['password']):
        hashed_pw = hash_password(data.new_password)
        await users_collection.update_one({"email": data.email}, {"$set": {"password": hashed_pw}})
        return {"message": "Password reset successful!", "status": True}
    else:
        raise HTTPException(status_code=400, detail="Current Password does not match")

