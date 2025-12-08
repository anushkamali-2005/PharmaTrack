// TypeScript type definitions for the Smart Pharmacy System

export interface Medicine {
    id: number;
    name: string;
    generic_name?: string;
    category: string;
    manufacturer?: string;
    dosage?: string;
    salt_composition?: string;
    description?: string;
    price: number;
    unit: string;
    created_at?: string;
    updated_at?: string;
}

export interface Inventory {
    id: number;
    medicine_id: number;
    medicine_name?: string;
    quantity: number;
    reorder_level: number;
    batch_number?: string;
    expiry_date?: string;
    shelf_location?: string;
    supplier_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Supplier {
    id: number;
    name: string;
    company_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    gst_number?: string;
    license_number?: string;
    rating: number;
    total_orders: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Alert {
    id: number;
    alert_type: 'low_stock' | 'expiry' | 'anomaly' | 'forecast' | 'system';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    message: string;
    medicine_id?: number;
    inventory_id?: number;
    status: 'unread' | 'acknowledged' | 'resolved';
    created_at: string;
    acknowledged_at?: string;
    resolved_at?: string;
}

export interface DashboardStats {
    total_medicines: number;
    total_inventory_value: number;
    low_stock_items: number;
    expiring_soon: number;
}

export interface SalesTrend {
    date: string;
    sales: number;
    revenue: number;
}

export interface CategoryDistribution {
    category: string;
    count: number;
}

export interface AlertStats {
    total: number;
    unread: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
}
