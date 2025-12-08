'use client';

import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '@/lib/api';
import { Bell, AlertTriangle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AlertsPage() {
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    const { data: alerts } = useQuery({
        queryKey: ['alerts', filterStatus, filterPriority],
        queryFn: () => alertsApi.getAlerts({
            status: filterStatus !== 'all' ? filterStatus : undefined,
            priority: filterPriority !== 'all' ? filterPriority : undefined,
        }),
    });

    const { data: alertStats } = useQuery({
        queryKey: ['alert-stats'],
        queryFn: () => alertsApi.getStats(),
    });

    const { data: unreadCount } = useQuery({
        queryKey: ['unread-count'],
        queryFn: () => alertsApi.getUnreadCount(),
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'low_stock': return <Package className="w-5 h-5" />;
            case 'expiry': return <Clock className="w-5 h-5" />;
            case 'anomaly': return <AlertTriangle className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
                    <p className="text-gray-500 mt-1">
                        Real-time alerts for inventory management
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold">
                        {unreadCount?.unread_count || 0} Unread
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{alertStats?.total || 0}</p>
                </div>
                <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <p className="text-sm font-medium text-red-900">Critical</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">{alertStats?.critical || 0}</p>
                </div>
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                    <p className="text-sm font-medium text-orange-900">High</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">{alertStats?.high || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <p className="text-sm font-medium text-yellow-900">Medium</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">{alertStats?.medium || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm font-medium text-blue-900">Low</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{alertStats?.low || 0}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="unread">Unread</option>
                            <option value="acknowledged">Acknowledged</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Priority</label>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Suspicious Behavior Detection Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-red-600">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Suspicious Behavior Detection</h2>
                        <p className="text-sm text-gray-600">AI-powered anomaly detection for unusual purchase patterns</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-800 font-medium mb-2">
                        🤖 DATA SCIENTIST: Integrate your anomaly detection ML model here
                    </p>
                    <p className="text-xs text-gray-600">
                        Expected inputs: customer_id, purchase_history, medicine_type, frequency
                        <br />
                        Expected outputs: anomaly_score, risk_level, recommended_action
                    </p>
                </div>

                <div className="space-y-3">
                    {/* Example suspicious patterns */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Repeated Sleep Medication Purchases</p>
                                <p className="text-sm text-gray-600 mt-1">Customer #1234 - 5 purchases in 7 days</p>
                                <p className="text-xs text-red-600 mt-2">Risk Level: High | Anomaly Score: 0.89</p>
                            </div>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                                Flag for Review
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Unusual Quantity Request</p>
                                <p className="text-sm text-gray-600 mt-1">Paracetamol - 10x normal quantity</p>
                                <p className="text-xs text-orange-600 mt-2">Risk Level: Medium | Anomaly Score: 0.67</p>
                            </div>
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                                Verify Prescription
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">All Alerts</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {alerts && alerts.length > 0 ? (
                        alerts.map((alert: any) => (
                            <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                                        {getAlertIcon(alert.alert_type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(alert.priority)}`}>
                                                        {alert.priority.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(alert.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {alert.status === 'unread' && (
                                                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                                        Acknowledge
                                                    </button>
                                                )}
                                                {alert.status === 'acknowledged' && (
                                                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                                        Resolve
                                                    </button>
                                                )}
                                                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No alerts found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Missing import
function Package({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}
