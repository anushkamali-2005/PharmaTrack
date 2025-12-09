import sys
import os

# Ensure project root is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
# current is backend/features/rag_safety
# up 1: backend/features
# up 2: backend
# up 3: project root
project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
sys.path.append(project_root)

from backend.features.rag_safety.service import safety_service

def main():
    print("====================================")
    print("💊 MedQuad Data Ingestion Script")
    print("====================================")
    
    success = safety_service.ingest_medquad()
    
    if success:
        print("\n✅ Data Successfully Ingested!")
        print("Ready for Safety Checks.")
        sys.exit(0)
    else:
        print("\n❌ Ingestion Failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
