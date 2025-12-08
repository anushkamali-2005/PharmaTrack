"""
Supplier Model - Stores supplier/vendor information.
This model tracks all suppliers that provide medicines to the pharmacy.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from core.database import Base


class Supplier(Base):
    """
    Supplier/Vendor model.
    Stores information about medicine suppliers.
    """
    __tablename__ = "suppliers"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic information
    name = Column(String(255), nullable=False, index=True)
    company_name = Column(String(255))
    
    # Contact information
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    
    # Business details
    gst_number = Column(String(50))  # Tax ID
    license_number = Column(String(100))
    
    # Performance tracking (will be updated by Data Scientist's analytics)
    rating = Column(Integer, default=5)  # 1-5 stars
    total_orders = Column(Integer, default=0)
    
    # Status
    is_active = Column(Integer, default=1)  # 1 = active, 0 = inactive
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "name": self.name,
            "company_name": self.company_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "gst_number": self.gst_number,
            "license_number": self.license_number,
            "rating": self.rating,
            "total_orders": self.total_orders,
            "is_active": bool(self.is_active),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
