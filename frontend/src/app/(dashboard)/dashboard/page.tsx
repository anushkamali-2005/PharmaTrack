'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: analyticsApi.getDashboard,
    });

    if (isLoading) {
        return <div className="text-center py-12">Loading dashboard...</div>;
    }

    const statCards = [
        {
            title: 'Total Medicines',
            value: stats?.total_medicines || 0,
            icon: Package,
            color: 'blue',
            change: '+12 from last week',
        },
        {
            title: 'Inventory Value',
            value: `$${stats?.total_inventory_value?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: 'green',
            change: '+5.2% from last month',
        },
        {
            title: 'Low Stock Items',
            value: stats?.low_stock_items || 0,
            icon: AlertTriangle,
            color: 'yellow',
            change: 'Requires attention',
        },
        {
            title: 'Expiring Soon',
            value: stats?.expiring_soon || 0,
            icon: TrendingUp,
            color: 'red',
            change: 'Within 30 days',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Welcome back! Here's your pharmacy overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add New Medicine
                    </button>
                    <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Upload Excel
                    </button>
                    <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-500">Activity feed coming soon...</p>
            </div>
        </div>
    );
}
