"""
Alerts API Endpoints
Manages system alerts and notifications.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from services.mock_data import (
    get_all_alerts,
    get_unread_alerts_count,
)

router = APIRouter()


# ==================== PYDANTIC SCHEMAS ====================

class AlertResponse(BaseModel):
    """Alert response schema"""
    id: int
    alert_type: str
    priority: str
    title: str
    message: str
    medicine_id: Optional[int]
    inventory_id: Optional[int]
    status: str
    created_at: str
    acknowledged_at: Optional[str]
    resolved_at: Optional[str]


class AlertStats(BaseModel):
    """Alert statistics"""
    total: int
    unread: int
    critical: int
    high: int
    medium: int
    low: int


# ==================== ALERT ENDPOINTS ====================

@router.get("/", response_model=List[AlertResponse])
def list_alerts(
    status: Optional[str] = Query(None, description="Filter by status (unread/acknowledged/resolved)"),
    priority: Optional[str] = Query(None, description="Filter by priority (critical/high/medium/low)"),
    alert_type: Optional[str] = Query(None, description="Filter by type (low_stock/expiry/anomaly)"),
):
    """
    Get list of all alerts.
    
    - **status**: Filter by alert status (optional)
    - **priority**: Filter by priority level (optional)
    - **alert_type**: Filter by alert type (optional)
    """
    alerts = get_all_alerts()
    
    # Apply filters
    if status:
        alerts = [a for a in alerts if a["status"] == status]
    
    if priority:
        alerts = [a for a in alerts if a["priority"] == priority]
    
    if alert_type:
        alerts = [a for a in alerts if a["alert_type"] == alert_type]
    
    return alerts


@router.get("/unread-count")
def get_unread_count():
    """
    Get count of unread alerts.
    Used for notification badge in UI.
    """
    count = get_unread_alerts_count()
    
    return {
        "unread_count": count
    }


@router.get("/stats", response_model=AlertStats)
def get_alert_stats():
    """
    Get alert statistics.
    Returns counts by status and priority.
    """
    alerts = get_all_alerts()
    
    stats = {
        "total": len(alerts),
        "unread": len([a for a in alerts if a["status"] == "unread"]),
        "critical": len([a for a in alerts if a["priority"] == "critical"]),
        "high": len([a for a in alerts if a["priority"] == "high"]),
        "medium": len([a for a in alerts if a["priority"] == "medium"]),
        "low": len([a for a in alerts if a["priority"] == "low"]),
    }
    
    return stats


@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: int):
    """
    Get specific alert by ID.
    
    - **alert_id**: The alert ID
    """
    alerts = get_all_alerts()
    alert = next((a for a in alerts if a["id"] == alert_id), None)
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return alert


@router.put("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int):
    """
    Mark alert as acknowledged.
    
    - **alert_id**: The alert ID to acknowledge
    
    Note: In production, this will update the database.
    For now, it returns success message.
    """
    alerts = get_all_alerts()
    alert = next((a for a in alerts if a["id"] == alert_id), None)
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # In production, update database here
    # For now, just return success
    
    return {
        "message": "Alert acknowledged successfully",
        "alert_id": alert_id,
        "status": "acknowledged"
    }


@router.put("/{alert_id}/resolve")
def resolve_alert(alert_id: int):
    """
    Mark alert as resolved.
    
    - **alert_id**: The alert ID to resolve
    """
    alerts = get_all_alerts()
    alert = next((a for a in alerts if a["id"] == alert_id), None)
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {
        "message": "Alert resolved successfully",
        "alert_id": alert_id,
        "status": "resolved"
    }


@router.delete("/{alert_id}")
def dismiss_alert(alert_id: int):
    """
    Dismiss/delete an alert.
    
    - **alert_id**: The alert ID to dismiss
    """
    alerts = get_all_alerts()
    alert = next((a for a in alerts if a["id"] == alert_id), None)
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {
        "message": "Alert dismissed successfully",
        "alert_id": alert_id
    }


# ==================== ALERT TYPES INFO ====================

@router.get("/types/info")
def get_alert_types():
    """
    Get information about available alert types.
    Useful for frontend filters and documentation.
    """
    return {
        "alert_types": [
            {
                "type": "low_stock",
                "label": "Low Stock",
                "description": "Items below reorder level",
                "icon": "📦"
            },
            {
                "type": "expiry",
                "label": "Expiring Soon",
                "description": "Items nearing expiry date",
                "icon": "⏰"
            },
            {
                "type": "anomaly",
                "label": "Anomaly Detected",
                "description": "Unusual patterns detected by ML",
                "icon": "⚠️"
            },
            {
                "type": "forecast",
                "label": "Forecast Alert",
                "description": "Predicted stock shortage",
                "icon": "📊"
            },
            {
                "type": "system",
                "label": "System Alert",
                "description": "System notifications",
                "icon": "🔔"
            },
        ],
        "priority_levels": [
            {"level": "critical", "color": "red"},
            {"level": "high", "color": "orange"},
            {"level": "medium", "color": "yellow"},
            {"level": "low", "color": "blue"},
        ]
    }
