'use client';

import { useState } from 'react';
import { Camera, Upload, Eye, Scan, CheckCircle, XCircle } from 'lucide-react';

export default function ComputerVisionPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                // Simulate analysis
                setTimeout(() => {
                    setAnalyzing(false);
                    setResults({
                        detected_items: 12,
                        low_stock: 3,
                        expiring_soon: 2,
                        misplaced: 1,
                    });
                }, 2000);
                setAnalyzing(true);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Computer Vision Analytics</h1>
                <p className="text-gray-500 mt-1">
                    AI-powered visual analysis for pharmacy operations
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                    <div className="p-3 rounded-full bg-blue-600 w-fit mb-4">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Shelf Monitoring</h3>
                    <p className="text-sm text-gray-600">
                        Real-time detection of stock levels, misplaced items, and shelf organization
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
                    <div className="p-3 rounded-full bg-purple-600 w-fit mb-4">
                        <Scan className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pill Identification</h3>
                    <p className="text-sm text-gray-600">
                        Identify pills by shape, color, size, and imprint code. Detect counterfeits
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
                    <div className="p-3 rounded-full bg-green-600 w-fit mb-4">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expiry Detection</h3>
                    <p className="text-sm text-gray-600">
                        OCR-based expiry date reading from medicine packages and labels
                    </p>
                </div>
            </div>

            {/* Main Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Image for Analysis</h2>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800 font-medium mb-2">
                            🤖 DATA SCIENTIST: Integrate your CV models here
                        </p>
                        <p className="text-xs text-gray-600">
                            Models needed:
                            <br />• YOLOv10 for shelf monitoring
                            <br />• TrOCR for expiry date OCR
                            <br />• Custom CNN for pill identification
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        {!selectedImage ? (
                            <div>
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-2">Upload pharmacy shelf or pill image</p>
                                <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB</p>
                                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div>
                                <img
                                    src={selectedImage}
                                    alt="Uploaded"
                                    className="max-h-64 mx-auto rounded-lg mb-4"
                                />
                                <button
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setResults(null);
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Clear Image
                                </button>
                            </div>
                        )}
                    </div>

                    {analyzing && (
                        <div className="mt-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Analyzing image...</p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>

                    {!results ? (
                        <div className="text-center py-12 text-gray-500">
                            <Eye className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>Upload an image to see analysis results</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-blue-900">Items Detected</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">{results.detected_items}</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-red-900">Low Stock</p>
                                    <p className="text-2xl font-bold text-red-600 mt-2">{results.low_stock}</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-orange-900">Expiring Soon</p>
                                    <p className="text-2xl font-bold text-orange-600 mt-2">{results.expiring_soon}</p>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-yellow-900">Misplaced</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-2">{results.misplaced}</p>
                                </div>
                            </div>

                            {/* Detailed Results */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Detected Items</h3>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Paracetamol 500mg', confidence: 0.98, status: 'good' },
                                        { name: 'Ibuprofen 400mg', confidence: 0.95, status: 'low' },
                                        { name: 'Amoxicillin 250mg', confidence: 0.92, status: 'expiring' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">Confidence: {(item.confidence * 100).toFixed(0)}%</p>
                                            </div>
                                            <div>
                                                {item.status === 'good' && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                        ✓ Good
                                                    </span>
                                                )}
                                                {item.status === 'low' && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                        ⚠ Low Stock
                                                    </span>
                                                )}
                                                {item.status === 'expiring' && (
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                                        ⏰ Expiring
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Pill Identification Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-purple-600">
                        <Scan className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Pill Identification & Verification</h2>
                        <p className="text-sm text-gray-600">Identify pills and detect counterfeits using AI</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Pill Characteristics</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shape:</span>
                                <span className="font-medium">Round</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Color:</span>
                                <span className="font-medium">White</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <span className="font-medium">8mm diameter</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Imprint:</span>
                                <span className="font-medium">P500</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Verification Result</h3>
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-900">Authentic Medicine</p>
                                <p className="text-sm text-gray-600">Paracetamol 500mg</p>
                            </div>
                        </div>
                        <div className="text-sm space-y-1">
                            <p className="text-gray-600">Manufacturer: ABC Pharma</p>
                            <p className="text-gray-600">Batch: BATCH-2024-0123</p>
                            <p className="text-gray-600">Confidence: 97.8%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-time Analytics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-time Shelf Analytics</h2>
                <p className="text-sm text-blue-600 mb-4">
                    📊 DATA SCIENTIST: Connect live camera feed for continuous monitoring
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Total Shelves</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Well Stocked</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">18</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-900">Needs Restocking</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">4</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-900">Empty Shelves</p>
                        <p className="text-2xl font-bold text-red-600 mt-2">2</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
