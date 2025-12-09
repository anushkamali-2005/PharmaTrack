from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.rag_service import rag_service
# Placeholder for LLM service - assuming we use a simple mock or real integration later
# from services.llm_service import analyze_safety_with_llm 

router = APIRouter()

class PatientContext(BaseModel):
    conditions: List[str]
    current_medications: List[str]

class SafetyAnalysisRequest(BaseModel):
    drug_name: str
    patient_context: PatientContext

class SafetyResponse(BaseModel):
    score: int
    warnings: List[dict]
    alternatives: List[dict]
    citations: List[dict]

import json

@router.post("/analyze", response_model=SafetyResponse)
async def analyze_drug_safety(request: SafetyAnalysisRequest):
    """
    Analyze drug safety using RAG + LLM (GPT-4o-mini).
    """
    drug = request.drug_name
    context = request.patient_context.dict()
    
    try:
        # Call the RAG service which now uses OpenAI
        analysis_result_json = rag_service.analyze_with_rag(drug, context)
        
        # Parse the JSON string returned by the LLM
        if isinstance(analysis_result_json, str):
            # Clean up potential markdown formatting from LLM
            clean_json = analysis_result_json.replace("```json", "").replace("```", "").strip()
            result_data = json.loads(clean_json)
        else:
            result_data = analysis_result_json

        return {
            "score": result_data.get("score", 0),
            "warnings": result_data.get("warnings", []),
            "alternatives": result_data.get("alternatives", []),
            "citations": [{"title": "MedQuAD Knowledge Base", "source": "RAG Retrieval", "year": "2024"}] # Mock citation for now as Chroma retrieval details are abstracted
        }
    except Exception as e:
        print(f"Analysis Error: {e}")
        # Fallback response in case of LLM parsing error
        return {
            "score": 0,
            "warnings": [{"severity": "high", "message": "AI Analysis Failed. Please consult a doctor."}],
            "alternatives": [],
            "citations": []
        }

@router.post("/ingest")
async def ingest_knowledge_base(file: UploadFile = File(None)):
    """
    Ingest medquad.csv. 
    If file is uploaded, it replaces the existing one.
    If no file, it processes the file at backend/dataset/raw/medquad.csv.
    """
    target_path = "backend/dataset/raw/medquad.csv"
    os.makedirs(os.path.dirname(target_path), exist_ok=True)

    if file:
        with open(target_path, "wb+") as file_object:
            file_object.write(file.file.read())
    
    try:
        # Calls ingest which defaults to target_path and uses ChromaDB
        success = rag_service.ingest_csv(target_path)
        if success:
            return {"message": "Knowledge Base successfully embedded into ChromaDB."}
        else:
            raise HTTPException(status_code=500, detail="Failed to build index")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build index: {str(e)}")
