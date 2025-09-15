from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from database import get_database
from app.schemas import SettingsRequest
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/settings", tags=["Authentication"])

def convert_bson(obj):
    """Recursively convert BSON types (ObjectId, datetime) to JSON-serializable formats."""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_bson(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_bson(i) for i in obj]
    else:
        return obj

@router.get("/get-settings/{user_id}")
async def get_settings(user_id: str, db=Depends(get_database)):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required.")
    
    data = await db.settings.find_one({"user_id": ObjectId(user_id)})
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    list = [convert_bson(data), {"user_name": user['full_name']}]
    
    if data:
        return JSONResponse(status_code=200, content={"message":"Settings retrieved successfully.", "data": list, "status": True})
    
    return HTTPException(status_code=400, detail="Settings not found.")

@router.post("/save-changes")
async def save_changes(data: SettingsRequest, db=Depends(get_database)):
    
    user = await db.users.find_one({"_id": ObjectId(data.user_id) })

    if not user:
        raise HTTPException(status_code=400, detail="User not found.")
    
    if user['full_name'] != data.full_name:
        await db.users.update_one({"_id": ObjectId(data.user_id)}, {"$set": {"full_name": data.full_name}})

    settings = await db.settings.find_one({"user_id": ObjectId(data.user_id)})

    if settings:
        await db.settings.update_one({"user_id": ObjectId(data.user_id)}, {"$set": {"default_tone": data.default_tone, "default_platform": data.default_platform}})
        return JSONResponse(status_code=200, content={"message": "Settings updated successfully!", "status": True})
    else:
        document = {"default_tone": data.default_tone, "default_platform": data.default_platform, "user_id": ObjectId(data.user_id)}
        await db.settings.insert_one(document)
        return JSONResponse(status_code=200, content={"message": "Settings updated successfully!", "status": True})

