import sys
import os

# Add backend to path so we can import modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    print("Attempting to import rag_service...")
    from services.rag_service import rag_service
    print("✅ Import successful.")
except Exception as e:
    print(f"❌ Import Failed: {e}")
    sys.exit(1)

# Test Ingestion
test_csv = "backend/data/test.csv"
os.makedirs("backend/data", exist_ok=True)

with open(test_csv, "w") as f:
    f.write("question,answer,source,focus_area\nWhat is test?,This is a test.,Debug,Test")

print(f"Attempting to ingest {test_csv}...")
try:
    success = rag_service.ingest_csv(test_csv)
    if success:
        print("✅ Ingestion successful.")
    else:
        print("❌ Ingestion returned False.")
except Exception as e:
    print(f"❌ Ingestion Exception: {e}")
    import traceback
    traceback.print_exc()

# Test Search
print("Attempting search...")
try:
    results = rag_service.search("test")
    print(f"Search Results: {results}")
except Exception as e:
    print(f"❌ Search Failed: {e}")
