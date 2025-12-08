'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Medicine } from '@/types';

interface AddMedicineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (medicine: Partial<Medicine>) => void;
}

export default function AddMedicineModal({ isOpen, onClose, onSuccess }: AddMedicineModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        generic_name: '',
        category: '',
        manufacturer: '',
        dosage: '',
        price: '',
        unit: 'strip',
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Medicine name is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const medicine: Partial<Medicine> = {
            name: formData.name,
            generic_name: formData.generic_name || undefined,
            category: formData.category,
            manufacturer: formData.manufacturer || undefined,
            dosage: formData.dosage || undefined,
            price: parseFloat(formData.price),
            unit: formData.unit,
            description: formData.description || undefined,
        };

        onSuccess(medicine);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            generic_name: '',
            category: '',
            manufacturer: '',
            dosage: '',
            price: '',
            unit: 'strip',
            description: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add New Medicine" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medicine Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medicine Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="e.g., Paracetamol"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Generic Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Generic Name
                        </label>
                        <input
                            type="text"
                            value={formData.generic_name}
                            onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Acetaminophen"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select category</option>
                            <option value="Painkiller">Painkiller</option>
                            <option value="Antibiotic">Antibiotic</option>
                            <option value="Vitamin">Vitamin</option>
                            <option value="Antacid">Antacid</option>
                            <option value="Antiseptic">Antiseptic</option>
                            <option value="Diabetes">Diabetes</option>
                            <option value="Blood Pressure">Blood Pressure</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    {/* Manufacturer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Manufacturer
                        </label>
                        <input
                            type="text"
                            value={formData.manufacturer}
                            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., ABC Pharma"
                        />
                    </div>

                    {/* Dosage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosage
                        </label>
                        <input
                            type="text"
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 500mg"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                        </label>
                        <select
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="piece">Piece</option>
                            <option value="strip">Strip</option>
                            <option value="bottle">Bottle</option>
                            <option value="box">Box</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter medicine description..."
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Medicine
                    </button>
                </div>
            </form>
        </Modal>
    );
}
