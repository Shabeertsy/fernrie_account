import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Loader2,
    Edit2,
    Trash2,
    Plus,
    IndianRupee,
    Image as ImageIcon
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
    // Removed transactionSummary state as we verify stats locally
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<ServiceTransaction | null>(null);

    const [formData, setFormData] = useState<CreateServiceTransactionData>({
        service: serviceId,
        transaction_type: 'income',
        amount: '',
        status: 'other',
        notes: '',
        transaction_date: new Date().toISOString().split('T')[0],
        transaction_time: new Date().toTimeString().slice(0, 5)
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
            // Use the standard endpoint with filtering to avoid 401/Logout issues with the specialized endpoint
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
            transaction_type: transaction.transaction_type,
            amount: transaction.amount,
            status: transaction.status,
            notes: transaction.notes || '',
            transaction_date: transaction.transaction_date,
            transaction_time: transaction.transaction_time || new Date().toTimeString().slice(0, 5) // Use stored time or default to current
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
            transaction_type: 'income',
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

    // Calculate stats locally since we are using the standard transactions endpoint
    const totalIncome = transactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpense = transactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const netProfit = totalIncome - totalExpense;

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
                to={service ? `/clients/${service.client}` : '/clients'}
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base"
            >
                <ArrowLeft size={18} />
                {service ? 'Back to Client' : 'Back to Clients'}
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
                    <p className="text-slate-500 text-xs sm:text-sm mb-1">Total Income</p>
                    <p className="text-lg sm:text-2xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs sm:text-sm mb-1">Total Expense</p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs sm:text-sm mb-1">Net Profit</p>
                    <p className={`text-lg sm:text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>₹{netProfit.toLocaleString()}</p>
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
                                                    <IndianRupee size={16} className={transaction.transaction_type === 'income' ? "text-emerald-600" : "text-red-600"} />
                                                    <span className="text-lg font-bold text-slate-900">
                                                        {parseFloat(transaction.amount).toLocaleString()}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${transaction.transaction_type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {transaction.transaction_type === 'income' ? 'Income' : 'Expense'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                        {getStatusLabel(transaction.status)}
                                                    </span>
                                                </div>
                                                {transaction.notes && (
                                                    <p className="text-sm text-slate-600 mb-2">{transaction.notes}</p>
                                                )}
                                                {transaction.image && (
                                                    <div className="flex justify-center mb-4 mt-2">
                                                        <a
                                                            href={transaction.image.startsWith('http') ? transaction.image : `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')}${transaction.image}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-block relative h-20 w-20 rounded-lg overflow-hidden border border-slate-200 group bg-white shadow-sm"
                                                        >
                                                            <img
                                                                src={transaction.image.startsWith('http') ? transaction.image : `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')}${transaction.image}`}
                                                                alt="Receipt"
                                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                <ImageIcon className="text-slate-400 w-6 h-6 group-hover:hidden" />
                                                                <ImageIcon className="text-emerald-600 w-6 h-6 hidden group-hover:block" />
                                                            </div>
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                                                    </div>
                                                    {transaction.added_by && (
                                                        <div>
                                                            Added by: <span className="font-medium text-slate-700">{transaction.added_by.person_name || transaction.added_by.first_name || transaction.added_by.username}</span>
                                                        </div>
                                                    )}
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
                title={editingTransaction ? "Edit Transaction" : "Create Invoice"}
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
                        <div className="flex p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, transaction_type: 'income' })}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.transaction_type === 'income'
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, transaction_type: 'expense' })}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.transaction_type === 'expense'
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Expense
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={formData.transaction_date}
                                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                            <input
                                type="time"
                                value={formData.transaction_time}
                                onChange={(e) => setFormData({ ...formData, transaction_time: e.target.value })}
                                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                        <select
                            required
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'advance' | 'settled' | 'other' })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                        >
                            <option value="other">Other</option>
                            <option value="advance">Advance</option>
                            <option value="settled">Settled</option>
                        </select>
                    </div>

                    {/* Receipt / Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Receipt / Image</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50 relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData({ ...formData, image: file });
                                    }
                                }}
                                className="hidden"
                                id="receipt-upload"
                            />
                            <label htmlFor="receipt-upload" className="cursor-pointer block">
                                <span className="text-emerald-600 font-medium text-sm block mb-1 group-hover:underline">
                                    {formData.image ? (formData.image as File).name : 'Upload Screenshot / Receipt'}
                                </span>
                                <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                            </label>
                            {formData.image && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setFormData({ ...formData, image: undefined });
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                    title="Remove image"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-20 text-slate-700"
                            placeholder="Add notes..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-sm text-lg"
                    >
                        {editingTransaction ? 'Update Transaction' : 'Create Invoice'}
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
