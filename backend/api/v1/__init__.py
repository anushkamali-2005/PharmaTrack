"""
API v1 package initialization.
Exports all API routers.
"""

from api.v1 import inventory, analytics, alerts

__all__ = ["inventory", "analytics", "alerts"]
