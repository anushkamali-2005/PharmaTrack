from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.features.rag_safety.service import safety_service

router = APIRouter()

class SafetyCheckRequest(BaseModel):
    drug_name: str
    conditions: List[str] = []
    current_medications: List[str] = []

class Alternative(BaseModel):
    name: str
    reason: str
    confidence: int

class Warning(BaseModel):
    severity: str
    message: str

class SafetyCheckResponse(BaseModel):
    score: int
    warnings: List[Warning]
    explanation: str
    alternatives: List[Alternative]
    citations: Optional[List[str]] = []

@router.post("/check", response_model=SafetyCheckResponse)
async def check_drug_safety(request: SafetyCheckRequest):
    """
    Perform a RAG-powered safety check for a drug.
    """
    try:
        result = safety_service.check_safety(
            drug_name=request.drug_name,
            conditions=request.conditions,
            current_meds=request.current_medications
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
