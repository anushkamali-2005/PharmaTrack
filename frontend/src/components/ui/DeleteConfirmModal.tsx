'use client';

import Modal from '@/components/ui/Modal';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
}: DeleteConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" size="sm">
            <div className="space-y-4">
                <p className="text-gray-600">
                    Are you sure you want to delete <span className="font-semibold">{itemName}</span>?
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}
