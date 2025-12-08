"""
Medicine Model - Represents the medicine catalog.
This is the master list of all medicines available in the pharmacy.
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from core.database import Base


class Medicine(Base):
    """
    Medicine catalog model.
    Stores information about each medicine in the pharmacy.
    """
    __tablename__ = "medicines"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic information
    name = Column(String(255), nullable=False, index=True)
    generic_name = Column(String(255))
    category = Column(String(100), nullable=False, index=True)
    
    # Manufacturer details
    manufacturer = Column(String(255))
    
    # Medical information
    dosage = Column(String(100))  # e.g., "500mg", "10ml"
    salt_composition = Column(Text)  # Active ingredients
    description = Column(Text)
    
    # Pricing
    price = Column(Float, nullable=False, default=0.0)
    unit = Column(String(50), default="piece")  # piece, bottle, strip, etc.
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "name": self.name,
            "generic_name": self.generic_name,
            "category": self.category,
            "manufacturer": self.manufacturer,
            "dosage": self.dosage,
            "salt_composition": self.salt_composition,
            "description": self.description,
            "price": float(self.price) if self.price else 0.0,
            "unit": self.unit,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
