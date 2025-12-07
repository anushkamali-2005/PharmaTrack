from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Smart Pharmacy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Smart Pharmacy API",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "environment": os.getenv("PYTHON_ENV", "development")
    }

@app.get("/api/v1/status")
def api_status():
    return {
        "api": "v1",
        "endpoints": [
            "/api/v1/inventory",
            "/api/v1/predictions",
            "/api/v1/analytics",
            "/api/v1/alerts"
        ],
        "status": "ready"
    }
