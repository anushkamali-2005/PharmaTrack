import os
import shutil

def safe_move(src, dst):
    try:
        if os.path.exists(src):
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.move(src, dst)
            print(f"Moved {src} -> {dst}")
        else:
            print(f"Skipped {src} (Not found)")
    except Exception as e:
        print(f"Error moving {src}: {e}")

# Backend Moves
safe_move("backend/services/safety_rag.py", "backend/features/rag_safety/service.py")
safe_move("backend/api/v1/safety.py", "backend/features/rag_safety/router.py")
safe_move("scripts/ingest_medquad.py", "backend/features/rag_safety/ingest.py")

# Frontend Moves
safe_move("frontend/src/components/safety/SafetyScoreCard.tsx", "frontend/src/features/rag_safety/components/SafetyScoreCard.tsx")
safe_move("frontend/src/components/safety/AlternativeMeds.tsx", "frontend/src/features/rag_safety/components/AlternativeMeds.tsx")

# Cleanup
if os.path.exists("frontend/src/components/safety"):
    try:
        os.rmdir("frontend/src/components/safety")
        print("Removed empty dir frontend/src/components/safety")
    except:
        pass
