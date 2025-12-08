"""
Initialize database tables.
Run this script once to create all database tables.
"""

from core.database import engine, Base
from models import Medicine, Inventory, Supplier, Alert

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    print("\nTables created:")
    print("  - medicines")
    print("  - inventory")
    print("  - suppliers")
    print("  - alerts")

if __name__ == "__main__":
    init_db()
