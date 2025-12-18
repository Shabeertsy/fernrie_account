import React from 'react';
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false
}) => {
    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <AlertCircle className="text-red-600" size={24} />;
            case 'warning':
                return <AlertTriangle className="text-amber-600" size={24} />;
            case 'success':
                return <CheckCircle className="text-emerald-600" size={24} />;
            default:
                return <Info className="text-blue-600" size={24} />;
        }
    };

    const getButtonVariant = () => {
        switch (type) {
            case 'danger':
                return 'danger';
            case 'warning':
                return 'secondary'; // Or a warning variant if available
            case 'success':
                return 'primary';
            default:
                return 'primary';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-50' :
                        type === 'warning' ? 'bg-amber-50' :
                            type === 'success' ? 'bg-emerald-50' :
                                'bg-blue-50'
                    }`}>
                    {getIcon()}
                </div>

                <p className="text-slate-600">
                    {message}
                </p>

                <div className="flex items-center gap-3 w-full pt-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={getButtonVariant()}
                        onClick={onConfirm}
                        className="flex-1"
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
