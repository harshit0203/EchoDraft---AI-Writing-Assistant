from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict


class User(BaseModel):
    full_name: str
    email: EmailStr
    password: str 
    created_at: Optional[str] = None

class GenerateText(BaseModel):
    document_id: str
    refinement_journey: List[Dict]
    final_enriched_text: str
