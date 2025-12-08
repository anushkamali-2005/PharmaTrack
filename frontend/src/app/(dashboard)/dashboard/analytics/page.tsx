'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { TrendingUp, TrendingDown, Package, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
    const { data: dashboardStats } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => analyticsApi.getDashboard(),
    });

    const { data: salesTrends } = useQuery({
        queryKey: ['sales-trends'],
        queryFn: () => analyticsApi.getSalesTrends(30),
    });

    const { data: categoryDist } = useQuery({
        queryKey: ['category-distribution'],
        queryFn: () => analyticsApi.getCategoryDistribution(),
    });

    const { data: topMedicines } = useQuery({
        queryKey: ['top-medicines'],
        queryFn: () => analyticsApi.getTopMedicines(5),
    });

    // Colors for charts
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Forecasting</h1>
                <p className="text-gray-500 mt-1">
                    AI-powered insights and demand predictions
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {dashboardStats?.total_medicines || 0}
                            </p>
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +12% from last month
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-50">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                ${dashboardStats?.total_inventory_value?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +5.2% from last month
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-50">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {dashboardStats?.low_stock_items || 0}
                            </p>
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Requires attention
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-50">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {dashboardStats?.expiring_soon || 0}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">Within 30 days</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-50">
                            <Activity className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trends Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Sales Trends (30 Days)</h2>
                        <p className="text-sm text-gray-500">Daily sales and revenue patterns</p>
                        <p className="text-xs text-blue-600 mt-1">
                            📊 DATA SCIENTIST: Replace with real sales data from database
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesTrends || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} name="Sales" />
                            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue ($)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Medicine Categories</h2>
                        <p className="text-sm text-gray-500">Distribution by category</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryDist || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ category, count }: any) => `${category}: ${count}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {(categoryDist || []).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Demand Forecasting Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-blue-600">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">AI Demand Forecasting</h2>
                        <p className="text-sm text-gray-600">Predictive analytics for inventory planning</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                        🤖 DATA SCIENTIST: Integrate your ML forecasting model here
                    </p>
                    <p className="text-xs text-gray-600">
                        Expected inputs: medicine_id, historical_sales, seasonality_factors
                        <br />
                        Expected outputs: predicted_demand, confidence_interval, reorder_date
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600">Predicted Demand (Next 30 Days)</p>
                        <p className="text-2xl font-bold text-blue-600 mt-2">2,450 units</p>
                        <p className="text-xs text-gray-500 mt-1">Confidence: 87%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600">Recommended Reorder</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">1,800 units</p>
                        <p className="text-xs text-gray-500 mt-1">Optimal timing: 5 days</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600">Potential Savings</p>
                        <p className="text-2xl font-bold text-purple-600 mt-2">$3,240</p>
                        <p className="text-xs text-gray-500 mt-1">vs. traditional ordering</p>
                    </div>
                </div>
            </div>

            {/* Top Medicines */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Top Medicines by Value</h2>
                    <p className="text-sm text-gray-500">Highest inventory value items</p>
                </div>
                <div className="space-y-3">
                    {topMedicines?.top_medicines?.map((med: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                    {idx + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{med.name}</p>
                                    <p className="text-sm text-gray-500">{med.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">${med.total_value?.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">{med.total_quantity} units</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Waste Analytics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Waste Analytics</h2>
                    <p className="text-sm text-gray-500">Track expired, damaged, and recalled stock</p>
                    <p className="text-xs text-blue-600 mt-1">
                        📊 DATA SCIENTIST: Add waste tracking and analytics here
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-900">Expired Items</p>
                        <p className="text-2xl font-bold text-red-600 mt-2">23</p>
                        <p className="text-xs text-red-700 mt-1">$1,240 loss</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium text-orange-900">Damaged Stock</p>
                        <p className="text-2xl font-bold text-orange-600 mt-2">8</p>
                        <p className="text-xs text-orange-700 mt-1">$420 loss</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-900">Recalled Items</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">2</p>
                        <p className="text-xs text-yellow-700 mt-1">$180 loss</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Waste Reduction</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">-15%</p>
                        <p className="text-xs text-green-700 mt-1">vs. last month</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
