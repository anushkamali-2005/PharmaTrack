"""
Inventory Model - Tracks stock levels and batch information.
This model tracks how much of each medicine is in stock.
"""

from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base


class Inventory(Base):
    """
    Inventory tracking model.
    Tracks stock levels, batch numbers, and expiry dates.
    """
    __tablename__ = "inventory"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to medicine
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False, index=True)
    
    # Stock information
    quantity = Column(Integer, nullable=False, default=0)
    reorder_level = Column(Integer, default=10)  # Alert when stock below this
    
    # Batch tracking
    batch_number = Column(String(100))
    expiry_date = Column(Date)
    
    # Location
    shelf_location = Column(String(50))  # e.g., "A-12", "B-05"
    
    # Supplier information
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    medicine = relationship("Medicine", backref="inventory_items")
    supplier = relationship("Supplier", backref="inventory_items")

    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "medicine_id": self.medicine_id,
            "quantity": self.quantity,
            "reorder_level": self.reorder_level,
            "batch_number": self.batch_number,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "shelf_location": self.shelf_location,
            "supplier_id": self.supplier_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
    
    @property
    def is_low_stock(self):
        """Check if stock is below reorder level"""
        return self.quantity < self.reorder_level
    
    @property
    def days_until_expiry(self):
        """Calculate days until expiry"""
        if not self.expiry_date:
            return None
        from datetime import date
        delta = self.expiry_date - date.today()
        return delta.days
