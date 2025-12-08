"""
Analytics API Endpoints
Provides dashboard statistics, trends, and insights.
"""

from fastapi import APIRouter, Query
from typing import List
from pydantic import BaseModel
from services.mock_data import (
    get_dashboard_stats,
    get_sales_trends,
    get_category_distribution,
    get_all_medicines,
    get_all_inventory,
)

router = APIRouter()


# ==================== PYDANTIC SCHEMAS ====================

class DashboardStats(BaseModel):
    """Dashboard statistics schema"""
    total_medicines: int
    total_inventory_value: float
    low_stock_items: int
    expiring_soon: int


class SalesTrend(BaseModel):
    """Sales trend data point"""
    date: str
    sales: int
    revenue: float


class CategoryDistribution(BaseModel):
    """Category distribution data"""
    category: str
    count: int


# ==================== DASHBOARD ENDPOINTS ====================

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard():
    """
    Get dashboard statistics.
    Returns key metrics for the main dashboard.
    """
    return get_dashboard_stats()


@router.get("/sales-trends", response_model=List[SalesTrend])
def get_sales(days: int = Query(30, description="Number of days")):
    """
    Get sales trends over time.
    
    - **days**: Number of days to retrieve (default: 30)
    
    Note: This returns mock data. Data Scientist will replace with real sales data.
    """
    return get_sales_trends(days)


@router.get("/category-distribution", response_model=List[CategoryDistribution])
def get_categories():
    """
    Get distribution of medicines by category.
    Useful for pie charts and category analysis.
    """
    return get_category_distribution()


# ==================== INVENTORY ANALYTICS ====================

@router.get("/inventory-value")
def get_inventory_value():
    """
    Get detailed inventory value breakdown by category.
    """
    medicines = get_all_medicines()
    inventory = get_all_inventory()
    
    # Calculate value by category
    category_values = {}
    
    for inv in inventory:
        med = next((m for m in medicines if m["id"] == inv["medicine_id"]), None)
        if med:
            category = med["category"]
            value = inv["quantity"] * med["price"]
            
            if category not in category_values:
                category_values[category] = {
                    "category": category,
                    "total_value": 0,
                    "item_count": 0,
                    "total_quantity": 0,
                }
            
            category_values[category]["total_value"] += value
            category_values[category]["item_count"] += 1
            category_values[category]["total_quantity"] += inv["quantity"]
    
    # Round values
    for cat in category_values.values():
        cat["total_value"] = round(cat["total_value"], 2)
    
    return {
        "categories": list(category_values.values()),
        "total_categories": len(category_values),
    }


@router.get("/top-medicines")
def get_top_medicines(limit: int = Query(10, description="Number of top items")):
    """
    Get top medicines by inventory value.
    
    - **limit**: Number of items to return (default: 10)
    """
    medicines = get_all_medicines()
    inventory = get_all_inventory()
    
    # Calculate value for each medicine
    medicine_values = []
    
    for med in medicines:
        total_quantity = 0
        total_value = 0
        
        for inv in inventory:
            if inv["medicine_id"] == med["id"]:
                total_quantity += inv["quantity"]
                total_value += inv["quantity"] * med["price"]
        
        if total_quantity > 0:
            medicine_values.append({
                "medicine_id": med["id"],
                "name": med["name"],
                "category": med["category"],
                "total_quantity": total_quantity,
                "total_value": round(total_value, 2),
                "unit_price": med["price"],
            })
    
    # Sort by value and return top N
    medicine_values.sort(key=lambda x: x["total_value"], reverse=True)
    
    return {
        "top_medicines": medicine_values[:limit],
        "total_medicines": len(medicine_values),
    }


# ==================== SUPPLIER ANALYTICS ====================

@router.get("/supplier-performance")
def get_supplier_performance():
    """
    Get supplier performance metrics.
    
    Note: This returns mock data. Data Scientist will add real metrics.
    """
    from services.mock_data import get_all_suppliers
    
    suppliers = get_all_suppliers()
    
    # Add mock performance metrics
    for supplier in suppliers:
        supplier["on_time_delivery"] = 95 if supplier["rating"] >= 4 else 85
        supplier["quality_score"] = supplier["rating"] * 20  # Convert 1-5 to 20-100
        supplier["avg_delivery_days"] = 3 if supplier["rating"] >= 4 else 5
    
    return {
        "suppliers": suppliers,
        "total_suppliers": len(suppliers),
    }


# ==================== EXPORT ENDPOINTS ====================

@router.get("/export/summary")
def export_summary():
    """
    Get summary data for export (CSV/PDF).
    Returns comprehensive data for reports.
    """
    stats = get_dashboard_stats()
    medicines = get_all_medicines()
    inventory = get_all_inventory()
    
    return {
        "generated_at": "2024-12-08T19:00:00",
        "summary": stats,
        "medicines_count": len(medicines),
        "inventory_items": len(inventory),
        "categories": get_category_distribution(),
    }
