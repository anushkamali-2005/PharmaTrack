from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import API routers
from api.v1 import inventory, analytics, alerts

# Create FastAPI app
app = FastAPI(
    title="Smart Pharmacy API",
    description="AI-powered pharmacy inventory management system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware - Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",
        "https://*.vercel.app",   # Vercel deployments
        "*",  # Allow all for development (restrict in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])


# ==================== ROOT ENDPOINTS ====================

@app.get("/")
def root():
    """API root endpoint - Returns basic info"""
    return {
        "message": "Smart Pharmacy API",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
def health_check():
    """Health check endpoint - Used by deployment platforms"""
    return {
        "status": "healthy",
        "database": "connected",
        "environment": os.getenv("PYTHON_ENV", "development"),
        "api_version": "1.0.0"
    }


@app.get("/api/v1/status")
def api_status():
    """API status endpoint - Lists all available endpoints"""
    return {
        "api": "v1",
        "status": "ready",
        "endpoints": {
            "inventory": [
                "GET /api/v1/inventory/medicines",
                "GET /api/v1/inventory/medicines/{id}",
                "GET /api/v1/inventory/inventory",
                "GET /api/v1/inventory/low-stock",
                "GET /api/v1/inventory/expiring-soon",
                "GET /api/v1/inventory/categories",
                "GET /api/v1/inventory/stats",
            ],
            "analytics": [
                "GET /api/v1/analytics/dashboard",
                "GET /api/v1/analytics/sales-trends",
                "GET /api/v1/analytics/category-distribution",
                "GET /api/v1/analytics/inventory-value",
                "GET /api/v1/analytics/top-medicines",
                "GET /api/v1/analytics/supplier-performance",
            ],
            "alerts": [
                "GET /api/v1/alerts/",
                "GET /api/v1/alerts/unread-count",
                "GET /api/v1/alerts/stats",
                "PUT /api/v1/alerts/{id}/acknowledge",
                "PUT /api/v1/alerts/{id}/resolve",
                "DELETE /api/v1/alerts/{id}",
            ],
        },
        "documentation": "/docs"
    }
