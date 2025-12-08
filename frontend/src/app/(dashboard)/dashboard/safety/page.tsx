'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, Search } from 'lucide-react';

export default function MedicineSafetyPage() {
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [existingMeds, setExistingMeds] = useState('');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Medicine Safety Engine</h1>
                <p className="text-gray-500 mt-1">
                    AI-powered drug interactions, dosage recommendations, and safety checks
                </p>
            </div>

            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
                    <div className="p-3 rounded-full bg-green-600 w-fit mb-4">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drug Interactions</h3>
                    <p className="text-sm text-gray-600">
                        Check compatibility between multiple medications
                    </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                    <div className="p-3 rounded-full bg-blue-600 w-fit mb-4">
                        <Info className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dosage Calculator</h3>
                    <p className="text-sm text-gray-600">
                        Age and condition-based dosage recommendations
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
                    <div className="p-3 rounded-full bg-purple-600 w-fit mb-4">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">ADR Warnings</h3>
                    <p className="text-sm text-gray-600">
                        Adverse drug reaction alerts and side effects
                    </p>
                </div>
            </div>

            {/* Integration Note */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                    🤖 DATA SCIENTIST: Integrate your ML models here
                </p>
                <p className="text-xs text-gray-600">
                    Models needed:
                    <br />• GNN-based drug interaction predictor
                    <br />• RAG system for medical literature search
                    <br />• Neuro-symbolic reasoning engine
                </p>
            </div>

            {/* Drug Interaction Checker */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Drug Interaction Checker</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Medicine
                        </label>
                        <input
                            type="text"
                            value={selectedMedicine}
                            onChange={(e) => setSelectedMedicine(e.target.value)}
                            placeholder="Enter medicine name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Existing Medications
                        </label>
                        <input
                            type="text"
                            value={existingMeds}
                            onChange={(e) => setExistingMeds(e.target.value)}
                            placeholder="Comma-separated list..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6">
                    Check Interactions
                </button>

                {/* Sample Results */}
                <div className="space-y-3">
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-900">Safe Combination</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Paracetamol + Ibuprofen - No known interactions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-yellow-900">Moderate Interaction</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Aspirin + Ibuprofen - May increase bleeding risk. Monitor closely.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-900">Severe Interaction</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Warfarin + Aspirin - Contraindicated. Seek alternative.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dosage Calculator */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dosage Calculator</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Patient Age
                        </label>
                        <input
                            type="number"
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            placeholder="Years"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            placeholder="Weight"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Select condition</option>
                            <option>Fever</option>
                            <option>Pain</option>
                            <option>Infection</option>
                        </select>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Recommended Dosage</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">500mg every 6 hours</p>
                    <p className="text-sm text-gray-600">
                        Maximum daily dose: 2000mg | Duration: 3-5 days
                    </p>
                </div>
            </div>

            {/* RAG-Powered Safety Search */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-purple-600">
                        <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">RAG-Powered Safety Search</h2>
                        <p className="text-sm text-gray-600">Search medical literature for rare side effects and alternatives</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-800 font-medium mb-2">
                        🤖 AGENTIC AI DEV: Integrate RAG system here
                    </p>
                    <p className="text-xs text-gray-600">
                        Connect to medical databases, FDA warnings, and research papers
                    </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                    <input
                        type="text"
                        placeholder="Search for drug information, side effects, alternatives..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                    />

                    <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">Recent FDA Warning</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Increased cardiovascular risk with long-term NSAID use
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Source: FDA Safety Alert 2024</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">Alternative Recommendation</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Consider acetaminophen as safer alternative for chronic pain
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Source: Clinical Guidelines 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
