"""
Inventory API Endpoints
Handles all medicine and inventory-related operations.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from services.mock_data import (
    get_all_medicines,
    get_medicine_by_id,
    search_medicines,
    get_all_inventory,
    get_low_stock_items,
    get_expiring_soon,
)

router = APIRouter()


# ==================== PYDANTIC SCHEMAS ====================

class MedicineResponse(BaseModel):
    """Medicine response schema"""
    id: int
    name: str
    generic_name: Optional[str]
    category: str
    manufacturer: Optional[str]
    dosage: Optional[str]
    price: float
    unit: str


class InventoryResponse(BaseModel):
    """Inventory response schema"""
    id: int
    medicine_id: int
    medicine_name: str
    quantity: int
    reorder_level: int
    batch_number: Optional[str]
    expiry_date: Optional[str]
    shelf_location: Optional[str]


# ==================== MEDICINE ENDPOINTS ====================

@router.get("/medicines", response_model=List[MedicineResponse])
def list_medicines(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
):
    """
    Get list of all medicines.
    
    - **category**: Filter by medicine category (optional)
    - **search**: Search medicines by name (optional)
    """
    if search:
        medicines = search_medicines(search)
    else:
        medicines = get_all_medicines()
    
    # Filter by category if provided
    if category:
        medicines = [m for m in medicines if m["category"] == category]
    
    return medicines


@router.get("/medicines/{medicine_id}", response_model=MedicineResponse)
def get_medicine(medicine_id: int):
    """
    Get specific medicine by ID.
    
    - **medicine_id**: The ID of the medicine to retrieve
    """
    medicine = get_medicine_by_id(medicine_id)
    
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    return medicine


class MedicineCreate(BaseModel):
    """Schema for creating a new medicine"""
    name: str
    generic_name: Optional[str] = None
    category: str
    manufacturer: Optional[str] = None
    dosage: Optional[str] = None
    price: float
    unit: str = "strip"
    description: Optional[str] = None


class MedicineUpdate(BaseModel):
    """Schema for updating a medicine"""
    name: Optional[str] = None
    generic_name: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    dosage: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    description: Optional[str] = None


@router.post("/medicines", response_model=MedicineResponse, status_code=201)
def create_medicine(medicine: MedicineCreate):
    """
    Create a new medicine.
    
    NOTE: Currently returns mock data. 
    DATA SCIENTIST: Replace with actual database insert.
    """
    # TODO: Replace with actual database insert
    # For now, return the created medicine with a mock ID
    new_medicine = {
        "id": 999,  # Mock ID
        "name": medicine.name,
        "generic_name": medicine.generic_name,
        "category": medicine.category,
        "manufacturer": medicine.manufacturer,
        "dosage": medicine.dosage,
        "price": medicine.price,
        "unit": medicine.unit,
    }
    
    return new_medicine


@router.put("/medicines/{medicine_id}", response_model=MedicineResponse)
def update_medicine(medicine_id: int, medicine: MedicineUpdate):
    """
    Update an existing medicine.
    
    NOTE: Currently returns mock data.
    DATA SCIENTIST: Replace with actual database update.
    """
    # Check if medicine exists
    existing = get_medicine_by_id(medicine_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    # TODO: Replace with actual database update
    # For now, return the updated medicine
    updated_medicine = existing.copy()
    
    if medicine.name is not None:
        updated_medicine["name"] = medicine.name
    if medicine.generic_name is not None:
        updated_medicine["generic_name"] = medicine.generic_name
    if medicine.category is not None:
        updated_medicine["category"] = medicine.category
    if medicine.manufacturer is not None:
        updated_medicine["manufacturer"] = medicine.manufacturer
    if medicine.dosage is not None:
        updated_medicine["dosage"] = medicine.dosage
    if medicine.price is not None:
        updated_medicine["price"] = medicine.price
    if medicine.unit is not None:
        updated_medicine["unit"] = medicine.unit
    
    return updated_medicine


@router.delete("/medicines/{medicine_id}", status_code=204)
def delete_medicine(medicine_id: int):
    """
    Delete a medicine.
    
    NOTE: Currently returns success without actual deletion.
    DATA SCIENTIST: Replace with actual database delete.
    """
    # Check if medicine exists
    existing = get_medicine_by_id(medicine_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    # TODO: Replace with actual database delete
    # For now, just return success
    return None


@router.get("/medicines/category/{category}", response_model=List[MedicineResponse])
def get_medicines_by_category(category: str):
    """
    Get all medicines in a specific category.
    
    - **category**: Medicine category (e.g., "Painkiller", "Antibiotic")
    """
    medicines = get_all_medicines()
    filtered = [m for m in medicines if m["category"] == category]
    
    return filtered


# ==================== INVENTORY ENDPOINTS ====================

@router.get("/inventory", response_model=List[InventoryResponse])
def list_inventory(
    low_stock: Optional[bool] = Query(None, description="Filter low stock items"),
    expiring_days: Optional[int] = Query(None, description="Filter items expiring within N days"),
):
    """
    Get list of all inventory items.
    
    - **low_stock**: If true, return only items below reorder level
    - **expiring_days**: Return items expiring within specified days
    """
    if low_stock:
        inventory = get_low_stock_items()
    elif expiring_days:
        inventory = get_expiring_soon(expiring_days)
    else:
        inventory = get_all_inventory()
    
    return inventory


@router.get("/inventory/low-stock", response_model=List[InventoryResponse])
def get_low_stock():
    """
    Get all items with stock below reorder level.
    These items need to be reordered soon.
    """
    return get_low_stock_items()


@router.get("/inventory/expiring-soon", response_model=List[InventoryResponse])
def get_expiring(days: int = Query(30, description="Days until expiry")):
    """
    Get items expiring within specified days.
    
    - **days**: Number of days (default: 30)
    """
    return get_expiring_soon(days)


@router.get("/inventory/medicine/{medicine_id}", response_model=List[InventoryResponse])
def get_inventory_by_medicine(medicine_id: int):
    """
    Get inventory for a specific medicine.
    
    - **medicine_id**: The medicine ID
    """
    all_inventory = get_all_inventory()
    medicine_inventory = [inv for inv in all_inventory if inv["medicine_id"] == medicine_id]
    
    if not medicine_inventory:
        raise HTTPException(status_code=404, detail="No inventory found for this medicine")
    
    return medicine_inventory


# ==================== CATEGORIES ENDPOINT ====================

@router.get("/categories")
def get_categories():
    """
    Get list of all medicine categories.
    Useful for dropdown filters in frontend.
    """
    medicines = get_all_medicines()
    categories = list(set(m["category"] for m in medicines))
    
    return {
        "categories": sorted(categories),
        "count": len(categories)
    }


# ==================== STATS ENDPOINT ====================

@router.get("/stats")
def get_inventory_stats():
    """
    Get inventory statistics.
    Returns counts and summaries for dashboard.
    """
    all_medicines = get_all_medicines()
    all_inventory = get_all_inventory()
    low_stock = get_low_stock_items()
    expiring = get_expiring_soon(30)
    
    # Calculate total value
    total_value = 0
    for inv in all_inventory:
        med = next((m for m in all_medicines if m["id"] == inv["medicine_id"]), None)
        if med:
            total_value += inv["quantity"] * med["price"]
    
    return {
        "total_medicines": len(all_medicines),
        "total_inventory_items": len(all_inventory),
        "total_value": round(total_value, 2),
        "low_stock_count": len(low_stock),
        "expiring_soon_count": len(expiring),
    }

