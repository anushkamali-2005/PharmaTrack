"""
Models package initialization.
Exports all database models for easy importing.
"""

from models.medicine import Medicine
from models.inventory import Inventory
from models.supplier import Supplier
from models.alert import Alert

# Export all models
__all__ = [
    "Medicine",
    "Inventory",
    "Supplier",
    "Alert",
]
