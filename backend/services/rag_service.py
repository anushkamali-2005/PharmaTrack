import os
import shutil
import pandas as pd
from typing import List, Dict
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Configuration
CSV_PATH = "backend/dataset/raw/medquad.csv"
CHROMA_DB_DIR = "backend/data/chroma_db"
COLLECTION_NAME = "medquad_knowledge_base"

class RagService:
    def __init__(self):
        self.vector_store = None
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small") # Cost effective & powerful
        self.llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
        self._initialize_db()

    def _initialize_db(self):
        """Initialize ChromaDB connection."""
        if os.path.exists(CHROMA_DB_DIR):
            self.vector_store = Chroma(
                persist_directory=CHROMA_DB_DIR,
                embedding_function=self.embeddings,
                collection_name=COLLECTION_NAME
            )
            print(f"✅ ChromaDB Loaded. Collection: {COLLECTION_NAME}")
        else:
            print("ℹ️ ChromaDB not found. Please ingest data.")

    def ingest_csv(self, file_path: str = CSV_PATH):
        """
        Ingest CSV -> Chunk -> Embed -> Store in ChromaDB.
        """
        try:
            print(f"🔄 Loading CSV from {file_path}...")
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            df = pd.read_csv(file_path)
            # Basic cleaning
            df = df.fillna('')
            
            documents = []
            print("🔄 Processing documents...")
            for _, row in df.iterrows():
                # Construct meaningful context
                content = (
                    f"Question: {row.get('question', '')}\n"
                    f"Answer: {row.get('answer', '')}\n"
                    f"Focus Area: {row.get('focus_area', '')}"
                )
                metadata = {
                    "source": str(row.get('source', 'Unknown')),
                    "focus_area": str(row.get('focus_area', 'General'))
                }
                documents.append(Document(page_content=content, metadata=metadata))

            # Best Chunking Strategy for Q&A
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", " ", ""]
            )
            split_docs = text_splitter.split_documents(documents)
            print(f"📄 Generated {len(split_docs)} chunks from {len(documents)} rows.")

            # Create/Update Vector Store
            if os.path.exists(CHROMA_DB_DIR):
                shutil.rmtree(CHROMA_DB_DIR) # Force rebuild for clean state
            
            self.vector_store = Chroma.from_documents(
                documents=split_docs,
                embedding=self.embeddings,
                persist_directory=CHROMA_DB_DIR,
                collection_name=COLLECTION_NAME
            )
            self.vector_store.persist()
            print("✅ Ingestion Complete & Persisted to ChromaDB.")
            return True

        except Exception as e:
            print(f"❌ Ingestion Failed: {e}")
            raise e

    def analyze_with_rag(self, drug_name: str, patient_context: dict) -> Dict:
        """
        Full RAG Pipeline: Retrieve -> Analyze with GPT-4o-mini
        """
        if not self.vector_store:
            return {"error": "Knowledge base not ready"}

        # 1. Retrieval
        query = f"{drug_name} side effects interactions contraindications {patient_context.get('conditions', [])}"
        retriever = self.vector_store.as_retriever(search_kwargs={"k": 5})
        docs = retriever.get_relevant_documents(query)
        
        context_text = "\n\n".join([d.page_content for d in docs])
        
        # 2. Generation (Analysis)
        prompt = f"""
        You are an expert AI Pharmacist Safety Engine.
        
        Patient Context:
        - Conditions: {patient_context.get('conditions', [])}
        - Current Meds: {patient_context.get('current_medications', [])}
        
        Drug to Review: {drug_name}
        
        Relevant Medical Knowledge (Context):
        {context_text}
        
        Task:
        Analyze the safety of prescribing {drug_name}.
        1. Calculate a Safety Score (0-100).
        2. Identify specific warnings.
        3. Recommend safer alternatives if score < 70.
        
        Output format (JSON only):
        {{
            "score": int,
            "warnings": [{{ "severity": "high/medium/low", "message": "string" }}],
            "explanation": "string",
            "alternatives": [{{ "name": "string", "reason": "string", "confidence": int }}]
        }}
        """
        
        response = self.llm.invoke(prompt)
        return response.content

rag_service = RagService()
