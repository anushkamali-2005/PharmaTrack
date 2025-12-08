"""
Mock Data Service - Generate fake data for development and testing.

🎯 IMPORTANT FOR DATA SCIENTIST:
This file provides mock data for development. When you're ready to integrate:
1. Create a new file: backend/services/real_data.py
2. Copy the function signatures from this file
3. Replace mock data with actual database queries
4. Update imports in API endpoints from mock_data to real_data

No other changes needed! The API endpoints will work with both mock and real data.
"""

from datetime import date, datetime, timedelta
import random


class MockDataService:
    """
    Mock data generator for development.
    Provides realistic fake data for all models.
    """
    
    def __init__(self):
        """Initialize with sample data"""
        self.medicines = self._generate_medicines()
        self.inventory = self._generate_inventory()
        self.suppliers = self._generate_suppliers()
        self.alerts = self._generate_alerts()
    
    # ==================== MEDICINES ====================
    
    def _generate_medicines(self):
        """Generate sample medicines"""
        categories = ["Painkiller", "Antibiotic", "Vitamin", "Antacid", "Antiseptic", "Diabetes", "Blood Pressure"]
        medicines = []
        
        sample_data = [
            ("Paracetamol", "Acetaminophen", "Painkiller", "ABC Pharma", "500mg", 10.0),
            ("Ibuprofen", "Ibuprofen", "Painkiller", "XYZ Labs", "400mg", 15.0),
            ("Amoxicillin", "Amoxicillin", "Antibiotic", "MediCure", "250mg", 50.0),
            ("Vitamin C", "Ascorbic Acid", "Vitamin", "HealthPlus", "1000mg", 8.0),
            ("Omeprazole", "Omeprazole", "Antacid", "GastroMed", "20mg", 25.0),
            ("Aspirin", "Acetylsalicylic Acid", "Painkiller", "CardioHealth", "75mg", 5.0),
            ("Metformin", "Metformin HCl", "Diabetes", "DiabCare", "500mg", 12.0),
            ("Amlodipine", "Amlodipine Besylate", "Blood Pressure", "HeartGuard", "5mg", 18.0),
            ("Ciprofloxacin", "Ciprofloxacin", "Antibiotic", "InfectCure", "500mg", 45.0),
            ("Vitamin D3", "Cholecalciferol", "Vitamin", "BoneStrong", "2000IU", 20.0),
        ]
        
        for i, (name, generic, category, manufacturer, dosage, price) in enumerate(sample_data, 1):
            medicines.append({
                "id": i,
                "name": name,
                "generic_name": generic,
                "category": category,
                "manufacturer": manufacturer,
                "dosage": dosage,
                "salt_composition": generic,
                "description": f"{name} is used for treating various conditions.",
                "price": price,
                "unit": "strip",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            })
        
        return medicines
    
    def get_all_medicines(self):
        """Get all medicines"""
        return self.medicines
    
    def get_medicine_by_id(self, medicine_id: int):
        """Get medicine by ID"""
        for med in self.medicines:
            if med["id"] == medicine_id:
                return med
        return None
    
    def get_medicines_by_category(self, category: str):
        """Get medicines by category"""
        return [m for m in self.medicines if m["category"] == category]
    
    def search_medicines(self, query: str):
        """Search medicines by name"""
        query = query.lower()
        return [m for m in self.medicines if query in m["name"].lower()]
    
    # ==================== INVENTORY ====================
    
    def _generate_inventory(self):
        """Generate sample inventory"""
        inventory = []
        
        for i, med in enumerate(self.medicines, 1):
            # Random quantity between 10 and 200
            quantity = random.randint(10, 200)
            reorder_level = 20
            
            # Random expiry date (30 to 365 days from now)
            days_until_expiry = random.randint(30, 365)
            expiry_date = (date.today() + timedelta(days=days_until_expiry)).isoformat()
            
            inventory.append({
                "id": i,
                "medicine_id": med["id"],
                "medicine_name": med["name"],  # Denormalized for easy access
                "quantity": quantity,
                "reorder_level": reorder_level,
                "batch_number": f"BATCH-{2024}-{i:04d}",
                "expiry_date": expiry_date,
                "shelf_location": f"{chr(65 + (i % 5))}-{i:02d}",  # A-01, B-02, etc.
                "supplier_id": (i % 3) + 1,  # Rotate through 3 suppliers
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            })
        
        return inventory
    
    def get_all_inventory(self):
        """Get all inventory items"""
        return self.inventory
    
    def get_inventory_by_medicine_id(self, medicine_id: int):
        """Get inventory for specific medicine"""
        return [inv for inv in self.inventory if inv["medicine_id"] == medicine_id]
    
    def get_low_stock_items(self, threshold: int = None):
        """Get items with low stock"""
        return [inv for inv in self.inventory if inv["quantity"] < inv["reorder_level"]]
    
    def get_expiring_soon(self, days: int = 30):
        """Get items expiring within specified days"""
        cutoff_date = date.today() + timedelta(days=days)
        expiring = []
        
        for inv in self.inventory:
            expiry = date.fromisoformat(inv["expiry_date"])
            if expiry <= cutoff_date:
                expiring.append(inv)
        
        return expiring
    
    # ==================== SUPPLIERS ====================
    
    def _generate_suppliers(self):
        """Generate sample suppliers"""
        return [
            {
                "id": 1,
                "name": "MediSupply Co.",
                "company_name": "MediSupply Corporation",
                "email": "contact@medisupply.com",
                "phone": "+91-9876543210",
                "address": "123 Pharma Street, Mumbai, Maharashtra 400001",
                "gst_number": "27AABCU9603R1ZM",
                "license_number": "MH-DL-2024-001",
                "rating": 5,
                "total_orders": 150,
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            },
            {
                "id": 2,
                "name": "HealthCare Distributors",
                "company_name": "HealthCare Distributors Pvt Ltd",
                "email": "info@healthcare-dist.com",
                "phone": "+91-9876543211",
                "address": "456 Medical Avenue, Delhi 110001",
                "gst_number": "07AABCU9603R1ZN",
                "license_number": "DL-DL-2024-002",
                "rating": 4,
                "total_orders": 120,
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            },
            {
                "id": 3,
                "name": "PharmaDirect",
                "company_name": "PharmaDirect Solutions",
                "email": "sales@pharmadirect.com",
                "phone": "+91-9876543212",
                "address": "789 Drug Lane, Bangalore, Karnataka 560001",
                "gst_number": "29AABCU9603R1ZO",
                "license_number": "KA-DL-2024-003",
                "rating": 5,
                "total_orders": 200,
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            },
        ]
    
    def get_all_suppliers(self):
        """Get all suppliers"""
        return self.suppliers
    
    def get_supplier_by_id(self, supplier_id: int):
        """Get supplier by ID"""
        for sup in self.suppliers:
            if sup["id"] == supplier_id:
                return sup
        return None
    
    # ==================== ALERTS ====================
    
    def _generate_alerts(self):
        """Generate sample alerts"""
        alerts = []
        
        # Low stock alerts
        low_stock = self.get_low_stock_items()
        for i, item in enumerate(low_stock[:5], 1):  # First 5 low stock items
            alerts.append({
                "id": i,
                "alert_type": "low_stock",
                "priority": "high",
                "title": f"Low Stock: {item['medicine_name']}",
                "message": f"Stock level ({item['quantity']}) is below reorder level ({item['reorder_level']}). Please reorder soon.",
                "medicine_id": item["medicine_id"],
                "inventory_id": item["id"],
                "status": "unread",
                "created_at": datetime.now().isoformat(),
                "acknowledged_at": None,
                "resolved_at": None,
            })
        
        # Expiry alerts
        expiring = self.get_expiring_soon(30)
        for i, item in enumerate(expiring[:3], len(alerts) + 1):  # First 3 expiring items
            days_left = (date.fromisoformat(item["expiry_date"]) - date.today()).days
            priority = "critical" if days_left < 7 else "high"
            
            alerts.append({
                "id": i,
                "alert_type": "expiry",
                "priority": priority,
                "title": f"Expiring Soon: {item['medicine_name']}",
                "message": f"Batch {item['batch_number']} expires in {days_left} days.",
                "medicine_id": item["medicine_id"],
                "inventory_id": item["id"],
                "status": "unread",
                "created_at": datetime.now().isoformat(),
                "acknowledged_at": None,
                "resolved_at": None,
            })
        
        return alerts
    
    def get_all_alerts(self):
        """Get all alerts"""
        return self.alerts
    
    def get_alerts_by_status(self, status: str):
        """Get alerts by status"""
        return [a for a in self.alerts if a["status"] == status]
    
    def get_unread_count(self):
        """Get count of unread alerts"""
        return len([a for a in self.alerts if a["status"] == "unread"])
    
    # ==================== ANALYTICS (Mock) ====================
    
    def get_dashboard_stats(self):
        """Get dashboard statistics"""
        total_medicines = len(self.medicines)
        total_inventory_value = sum(
            inv["quantity"] * next(m["price"] for m in self.medicines if m["id"] == inv["medicine_id"])
            for inv in self.inventory
        )
        low_stock_count = len(self.get_low_stock_items())
        expiring_count = len(self.get_expiring_soon(30))
        
        return {
            "total_medicines": total_medicines,
            "total_inventory_value": round(total_inventory_value, 2),
            "low_stock_items": low_stock_count,
            "expiring_soon": expiring_count,
        }
    
    def get_sales_trends(self, days: int = 30):
        """Get mock sales trends (Data Scientist will replace with real data)"""
        trends = []
        for i in range(days):
            day = date.today() - timedelta(days=days - i - 1)
            trends.append({
                "date": day.isoformat(),
                "sales": random.randint(50, 150),
                "revenue": random.randint(5000, 15000),
            })
        return trends
    
    def get_category_distribution(self):
        """Get medicine distribution by category"""
        categories = {}
        for med in self.medicines:
            cat = med["category"]
            categories[cat] = categories.get(cat, 0) + 1
        
        return [{"category": k, "count": v} for k, v in categories.items()]


# Create singleton instance
mock_data = MockDataService()


# ==================== EASY-TO-USE FUNCTIONS ====================
# These are what your API endpoints will call

def get_all_medicines():
    """Get all medicines - API endpoint will call this"""
    return mock_data.get_all_medicines()

def get_medicine_by_id(medicine_id: int):
    """Get medicine by ID"""
    return mock_data.get_medicine_by_id(medicine_id)

def search_medicines(query: str):
    """Search medicines"""
    return mock_data.search_medicines(query)

def get_all_inventory():
    """Get all inventory"""
    return mock_data.get_all_inventory()

def get_low_stock_items():
    """Get low stock items"""
    return mock_data.get_low_stock_items()

def get_expiring_soon(days: int = 30):
    """Get expiring items"""
    return mock_data.get_expiring_soon(days)

def get_all_suppliers():
    """Get all suppliers"""
    return mock_data.get_all_suppliers()

def get_all_alerts():
    """Get all alerts"""
    return mock_data.get_all_alerts()

def get_unread_alerts_count():
    """Get unread alerts count"""
    return mock_data.get_unread_count()

def get_dashboard_stats():
    """Get dashboard statistics"""
    return mock_data.get_dashboard_stats()

def get_sales_trends(days: int = 30):
    """Get sales trends"""
    return mock_data.get_sales_trends(days)

def get_category_distribution():
    """Get category distribution"""
    return mock_data.get_category_distribution()
