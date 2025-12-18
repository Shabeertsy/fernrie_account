import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Calendar,
    Clock,
    Loader2,
    Edit2,
    Trash2,
    Plus,
    AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { companyAPI } from '../api/company';
import { personalAPI } from '../api/personal';
import { partnersAPI } from '../api/partners';
import type { CompanyTransaction, PersonalTransaction } from '../types';
import { Modal } from '../components/common/Modal';

const BillingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<CompanyTransaction | null>(null);
    const [personalTransactions, setPersonalTransactions] = useState<PersonalTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<PersonalTransaction | null>(null);
    const [formData, setFormData] = useState({
        user: '',
        amount: '',
        payment_method: 'cash',
        notes: ''
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            // Fetch main transaction
            const txData = await companyAPI.getTransaction(parseInt(id));
            setTransaction(txData);

            // Fetch personal transactions
            try {
                let partnerId;
                if (txData.person) {
                    partnerId = typeof txData.person === 'object' ? txData.person.id : txData.person;
                }

                if (partnerId) {
                    const response = await partnersAPI.getPartnerTransactionDetails(partnerId, parseInt(id));
                    // Check if response itself is the array, or if it has a data property
                    const transactionsList = Array.isArray(response) ? response : (response && Array.isArray((response as any).data) ? (response as any).data : []);
                    setPersonalTransactions(transactionsList);
                } else {
                    // Fallback to empty if no partner associated
                    setPersonalTransactions([]);
                }
            } catch (error: any) {
                console.error('Failed to fetch personal transactions:', error);
                const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch personal transactions. Please try again.';
                setError(errorMessage);
                setPersonalTransactions([]);
            }
        } catch (error: any) {
            console.error('Failed to fetch transaction:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch transaction details. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pt: PersonalTransaction) => {
        setEditingTransaction(pt);
        setFormData({
            user: pt.user,
            amount: pt.amount,
            payment_method: pt.payment_method,
            notes: pt.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (ptId: number) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await personalAPI.deletePersonalTransaction(ptId);
            await fetchData(); // Refresh data
        } catch (error: any) {
            console.error('Failed to delete:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to delete transaction. Please try again.';
            setError(errorMessage);
        }
    };

    const handleAddNew = () => {
        setEditingTransaction(null);
        setFormData({
            user: '',
            amount: '',
            payment_method: 'cash',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSave = async () => {
        if (!transaction) return;

        try {
            // Determine user ID from transaction person if available
            let userId = formData.user;
            if (!editingTransaction && transaction.person) {
                // specific logic: if creating, use the partner ID as the user
                userId = typeof transaction.person === 'object' ? transaction.person.id.toString() : transaction.person.toString();
            }

            const dataToSave = {
                ...formData,
                user: userId, // Override/Ensure user ID is passed
                transaction: transaction.id,
                // Add default date if new, or keep existing? Backend usually handles dates if not provided
                payment_date: editingTransaction ? editingTransaction.payment_date : new Date().toISOString()
            };

            if (editingTransaction) {
                await personalAPI.updatePersonalTransaction(editingTransaction.id, dataToSave);
            } else {
                await personalAPI.createPersonalTransaction(dataToSave);
            }
            await fetchData();
            await fetchData();
            handleCloseModal();
            setError(null);
        } catch (error: any) {
            console.error('Failed to save transaction:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to save transaction. Please try again.';
            setError(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500">Transaction not found.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-emerald-600 font-medium hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24 sm:pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Billing Details</h1>
                </div>
            </div>


            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Main Transaction Info */}
            <Card className="p-6 bg-white border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Total Amount</p>
                        <h2 className="text-3xl font-bold text-slate-900">
                            ₹{parseFloat(transaction.amount).toLocaleString()}
                        </h2>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${transaction.is_closed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                        }`}>
                        {transaction.is_closed ? 'Completed' : 'New'}
                    </div>
                </div>
            </Card>

            {/* Personal Transactions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg">Personal Transactions</h3>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Add
                    </button>
                </div>

                {personalTransactions && personalTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {personalTransactions.map((t) => {
                            const tDateObj = new Date(t.payment_date);
                            const tDateStr = tDateObj.toLocaleDateString();
                            const tTimeStr = tDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <Card
                                    key={t.id}
                                    className="p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 flex-shrink-0">
                                            <User size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-slate-900">{t.user}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.is_completed
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {t.is_completed ? 'Completed' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {tDateStr}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {tTimeStr}</span>
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 capitalize">
                                                    {t.payment_method}
                                                </span>
                                            </div>
                                            {t.notes && <p className="text-xs text-slate-400 mt-1">{t.notes}</p>}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <div className="text-right">
                                                <div className="font-bold text-slate-900 text-lg">
                                                    ₹{parseFloat(t.amount).toLocaleString()}
                                                </div>
                                                {t.pending_balance && parseFloat(t.pending_balance) > 0 && (
                                                    <div className="text-xs text-amber-600 mt-1">
                                                        Balance: ₹{parseFloat(t.pending_balance).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => handleEdit(t)}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 text-slate-500">
                        <p>No personal transactions found.</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formData.payment_method}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        >
                            <option value="cash">Cash</option>
                            <option value="online">Online</option>
                            <option value="card">Card</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleCloseModal}
                            className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BillingDetail;
