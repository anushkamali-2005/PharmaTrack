/**
 * API Client for Smart Pharmacy Backend
 * Connects to FastAPI backend running on port 8000
 */

import axios from 'axios';

// Base URL for API - change this in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// ==================== INVENTORY APIs ====================

export const inventoryApi = {
    // Get all medicines
    getMedicines: async (params?: { category?: string; search?: string }) => {
        const response = await apiClient.get('/inventory/medicines', { params });
        return response.data;
    },

    // Get medicine by ID
    getMedicineById: async (id: number) => {
        const response = await apiClient.get(`/inventory/medicines/${id}`);
        return response.data;
    },

    // Get all inventory
    getInventory: async (params?: { low_stock?: boolean; expiring_days?: number }) => {
        const response = await apiClient.get('/inventory/inventory', { params });
        return response.data;
    },

    // Get low stock items
    getLowStock: async () => {
        const response = await apiClient.get('/inventory/low-stock');
        return response.data;
    },

    // Get expiring items
    getExpiringSoon: async (days: number = 30) => {
        const response = await apiClient.get('/inventory/expiring-soon', { params: { days } });
        return response.data;
    },

    // Get categories
    getCategories: async () => {
        const response = await apiClient.get('/inventory/categories');
        return response.data;
    },

    // Get inventory stats
    getStats: async () => {
        const response = await apiClient.get('/inventory/stats');
        return response.data;
    },

    // Create medicine
    addMedicine: async (medicine: any) => {
        const response = await apiClient.post('/inventory/medicines', medicine);
        return response.data;
    },

    // Update medicine
    updateMedicine: async (id: number, medicine: any) => {
        const response = await apiClient.put(`/inventory/medicines/${id}`, medicine);
        return response.data;
    },

    // Delete medicine
    deleteMedicine: async (id: number) => {
        const response = await apiClient.delete(`/inventory/medicines/${id}`);
        return response.data;
    },
};

// ==================== ANALYTICS APIs ====================

export const analyticsApi = {
    // Get dashboard stats
    getDashboard: async () => {
        const response = await apiClient.get('/analytics/dashboard');
        return response.data;
    },

    // Get sales trends
    getSalesTrends: async (days: number = 30) => {
        const response = await apiClient.get('/analytics/sales-trends', { params: { days } });
        return response.data;
    },

    // Get category distribution
    getCategoryDistribution: async () => {
        const response = await apiClient.get('/analytics/category-distribution');
        return response.data;
    },

    // Get inventory value
    getInventoryValue: async () => {
        const response = await apiClient.get('/analytics/inventory-value');
        return response.data;
    },

    // Get top medicines
    getTopMedicines: async (limit: number = 10) => {
        const response = await apiClient.get('/analytics/top-medicines', { params: { limit } });
        return response.data;
    },

    // Get supplier performance
    getSupplierPerformance: async () => {
        const response = await apiClient.get('/analytics/supplier-performance');
        return response.data;
    },
};

// ==================== ALERTS APIs ====================

export const alertsApi = {
    // Get all alerts
    getAlerts: async (params?: { status?: string; priority?: string; alert_type?: string }) => {
        const response = await apiClient.get('/alerts/', { params });
        return response.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await apiClient.get('/alerts/unread-count');
        return response.data;
    },

    // Get alert stats
    getStats: async () => {
        const response = await apiClient.get('/alerts/stats');
        return response.data;
    },

    // Get alert by ID
    getAlertById: async (id: number) => {
        const response = await apiClient.get(`/alerts/${id}`);
        return response.data;
    },

    // Acknowledge alert
    acknowledgeAlert: async (id: number) => {
        const response = await apiClient.put(`/alerts/${id}/acknowledge`);
        return response.data;
    },

    // Resolve alert
    resolveAlert: async (id: number) => {
        const response = await apiClient.put(`/alerts/${id}/resolve`);
        return response.data;
    },

    // Dismiss alert
    dismissAlert: async (id: number) => {
        const response = await apiClient.delete(`/alerts/${id}`);
        return response.data;
    },

    // Get alert types info
    getAlertTypes: async () => {
        const response = await apiClient.get('/alerts/types/info');
        return response.data;
    },
};

// ==================== SAFETY APIs ====================

export const safetyApi = {
    // Check drug safety
    checkSafety: async (data: { drug_name: string; conditions: string[]; current_medications: string[] }) => {
        const response = await apiClient.post('/safety/check', data);
        return response.data;
    },
    // Search drugs for autocomplete
    searchDrugs: async (query: string) => {
        const response = await apiClient.get('/safety/search-drugs', { params: { q: query } });
        return response.data;
    },
};

// Export axios instance for custom requests
export default apiClient;
