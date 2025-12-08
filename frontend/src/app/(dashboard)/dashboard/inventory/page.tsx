'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/lib/api';
import { Search, Filter, Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import AddMedicineModal from '@/components/inventory/AddMedicineModal';
import EditMedicineModal from '@/components/inventory/EditMedicineModal';
import ExcelUploadModal from '@/components/inventory/ExcelUploadModal';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { Medicine } from '@/types';

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
    const [editModal, setEditModal] = useState<{ isOpen: boolean; medicine: Medicine | null }>({
        isOpen: false,
        medicine: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; medicine: Medicine | null }>({
        isOpen: false,
        medicine: null,
    });

    const queryClient = useQueryClient();
    const { toasts, removeToast, success, error } = useToast();

    // Fetch medicines
    const { data: medicines, isLoading, isError } = useQuery({
        queryKey: ['medicines', searchTerm],
        queryFn: () => inventoryApi.getMedicines({ search: searchTerm }),
    });

    // Fetch inventory
    const { data: inventory } = useQuery({
        queryKey: ['inventory'],
        queryFn: () => inventoryApi.getInventory(),
    });

    // Add medicine mutation
    const addMedicineMutation = useMutation({
        mutationFn: async (medicine: Partial<Medicine>) => {
            // TODO: Replace with actual API call when backend endpoint is ready
            // return inventoryApi.addMedicine(medicine);

            // Simulated API call
            return new Promise((resolve) => {
                setTimeout(() => resolve({ ...medicine, id: Date.now() }), 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
            success('Medicine added successfully!');
        },
        onError: () => {
            error('Failed to add medicine. Please try again.');
        },
    });

    // Delete medicine mutation
    const deleteMedicineMutation = useMutation({
        mutationFn: async (id: number) => {
            // TODO: Replace with actual API call when backend endpoint is ready
            // return inventoryApi.deleteMedicine(id);

            // Simulated API call
            return new Promise((resolve) => {
                setTimeout(() => resolve(true), 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
            success('Medicine deleted successfully!');
        },
        onError: () => {
            error('Failed to delete medicine. Please try again.');
        },
    });

    const handleAddMedicine = (medicine: Partial<Medicine>) => {
        addMedicineMutation.mutate(medicine);
    };

    const handleEditMedicine = (id: number, medicine: Partial<Medicine>) => {
        // TODO: Replace with actual API call
        // updateMedicineMutation.mutate({ id, medicine });

        // Simulated update
        success('Medicine updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['medicines'] });
    };

    const handleDeleteMedicine = () => {
        if (deleteModal.medicine) {
            deleteMedicineMutation.mutate(deleteModal.medicine.id);
        }
    };

    const handleExcelUpload = (data: any[]) => {
        // TODO: Process uploaded data and send to backend
        success(`Successfully uploaded ${data.length} items!`);
        queryClient.invalidateQueries({ queryKey: ['medicines'] });
    };

    if (isError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load inventory</p>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['medicines'] })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your pharmacy stock and products
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsExcelModalOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Excel
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Medicine
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Medicines Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-6">
                        <TableSkeleton rows={5} />
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Medicine Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dosage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {medicines && medicines.length > 0 ? (
                                medicines.map((medicine: Medicine) => {
                                    const inventoryItem = inventory && Array.isArray(inventory)
                                        ? inventory.find((inv: any) => inv.medicine_id === medicine.id)
                                        : null;

                                    return (
                                        <tr key={medicine.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                                                <div className="text-sm text-gray-500">{medicine.generic_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {medicine.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {medicine.dosage || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${medicine.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${inventoryItem?.quantity > 50
                                                    ? 'bg-green-100 text-green-800'
                                                    : inventoryItem?.quantity > 20
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {inventoryItem?.quantity || 0} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setEditModal({ isOpen: true, medicine })}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ isOpen: true, medicine })}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={deleteMedicineMutation.isPending}
                                                >
                                                    {deleteMedicineMutation.isPending ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No medicines found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{medicines?.length || 0}</span> medicines
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>

            {/* Add Medicine Modal */}
            <AddMedicineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddMedicine}
            />

            {/* Edit Medicine Modal */}
            <EditMedicineModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, medicine: null })}
                onSuccess={handleEditMedicine}
                medicine={editModal.medicine}
            />

            {/* Excel Upload Modal */}
            <ExcelUploadModal
                isOpen={isExcelModalOpen}
                onClose={() => setIsExcelModalOpen(false)}
                onSuccess={handleExcelUpload}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, medicine: null })}
                onConfirm={handleDeleteMedicine}
                itemName={deleteModal.medicine?.name || ''}
            />
        </div>
    );
}
