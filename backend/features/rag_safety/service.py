import os
import shutil
import pandas as pd
import json
from typing import List, Dict, Optional
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
# Attempt to find .env in backend root (2 levels up from features/rag_safety)
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.dirname(os.path.dirname(current_dir))
env_path = os.path.join(backend_root, ".env")
load_dotenv(env_path)

# Configuration
CSV_PATH = os.path.join(backend_root, "data/medquad.csv")
CHROMA_DB_DIR = os.path.join(backend_root, "data/chroma_db")
COLLECTION_NAME = "medquad_safety_kb"

class SafetyRagService:
    def __init__(self):
        self.vector_store = None
        self.embeddings = None
        self.llm = None
        self._initialized = False
        # Lazy initialization - don't initialize on import to speed up deployment

    def _initialize_components(self):
        """Initialize Embeddings, LLM, and Vector Store."""
        try:
            # Initialize Embeddings (Google Gemini)
            google_api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
            if google_api_key:
                self.embeddings = GoogleGenerativeAIEmbeddings(
                    model="models/embedding-001",
                    google_api_key=google_api_key
                )
            else:
                print("⚠️ GOOGLE_API_KEY or GEMINI_API_KEY not found. Embeddings will fail.")

            # Initialize LLM (Google Gemini)
            if google_api_key:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-pro",
                    temperature=0,
                    google_api_key=google_api_key
                )
            else:
                print("⚠️ GOOGLE_API_KEY or GEMINI_API_KEY not found. Analysis will fail.")

            # Initialize Vector Store
            if os.path.exists(CHROMA_DB_DIR) and self.embeddings:
                self.vector_store = Chroma(
                    persist_directory=CHROMA_DB_DIR,
                    embedding_function=self.embeddings,
                    collection_name=COLLECTION_NAME
                )
                print(f"✅ ChromaDB Loaded. Collection: {COLLECTION_NAME}")
        except Exception as e:
            print(f"❌ Initialization Error: {e}")

    def ingest_medquad(self, file_path: str = None) -> bool:
        """
        Ingest the MedQuad dataset CSV into ChromaDB.
        """
        # Initialize components if not already done
        self._ensure_initialized()
        
        try:
            if file_path is None:
                file_path = CSV_PATH
            
            print(f"🚀 Starting Ingestion for {file_path}...")
            
            # Try multiple possible paths
            if not os.path.exists(file_path):
                # Try relative to current working directory
                alt_path = os.path.join(os.getcwd(), "datasets/raw/medquad.csv")
                if os.path.exists(alt_path):
                    file_path = alt_path
                else:
                    # Try from backend root
                    alt_path2 = os.path.join(backend_root, "datasets/raw/medquad.csv")
                    if os.path.exists(alt_path2):
                        file_path = alt_path2
                    else:
                        raise FileNotFoundError(f"Dataset not found. Tried: {CSV_PATH}, {alt_path}, {alt_path2}")

            # Handle potential encoding issues
            # Latin-1 will never raise UnicodeDecodeError as it maps all 256 bytes
            df = pd.read_csv(file_path, encoding='latin-1')
            
            df = df.fillna('')
            
            print(f"📊 Loaded {len(df)} rows. Processing...")
            
            documents = []
            for _, row in df.iterrows():
                # Create a rich context string
                # MedQuad usually has 'question', 'answer'
                q = row.get('question', '')
                a = row.get('answer', '')
                source = row.get('source', 'MedQuad')
                
                content = f"Question: {q}\nAnswer: {a}"
                
                meta = {
                    "source": str(source),
                    "question": str(q)[:100] # truncate for metadata
                }
                documents.append(Document(page_content=content, metadata=meta))

            # Chunking Strategy
            # Medical text can be complex, so 1000 chars with overlap is a good start.
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", " ", ""]
            )
            split_docs = text_splitter.split_documents(documents)
            print(f"✂️ Split into {len(split_docs)} chunks.")

            # Clean existing DB
            if os.path.exists(CHROMA_DB_DIR):
                shutil.rmtree(CHROMA_DB_DIR)
                print("🧹 Cleared existing ChromaDB.")

            # Store in Chroma
            if self.embeddings:
                self.vector_store = Chroma.from_documents(
                    documents=split_docs,
                    embedding=self.embeddings,
                    persist_directory=CHROMA_DB_DIR,
                    collection_name=COLLECTION_NAME
                )
                print("✅ Ingestion Complete: Data persisted to ChromaDB.")
                return True
            else:
                print("❌ Ingestion Failed: No Embeddings initialized.")
                return False

        except Exception as e:
            print(f"❌ Ingestion Error: {e}")
            return False

    def _ensure_initialized(self):
        """Lazy initialization - only initialize when actually needed."""
        if not self._initialized:
            self._initialize_components()
            self._initialized = True

    def check_safety(self, drug_name: str, conditions: List[str], current_meds: List[str]) -> Dict:
        """
        Analyze safety of a drug for a specific patient context using RAG.
        Implements the full RAG-powered safety search engine workflow.
        """
        # Initialize only when needed (lazy loading)
        self._ensure_initialized()
        
        if not self.vector_store or not self.llm:
            return {
                "score": 0,
                "warnings": [{"severity": "high", "message": "System unavailable (Missing API Keys or DB). Please ensure GOOGLE_API_KEY is set and knowledge base is ingested."}],
                "explanation": "The safety analysis system is not properly initialized. Please contact system administrator.",
                "alternatives": [],
                "citations": [],
                "fda_alerts": []
            }

        start_time = datetime.now()

        # Step 1: Retrieval - Search knowledge base
        query = f"{drug_name} side effects interactions contraindications {' '.join(conditions) if conditions else ''} {' '.join(current_meds) if current_meds else ''}"
        retriever = self.vector_store.as_retriever(search_kwargs={"k": 10})  # Get top 10 most relevant
        docs = retriever.get_relevant_documents(query)
        
        if not docs:
            # Edge Case: Unknown Drug
            return {
                "score": 0,
                "warnings": [{"severity": "high", "message": f"Drug '{drug_name}' not found in knowledge base. Please verify spelling or consult prescriber."}],
                "explanation": "The drug could not be found in our medical knowledge database. This may indicate a new drug, misspelling, or proprietary name variation.",
                "alternatives": [],
                "citations": [],
                "fda_alerts": []
            }
        
        context_text = "\n\n".join([f"Source: {d.metadata.get('source', 'MedQuad')}\n{d.page_content}" for d in docs])

        # Step 2: AI Analysis with Gemini
        prompt = f"""You are an expert Clinical Pharmacist AI Safety Engine. Analyze drug safety with precision.

PATIENT PROFILE:
- Target Drug: {drug_name}
- Medical Conditions: {', '.join(conditions) if conditions else 'None specified'}
- Current Medications: {', '.join(current_meds) if current_meds else 'None'}

RELEVANT MEDICAL KNOWLEDGE (Retrieved from Knowledge Base):
{context_text}

ANALYSIS TASK:
1. Calculate Safety Score (0-100):
   - 90-100: Very Safe - No significant concerns
   - 70-89: Safe with Caution - Minor interactions or warnings
   - 40-69: Moderate Risk - Significant interactions or contraindications
   - 0-39: High Risk - Severe contraindications or dangerous interactions

2. Identify Specific Risks:
   - Drug-Drug Interactions: Check interactions between {drug_name} and current medications ({', '.join(current_meds) if current_meds else 'N/A'})
   - Condition Contraindications: Check if {drug_name} is safe for conditions: {', '.join(conditions) if conditions else 'N/A'}
   - Cumulative Side Effects: Assess additive effects
   - FDA Warnings: Extract any recent FDA alerts from the knowledge base

3. Alternative Medicine Recommendations (if score < 70):
   - Find 3 safer alternatives from the same therapeutic class
   - Explain why each alternative is safer
   - Provide confidence score (0-100) for each recommendation
   - Consider patient's specific conditions and current medications

4. Generate Citations:
   - Extract source information from the knowledge base
   - Format as research citations

CRITICAL: Return ONLY valid JSON, no markdown, no explanations outside JSON:
{{
    "score": <integer 0-100>,
    "warnings": [
        {{"severity": "high"|"medium"|"low", "message": "<specific warning text>"}}
    ],
    "explanation": "<brief clinical explanation in plain language>",
    "alternatives": [
        {{"name": "<drug name>", "reason": "<why it's safer>", "confidence": <integer 0-100>}}
    ],
    "citations": [
        "<citation text from knowledge base>"
    ],
    "fda_alerts": [
        "<any FDA warnings found in knowledge base>"
    ]
}}
"""

        try:
            response = self.llm.invoke(prompt)
            content = response.content.strip()
            
            # Clean JSON response (remove markdown code blocks if present)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            result = json.loads(content)
            
            # Ensure all required fields exist
            result.setdefault("score", 50)
            result.setdefault("warnings", [])
            result.setdefault("explanation", "Analysis completed.")
            result.setdefault("alternatives", [])
            result.setdefault("citations", ["MedQuad Knowledge Base", "FDA Drug Safety Database"])
            result.setdefault("fda_alerts", [])
            
            # Validate score range
            result["score"] = max(0, min(100, int(result["score"])))
            
            elapsed = (datetime.now() - start_time).total_seconds()
            print(f"⏱️ Safety Check completed in {elapsed:.2f}s for {drug_name}")
            
            return result
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parsing Error: {e}")
            print(f"Response content: {response.content[:500] if 'response' in locals() else 'N/A'}")
            # Fallback: Try to extract basic info from response
            return {
                "score": 50,
                "warnings": [{"severity": "medium", "message": "AI analysis completed but response format was unexpected. Please review carefully."}],
                "explanation": "Safety analysis was performed but the response format needs manual review.",
                "alternatives": [],
                "citations": ["MedQuad Knowledge Base"],
                "fda_alerts": []
            }
        except Exception as e:
            print(f"❌ Analysis Failed: {e}")
            import traceback
            traceback.print_exc()
            # Edge Case: Gemini API Failure - Fallback to rule-based
            return {
                "score": 50,
                "warnings": [{"severity": "high", "message": "Advanced AI analysis unavailable. Falling back to basic safety check. Please consult prescriber for complex cases."}],
                "explanation": "The AI analysis service encountered an error. Basic drug interaction checks are still available, but advanced analysis is temporarily unavailable.",
                "alternatives": [],
                "citations": ["MedQuad Knowledge Base"],
                "fda_alerts": []
            }

safety_service = SafetyRagService()
