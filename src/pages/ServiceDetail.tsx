import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Loader2,
    Edit2,
    Trash2,
    Plus,
    DollarSign,
    Clock
} from 'lucide-react';
import { serviceAPI } from '../api/service';
import { serviceTransactionAPI } from '../api/serviceTransaction';
import type { Service } from '../types/service';
import type { ServiceTransaction, CreateServiceTransactionData } from '../types/serviceTransaction';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

const ServiceDetail: React.FC = () => {
    const { id } = useParams();
    const serviceId = parseInt(id || '0');

    const [service, setService] = useState<Service | null>(null);
    const [transactions, setTransactions] = useState<ServiceTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<ServiceTransaction | null>(null);

    const [formData, setFormData] = useState<CreateServiceTransactionData>({
        service: serviceId,
        amount: '',
        status: 'other',
        notes: ''
    });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'danger' as 'danger' | 'warning' | 'info' | 'success',
        confirmText: 'Confirm',
        onConfirm: async () => { },
        isLoading: false
    });

    useEffect(() => {
        fetchService();
        fetchTransactions();
    }, [serviceId]);

    const fetchService = async () => {
        try {
            const data = await serviceAPI.getService(serviceId);
            setService(data);
        } catch (error) {
            console.error('Failed to fetch service:', error);
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await serviceTransactionAPI.getServiceTransactions(serviceId);
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTransaction) {
                await serviceTransactionAPI.updateServiceTransaction(editingTransaction.id, formData);
            } else {
                await serviceTransactionAPI.createServiceTransaction({ ...formData, service: serviceId });
            }
            await fetchTransactions();
            closeModal();
        } catch (error) {
            console.error('Failed to save transaction:', error);
        }
    };

    const handleEdit = (transaction: ServiceTransaction) => {
        setEditingTransaction(transaction);
        setFormData({
            service: transaction.service,
            amount: transaction.amount,
            status: transaction.status,
            notes: transaction.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Transaction',
            message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            isLoading: false,
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, isLoading: true }));
                try {
                    await serviceTransactionAPI.deleteServiceTransaction(id);
                    await fetchTransactions();
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error('Failed to delete transaction:', error);
                    setConfirmDialog(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        setFormData({
            service: serviceId,
            amount: '',
            status: 'other',
            notes: ''
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'advance':
                return 'bg-blue-100 text-blue-700';
            case 'settled':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'advance':
                return 'Advance';
            case 'settled':
                return 'Settled';
            default:
                return 'Other';
        }
    };

    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const advanceAmount = transactions
        .filter(t => t.status === 'advance')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const settledAmount = transactions
        .filter(t => t.status === 'settled')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (!service) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 pb-4">
            {/* Back Button */}
            <Link
                to="/clients"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base"
            >
                <ArrowLeft size={18} />
                Back to Clients
            </Link>

            {/* Service Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{service.service_name}</h1>
                        {service.description && (
                            <p className="text-slate-600 mb-3">{service.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{new Date(service.start_date).toLocaleDateString()}</span>
                            </div>
                            {service.end_date && (
                                <>
                                    <span>→</span>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{new Date(service.end_date).toLocaleDateString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {service.is_active ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">Active</span>
                        ) : (
                            <span className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-full font-medium">Inactive</span>
                        )}
                        {service.is_closed && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">Closed</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs sm:text-sm mb-1">Service Amount</p>
                    <p className="text-lg sm:text-2xl font-bold text-emerald-600">₹{parseFloat(service.amount).toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs sm:text-sm mb-1">Total Received</p>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs sm:text-sm mb-1">Advance</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600">₹{advanceAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs sm:text-sm mb-1">Settled</p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">₹{settledAmount.toLocaleString()}</p>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 sm:p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Transactions</h2>
                            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Payment history</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
                        >
                            <Plus size={18} />
                            <span>Add Transaction</span>
                        </button>
                    </div>
                </div>

                {/* Mobile FAB */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={24} />
                </button>

                <div className="p-4 sm:p-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-emerald-600" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign size={16} className="text-emerald-600" />
                                                    <span className="text-lg font-bold text-slate-900">
                                                        ₹{parseFloat(transaction.amount).toLocaleString()}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                        {getStatusLabel(transaction.status)}
                                                    </span>
                                                </div>
                                                {transaction.notes && (
                                                    <p className="text-sm text-slate-600 mb-2">{transaction.notes}</p>
                                                )}
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Clock size={12} />
                                                    <span>{new Date(transaction.transaction_date).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction.id)}
                                                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <p>No transactions found. Add your first transaction to get started!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                        <select
                            required
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'advance' | 'settled' | 'other' })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        >
                            <option value="other">Other</option>
                            <option value="advance">Advance</option>
                            <option value="settled">Settled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-20"
                            placeholder="Add notes..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                    >
                        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                    </button>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type={confirmDialog.type}
                confirmText={confirmDialog.confirmText}
                isLoading={confirmDialog.isLoading}
            />
        </div>
    );
};

export default ServiceDetail;
