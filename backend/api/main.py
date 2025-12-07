from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Smart Pharmacy System API",
    description="Backend API for Smart Pharmacy Inventory Management System",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Smart Pharmacy System API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
