from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from bson import ObjectId
from datetime import datetime
from workflow.enrichment_ai import run_enrichment_workflow, InputRequest, OutputSchema
from database import get_database
from app.schemas import GenerateTextRequest
from app.models import GenerateText

router = APIRouter(prefix="/ai", tags=["AI Response"])

@router.post("/enrich-draft", response_model=GenerateText)
async def generate_text(payload: GenerateTextRequest, db = Depends(get_database)) -> GenerateText:

    if not ObjectId.is_valid(payload.user_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id (must be a valid MongoDB ObjectId).",
        )

    result: OutputSchema = run_enrichment_workflow(
        InputRequest(
            prompt_idea=payload.prompt_idea,
            tone=payload.tone,
            platform=payload.platform,
            enrichment_cycles=payload.enrichment_cycles,
        )
    )

    doc = {
        "user_id": ObjectId(payload.user_id),
        "prompt_idea": payload.prompt_idea,
        "tone": payload.tone,
        "platform": payload.platform,
        "enrichment_cycles": payload.enrichment_cycles,
        "refinement_journey": [
            (c.model_dump() if hasattr(c, "model_dump") else (c.dict() if hasattr(c, "dict") else c))
            for c in result.refinement_journey
        ],
        "final_enriched_text": result.final_enriched_text,
        "saved": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    try:
        inserted = await db.ai_generated_texts.insert_one(doc)
        inserted_id = str(inserted.inserted_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insert failed: {e}")

    return GenerateText(
        document_id = inserted_id,
        refinement_journey=doc["refinement_journey"],
        final_enriched_text=doc["final_enriched_text"],
    )

@router.get("/get-drafts/{document_id}/{user_id}")
async def get_data(document_id: str, user_id: str, db = Depends(get_database)):

    if not document_id or document_id == "" or not user_id or user_id == "":
        return JSONResponse(status_code=400, content={"message": "Document ID and User ID is required.", "status": False})
    
    data = await db.ai_generated_texts.find_one({"_id": ObjectId(document_id), "user_id": ObjectId(user_id) })

    if not data:
        return JSONResponse(status_code=200, content={"message": "No data found by this document ID and user ID.", "status": False})
    else:
        safe_data = convert_bson(data)
        return JSONResponse(
            status_code= 200,
            content={"data": safe_data, "status": True}
        )

@router.post("/save-draft/{document_id}")
async def save_draft(document_id: str, db = Depends(get_database)):
    if not document_id or document_id == "":
        return JSONResponse(status_code=400, content={"message": "Document ID is required.", "status": False})

    query_filter = {"_id": ObjectId(document_id)}
    update_operation = {"$set": {"saved": True}}

    updated_document = await db.ai_generated_texts.find_one_and_update(query_filter, update_operation, return_document=True)

    if updated_document:
        return JSONResponse(status_code=200, content={"message": "Draft saved successfully!", "status": True})
    
    return JSONResponse(status_code=400, content={"message": "Error Occurred!", "status": False})

@router.post("/delete-draft/{document_id}")
async def delete_draft(document_id: str, db = Depends(get_database)):
    if not document_id or document_id == "":
        return JSONResponse(status_code=400, content={"message": "Document ID is required.", "status": False})

    query_filter = {"_id": ObjectId(document_id)}

    updated_document = await db.ai_generated_texts.find_one_and_delete(query_filter)

    if updated_document:
        return JSONResponse(status_code=200, content={"message": "Draft deleted successfully!", "status": True})
    
    return JSONResponse(status_code=400, content={"message": "Error Occurred!", "status": False})

@router.get("/get-saved-drafts/{user_id}")
async def get_saved_drafts(user_id: str, db=Depends(get_database)):
    if not user_id or user_id == "":
        return JSONResponse(
            status_code=400, 
            content={"message": "User ID is required.", "status": False}
        )

    cursor = db.ai_generated_texts.find({"user_id": ObjectId(user_id), "saved": True})
    saved_drafts = await cursor.to_list(length=None)

    if not saved_drafts:
        return JSONResponse(
            status_code=200, 
            content={"message": "No data found", "status": True, "data": []}
        )

    serialized_drafts = convert_bson(saved_drafts)

    return JSONResponse(
        status_code=200,
        content={"message": "Data fetched successfully!", "data": serialized_drafts, "status": True}
    )


@router.get("/get-recent-drafts/{user_id}")
async def get_recent_drafts(user_id: str, db=Depends(get_database)):
    if not user_id or user_id == "":
        return JSONResponse(
            status_code=400, 
            content={"message": "User ID is required.", "status": False}
        )
    
    pipeline = [
        {"$match": {"user_id": ObjectId(user_id)}},
        {"$sort": {"created_at": -1}},
        {"$limit": 3}
    ]

    cursor = db.ai_generated_texts.aggregate(pipeline)
    recent_drafts = await cursor.to_list(length=3) 
    
    if not recent_drafts:
        return JSONResponse(
            status_code=200, 
            content={"message": "No drafts found.", "status": True, "data": []}
        )

    return JSONResponse(
        status_code=200, 
        content={
            "message": "Recent Drafts retrieved successfully.", 
            "data": convert_bson(recent_drafts), 
            "status": True
        }
    )




def convert_bson(doc):
    if isinstance(doc, dict):
        return {k: convert_bson(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [convert_bson(i) for i in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()  # or str(doc) if you prefer
    return doc

