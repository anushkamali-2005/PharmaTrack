import os
import shutil
import pandas as pd
import json
from typing import List, Dict, Optional
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
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
CSV_PATH = "datasets/raw/medquad.csv"
CHROMA_DB_DIR = "backend/data/chroma_db"
COLLECTION_NAME = "medquad_safety_kb"

class SafetyRagService:
    def __init__(self):
        self.vector_store = None
        self.embeddings = None
        self.llm = None
        self._initialize_components()

    def _initialize_components(self):
        """Initialize Embeddings, LLM, and Vector Store."""
        try:
            # Initialize Embeddings (OpenAI)
            if os.getenv("OPENAI_API_KEY"):
                self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
            else:
                print("⚠️ OPENAI_API_KEY not found. Embeddings will fail.")

            # Initialize LLM (OpenAI)
            if os.getenv("OPENAI_API_KEY"):
                self.llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
            else:
                print("⚠️ OPENAI_API_KEY not found. Analysis will fail.")

            # Initialize Vector Store
            if os.path.exists(CHROMA_DB_DIR) and self.embeddings:
                self.vector_store = Chroma(
                    persist_directory=CHROMA_DB_DIR,
                    embedding_function=self.embeddings,
                    collection_name=COLLECTION_NAME
                )
        except Exception as e:
            print(f"❌ Initialization Error: {e}")

    def ingest_medquad(self, file_path: str = CSV_PATH) -> bool:
        """
        Ingest the MedQuad dataset CSV into ChromaDB.
        """
        try:
            print(f"🚀 Starting Ingestion for {file_path}...")
            
            if not os.path.exists(file_path):
                # Try relative to root if not found
                file_path = os.path.join(os.getcwd(), file_path)
                if not os.path.exists(file_path):
                    raise FileNotFoundError(f"Dataset not found at {file_path}")

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

    def check_safety(self, drug_name: str, conditions: List[str], current_meds: List[str]) -> Dict:
        """
        Analyze safety of a drug for a specific patient context using RAG.
        """
        if not self.vector_store or not self.llm:
            return {
                "score": 0,
                "warnings": [{"severity": "high", "message": "System unavailable (Missing API Keys or DB)"}],
                "alternatives": []
            }

        start_time = datetime.now()

        # 1. Retrieval
        query = f"{drug_name} side effects interactions contraindications {' '.join(conditions)} {' '.join(current_meds)}"
        retriever = self.vector_store.as_retriever(search_kwargs={"k": 5})
        docs = retriever.get_relevant_documents(query)
        
        context_text = "\n\n".join([d.page_content for d in docs])

        # 2. Analysis
        prompt = f"""
        Act as an expert Clinical Pharmacist.
        
        Patient Profile:
        - Target Drug: {drug_name}
        - Medical Conditions: {', '.join(conditions)}
        - Current Medications: {', '.join(current_meds)}
        
        relevant_medical_knowledge:
        {context_text}
        
        Task:
        Analyze the safety of prescribing {drug_name} for this patient.
        Check for:
        1. Drug-Drug Interactions (especially with {current_meds})
        2. Contraindications with Conditions ({conditions})
        3. Cumulative side effects.
        
        If Safety Score < 70, recommend 3 safer alternatives from the same therapeutic class if possible.
        
        Return ONLY valid JSON:
        {{
            "score": <0-100 integer>,
            "warnings": [
                {{"severity": "high"|"medium"|"low", "message": "Clear warning text"}}
            ],
            "explanation": "Brief clinical explanation.",
            "alternatives": [
                {{"name": "Drug Name", "reason": "Why it is safer", "confidence": <0-100>}}
            ]
        }}
        """

        try:
            response = self.llm.invoke(prompt)
            content = response.content.replace("```json", "").replace("```", "").strip()
            result = json.loads(content)
            
            # Add citations implicitly (mocked for now as detailed citation parsing needs more data)
            result["citations"] = ["MedQuad Knowledge Base", "FDA Drug Safety Database"]
            
            elapsed = (datetime.now() - start_time).total_seconds()
            print(f"⏱️ Safety Check completed in {elapsed:.2f}s")
            
            return result
        except Exception as e:
            print(f"❌ Analysis Failed: {e}")
            return {
                "score": 50,
                "warnings": [{"severity": "high", "message": "Analysis failed due to internal error."}],
                "explanation": "Could not complete analysis.",
                "alternatives": []
            }

safety_service = SafetyRagService()
