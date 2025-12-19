import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    Plus,
    Edit2,
    Trash2,
    Clock,
    User,
    AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { personalAPI } from '../api/personal';
import { partnersAPI } from '../api/partners';
import { companyAPI } from '../api/company';
import type { PersonalTransaction, CompanyTransaction, Partner } from '../types';
import { Modal } from '../components/common/Modal';

const PartnerTransactionDetail: React.FC = () => {
    const { partnerId, transactionId } = useParams<{ partnerId: string; transactionId: string }>();
    const navigate = useNavigate();
    const [partner, setPartner] = useState<Partner | null>(null);
    const [companyTransaction, setCompanyTransaction] = useState<CompanyTransaction | null>(null);
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
    }, [partnerId, transactionId]);

    const fetchData = async () => {
        if (!partnerId || !transactionId) return;
        setLoading(true);
        try {
            // Fetch partner details
            const partnersData = await partnersAPI.getPartners();
            const currentPartner = partnersData.partners.find(p => p.id === parseInt(partnerId));
            setPartner(currentPartner || null);

            // Fetch company transaction details
            const txData = await companyAPI.getTransaction(parseInt(transactionId));
            setCompanyTransaction(txData);

            // Fetch personal transactions for this partner and transaction
            try {
                const response = await personalAPI.getPartnerTransactionDetails(partnerId, transactionId);
                console.log('Personal transactions response:', response);

                // Handle both response formats: array or object with data property
                if (Array.isArray(response)) {
                    setPersonalTransactions(response);
                } else if (response && Array.isArray(response.data)) {
                    setPersonalTransactions(response.data);
                } else {
                    console.warn('Unexpected response format:', response);
                    setPersonalTransactions([]);
                }
            } catch (error: any) {
                console.error('Failed to fetch personal transactions:', error);
                console.error('Error response:', error.response);
                const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch personal transactions.';
                setError(errorMessage);
                setPersonalTransactions([]);
            }
        } catch (error: any) {
            console.error('Failed to fetch transaction details:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch transaction details.';
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
        if (!window.confirm('Are you sure you want to delete this payment?')) return;

        try {
            await personalAPI.deletePersonalTransaction(ptId);
            await fetchData(); // Refresh data
            setError(null);
        } catch (error: any) {
            console.error('Failed to delete:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to delete payment.';
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
        if (!companyTransaction || !partnerId) return;

        try {
            // Use partner ID as the user
            const userId = partnerId;

            const dataToSave = {
                ...formData,
                user: userId,
                transaction: companyTransaction.id,
                payment_date: editingTransaction ? editingTransaction.payment_date : new Date().toISOString()
            };

            if (editingTransaction) {
                await personalAPI.updatePersonalTransaction(editingTransaction.id, dataToSave);
            } else {
                await personalAPI.createPersonalTransaction(dataToSave);
            }
            await fetchData();
            handleCloseModal();
            setError(null);
        } catch (error: any) {
            console.error('Failed to save payment:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to save payment.';
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

    if (!partner || !companyTransaction) {
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

    const tDateObj = new Date(companyTransaction.date_time);
    const tDateStr = tDateObj.toLocaleDateString();
    const tTimeStr = tDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


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
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Transaction Details</h1>
                    <p className="text-sm text-slate-500">{partner.name}</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Company Transaction Info Card */}
            <Card className="p-4 sm:p-6 bg-white border-slate-100 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${companyTransaction.transaction_type === 'income'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-600'
                        }`}>
                        {companyTransaction.transaction_type === 'income' ? (
                            <ArrowUpCircle size={28} />
                        ) : (
                            <ArrowDownCircle size={28} />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                            {companyTransaction.notes || 'Transaction'}
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="font-medium">Paid by:</span>
                                <span>{partner.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Calendar size={16} />
                                <span>{tDateStr} at {tTimeStr}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-600">Amount:</span>
                                <span className={`text-lg font-bold ${companyTransaction.transaction_type === 'income'
                                    ? 'text-emerald-600'
                                    : 'text-red-600'
                                    }`}>
                                    {companyTransaction.transaction_type === 'income' ? '+' : '-'}₹{parseFloat(companyTransaction.amount).toLocaleString()}
                                </span>
                            </div>
                            {companyTransaction.split_amount && (
                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <p className="text-xs text-slate-500">Total Split Amount</p>
                                        <p className="font-semibold text-slate-900">₹{(companyTransaction.total_split_amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Received Amount</p>
                                        <p className="font-semibold text-emerald-600">₹{(companyTransaction.total_received_amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Remaining Amount</p>
                                        <p className="font-semibold text-amber-600">₹{(companyTransaction.remaining_amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Status</p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${companyTransaction.is_closed
                                            ? 'bg-slate-100 text-slate-600'
                                            : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {companyTransaction.is_closed ? 'Closed' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Personal Transactions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg">Payments</h3>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Add Payment
                    </button>
                </div>

                {personalTransactions && personalTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {personalTransactions.map((pt) => {
                            const paymentDate = new Date(pt.payment_date);
                            const paymentDateStr = paymentDate.toLocaleDateString();
                            const paymentTimeStr = paymentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <Card
                                    key={pt.id}
                                    className="p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 flex-shrink-0">
                                            <User size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-slate-900">{partner.name}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pt.is_completed
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {pt.is_completed ? 'Completed' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {paymentDateStr}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {paymentTimeStr}</span>
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 capitalize">
                                                    {pt.payment_method}
                                                </span>
                                            </div>
                                            {pt.notes && <p className="text-xs text-slate-400 mt-1">{pt.notes}</p>}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <div className="text-right">
                                                <div className="font-bold text-slate-900 text-lg">
                                                    ₹{parseFloat(pt.amount).toLocaleString()}
                                                </div>
                                                {pt.pending_balance && parseFloat(pt.pending_balance) > 0 && (
                                                    <div className="text-xs text-amber-600 mt-1">
                                                        Balance: ₹{parseFloat(pt.pending_balance).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => handleEdit(pt)}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pt.id)}
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
                        <p>No payments found for this transaction.</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTransaction ? 'Edit Payment' : 'Add Payment'}
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

export default PartnerTransactionDetail;
