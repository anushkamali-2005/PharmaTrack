'use client';

import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ExcelUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any[]) => void;
}

export default function ExcelUploadModal({ isOpen, onClose, onSuccess }: ExcelUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>('');
    const [preview, setPreview] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
        ];

        if (!validTypes.includes(selectedFile.type)) {
            setError('Please upload a valid Excel (.xlsx, .xls) or CSV file');
            return;
        }

        // Validate file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setFile(selectedFile);
        setError('');

        // TODO: Parse file and show preview
        // For now, show mock preview
        setPreview([
            { name: 'Paracetamol', category: 'Painkiller', price: 5.99, quantity: 100 },
            { name: 'Ibuprofen', category: 'Painkiller', price: 7.50, quantity: 75 },
            { name: 'Amoxicillin', category: 'Antibiotic', price: 12.99, quantity: 50 },
        ]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            // Simulate file input change
            const fakeEvent = {
                target: { files: [droppedFile] },
            } as any;
            handleFileSelect(fakeEvent);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            // TODO: Replace with actual API call
            // const formData = new FormData();
            // formData.append('file', file);
            // await inventoryApi.uploadExcel(formData);

            // Simulate upload
            await new Promise((resolve) => setTimeout(resolve, 2000));

            onSuccess(preview);
            handleClose();
        } catch (err) {
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview([]);
        setError('');
        setUploading(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Upload Excel File" size="lg">
            <div className="space-y-4">
                {/* Upload Area */}
                {!file ? (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                            Drag and drop your Excel file here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports .xlsx, .xls, .csv (max 5MB)
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPreview([]);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Preview */}
                        {preview.length > 0 && (
                            <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="font-medium text-gray-900">
                                        Preview ({preview.length} items)
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-600">
                                                <th className="pb-2">Name</th>
                                                <th className="pb-2">Category</th>
                                                <th className="pb-2">Price</th>
                                                <th className="pb-2">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.map((item, idx) => (
                                                <tr key={idx} className="border-t border-gray-200">
                                                    <td className="py-2">{item.name}</td>
                                                    <td className="py-2">{item.category}</td>
                                                    <td className="py-2">${item.price}</td>
                                                    <td className="py-2">{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                        📋 Excel File Format:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Column 1: Medicine Name (required)</li>
                        <li>• Column 2: Category (required)</li>
                        <li>• Column 3: Price (required)</li>
                        <li>• Column 4: Quantity (required)</li>
                        <li>• Column 5: Dosage (optional)</li>
                        <li>• Column 6: Manufacturer (optional)</li>
                    </ul>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={uploading}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload File
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
