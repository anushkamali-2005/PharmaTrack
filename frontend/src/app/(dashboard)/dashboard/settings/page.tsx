'use client';

import { useState } from 'react';
import { Building2, DollarSign, Bell, Users, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
                <p className="text-gray-500 mt-1">
                    Manage suppliers, pricing, and system preferences
                </p>
            </div>

            {/* Supplier Management */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Supplier Management</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add Supplier
                    </button>
                </div>

                <div className="space-y-3">
                    {[
                        { name: 'MediSupply Co.', rating: 5, orders: 150, status: 'active' },
                        { name: 'HealthCare Distributors', rating: 4, orders: 120, status: 'active' },
                        { name: 'PharmaDirect', rating: 5, orders: 200, status: 'active' },
                    ].map((supplier, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{supplier.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Rating: {supplier.rating}/5 • {supplier.orders} orders
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                                    Edit
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic Pricing Configuration */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-green-600">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Dynamic Pricing (FEFO 2.0)</h2>
                        <p className="text-sm text-gray-600">Automatic price adjustments for near-expiry items</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 font-medium mb-2">
                        🤖 DATA SCIENTIST: Configure your dynamic pricing algorithm here
                    </p>
                    <p className="text-xs text-gray-600">
                        Inputs: days_until_expiry, current_stock, demand_forecast
                        <br />
                        Outputs: suggested_price, discount_percentage
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Start (Days Before Expiry)
                        </label>
                        <input
                            type="number"
                            defaultValue="60"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Discount (%)
                        </label>
                        <input
                            type="number"
                            defaultValue="50"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notify Chronic Patients
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Auto-Apply Discounts
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Alert Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Preferences</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Low Stock Alerts</p>
                            <p className="text-sm text-gray-500">Notify when stock falls below reorder level</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Expiry Warnings</p>
                            <p className="text-sm text-gray-500">Alert for medicines expiring within 30 days</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Anomaly Detection</p>
                            <p className="text-sm text-gray-500">Suspicious purchase pattern alerts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* System Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>INR (₹)</option>
                            <option>GBP (£)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Zone
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>UTC-5 (EST)</option>
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+5:30 (IST)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>Hindi</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save All Settings
                </button>
            </div>
        </div>
    );
}
