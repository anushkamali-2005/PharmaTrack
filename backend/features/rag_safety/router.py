from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from features.rag_safety.service import safety_service

router = APIRouter()

class SafetyCheckRequest(BaseModel):
    drug_name: str
    conditions: List[str] = []
    current_medications: List[str] = []

class Alternative(BaseModel):
    name: str
    reason: str
    confidence: int
    inventory_status: Optional[str] = None  # "in_stock", "low_stock", "out_of_stock"
    price: Optional[float] = None

class Warning(BaseModel):
    severity: str
    message: str

class SafetyCheckResponse(BaseModel):
    score: int
    warnings: List[Warning]
    explanation: str
    alternatives: List[Alternative]
    citations: Optional[List[str]] = []
    fda_alerts: Optional[List[str]] = []

@router.post("/check", response_model=SafetyCheckResponse)
async def check_drug_safety(request: SafetyCheckRequest):
    """
    Perform a RAG-powered safety check for a drug.
    
    This endpoint:
    1. Searches the MedQuad knowledge base using vector similarity
    2. Analyzes drug interactions, contraindications, and safety
    3. Provides safety score (0-100)
    4. Recommends safer alternatives if score < 70
    5. Returns FDA alerts and research citations
    """
    try:
        result = safety_service.check_safety(
            drug_name=request.drug_name,
            conditions=request.conditions,
            current_meds=request.current_medications
        )
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Safety check failed: {str(e)}")

@router.get("/search-drugs")
async def search_drugs(q: str = Query(..., description="Search query for drug name")):
    """
    Search for drugs by name (for autocomplete).
    Returns list of matching drug names from knowledge base.
    """
    try:
        # Simple search - in production, this would search the actual medicine database
        # For now, return common drug names that match
        common_drugs = [
            "Aspirin", "Paracetamol", "Ibuprofen", "Metformin", "Lisinopril",
            "Amlodipine", "Atorvastatin", "Omeprazole", "Amlodipine", "Levothyroxine",
            "Albuterol", "Metoprolol", "Losartan", "Gabapentin", "Sertraline",
            "Tramadol", "Furosemide", "Hydrochlorothiazide", "Pantoprazole", "Simvastatin"
        ]
        
        query_lower = q.lower()
        matches = [drug for drug in common_drugs if query_lower in drug.lower()]
        
        return {"drugs": matches[:10]}  # Return top 10 matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest")
async def ingest_knowledge_base(background_tasks: BackgroundTasks):
    """
    Ingest the MedQuad dataset into the vector database.
    This is a long-running operation, so it runs in the background.
    """
    try:
        def run_ingestion():
            safety_service.ingest_medquad()
        
        background_tasks.add_task(run_ingestion)
        return {
            "status": "started",
            "message": "Knowledge base ingestion started in background. This may take several minutes."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@router.get("/status")
async def get_safety_status():
    """
    Check if the safety system is ready (knowledge base loaded, API keys configured).
    """
    try:
        # Trigger initialization to get accurate status
        safety_service._ensure_initialized()
        
        has_vector_store = safety_service.vector_store is not None
        has_llm = safety_service.llm is not None
        has_embeddings = safety_service.embeddings is not None
        
        # Check if API key is configured
        import os
        has_api_key = bool(os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY"))
        
        # Check if ChromaDB directory exists
        from features.rag_safety.service import CHROMA_DB_DIR
        chroma_db_exists = os.path.exists(CHROMA_DB_DIR)
        
        message = "System ready"
        if not has_api_key:
            message = "Google API key not configured. Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable."
        elif not chroma_db_exists:
            message = "ChromaDB not found. Run /ingest endpoint to create knowledge base."
        elif not has_vector_store:
            message = "Vector store not loaded. Run /ingest endpoint to populate knowledge base."
        elif not (has_llm and has_embeddings):
            message = "LLM or embeddings not configured. Check API key configuration."
        
        return {
            "ready": has_vector_store and has_llm and has_embeddings,
            "vector_store_loaded": has_vector_store,
            "llm_configured": has_llm,
            "embeddings_configured": has_embeddings,
            "api_key_configured": has_api_key,
            "chroma_db_exists": chroma_db_exists,
            "message": message
        }
    except Exception as e:
        return {
            "ready": False,
            "error": str(e),
            "message": f"Error checking status: {str(e)}"
        }
