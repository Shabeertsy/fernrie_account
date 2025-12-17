import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    User,
    Clock,
    Upload,
    Loader2,
    Edit2,
    Trash2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { companyAPI } from '../api/company';
import { partnersAPI, type Partner } from '../api/partners';
import type { CompanyTransaction } from '../types';

const CompanyAccounts: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<CompanyTransaction[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(''); // Empty by default to show all
    const [submitting, setSubmitting] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<CompanyTransaction | null>(null);
    
    // Form State
    const [formData, setFormData] = useState({
        amount: '',
        type: 'income' as 'income' | 'expense',
        person: '', // This will now store the ID
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
        description: '',
        splitAmount: false,
        image: null as File | null
    });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            let month, year;
            if (selectedMonth) {
                const [y, m] = selectedMonth.split('-');
                year = parseInt(y);
                month = parseInt(m);
            }
            const data = await companyAPI.getTransactions(month, year);
            setTransactions(data.results);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPartners = async () => {
        try {
            const data = await partnersAPI.getPartners();
            setPartners(data);
        } catch (error) {
            console.error('Failed to fetch partners:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchPartners();
    }, [selectedMonth]);

    const handleSaveTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('transaction_type', formData.type);
            formDataToSend.append('amount', formData.amount);
            
            // Combine date and time
            const dateTime = `${formData.date}T${formData.time}:00`;
            formDataToSend.append('date_time', dateTime);
            
            formDataToSend.append('split_amount', formData.splitAmount ? 'true' : 'false');
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            
            if (formData.person) {
                formDataToSend.append('person', formData.person);
            }

            formDataToSend.append('notes', formData.description);

            if (editingTransaction) {
                await companyAPI.updateTransaction(editingTransaction.id, formDataToSend);
            } else {
                await companyAPI.createTransaction(formDataToSend);
            }
            
            closeModal();
            fetchTransactions();
        } catch (error) {
            console.error('Failed to save transaction:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        
        try {
            await companyAPI.deleteTransaction(id);
            fetchTransactions();
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    const handleEdit = (transaction: CompanyTransaction) => {
        setEditingTransaction(transaction);
        
        const dateObj = new Date(transaction.date_time);
        const dateStr = dateObj.toISOString().slice(0, 10);
        const timeStr = dateObj.toTimeString().slice(0, 5);

        setFormData({
            amount: transaction.amount,
            type: transaction.transaction_type,
            person: transaction.person ? transaction.person.toString() : '',
            date: dateStr,
            time: timeStr,
            description: transaction.notes || '',
            splitAmount: transaction.split_amount,
            image: null // We don't preload the image file object
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        setFormData({
            amount: '',
            type: 'income',
            person: '',
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toTimeString().slice(0, 5),
            description: '',
            splitAmount: false,
            image: null
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const totalIncome = transactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = transactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const balance = totalIncome - totalExpense;

    // Helper to get person name from ID or notes
    const getPersonDisplay = (t: CompanyTransaction) => {
        if (t.person_name) return t.person_name;
        if (t.person) {
            const partner = partners.find(p => p.id === t.person);
            if (partner) return partner.name;
        }
        return t.notes || 'Unknown';
    };

    return (
        <div className="space-y-6 pb-24 sm:pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Company Accounts</h1>
                    <p className="text-slate-500 text-sm mt-1">Track internal income and expenses</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="month" 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <Button icon={Plus} onClick={() => setIsModalOpen(true)} className="hidden sm:flex">Add New</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {/* Income Card */}
                <Card className="p-3 sm:p-5 bg-white sm:bg-gradient-to-br sm:from-emerald-500 sm:to-emerald-600 sm:text-white sm:border-none shadow-sm border-slate-100">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <p className="text-slate-500 sm:text-emerald-100 text-xs sm:text-sm font-medium mb-1">Income</p>
                        <h3 className="text-lg sm:text-2xl font-bold text-slate-900 sm:text-white">₹{totalIncome.toLocaleString()}</h3>
                        <div className="mt-1 sm:mt-4 flex items-center justify-center sm:justify-start text-[10px] sm:text-xs text-emerald-600 sm:text-emerald-100 sm:bg-white/10 w-full sm:w-fit sm:px-2 sm:py-1 rounded-lg">
                            <span className="hidden sm:inline"><ArrowUpCircle size={14} className="mr-1" /></span>
                            <span>+Inflow</span>
                        </div>
                    </div>
                </Card>

                {/* Expense Card */}
                <Card className="p-3 sm:p-5 bg-white border-slate-100 shadow-sm">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium mb-1">Expense</p>
                        <h3 className="text-lg sm:text-2xl font-bold text-slate-900">₹{totalExpense.toLocaleString()}</h3>
                        <div className="mt-1 sm:mt-4 flex items-center justify-center sm:justify-start text-[10px] sm:text-xs text-red-600 sm:bg-red-50 w-full sm:w-fit sm:px-2 sm:py-1 rounded-lg">
                            <span className="hidden sm:inline"><ArrowDownCircle size={14} className="mr-1" /></span>
                            <span>-Outflow</span>
                        </div>
                    </div>
                </Card>

                {/* Balance Card */}
                <Card className="p-3 sm:p-5 bg-white sm:bg-slate-900 sm:text-white sm:border-none shadow-sm border-slate-100">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <p className="text-slate-500 sm:text-slate-400 text-xs sm:text-sm font-medium mb-1">Balance</p>
                        <h3 className="text-lg sm:text-2xl font-bold text-slate-900 sm:text-white">₹{balance.toLocaleString()}</h3>
                        <div className={`mt-1 sm:mt-4 flex items-center justify-center sm:justify-start text-[10px] sm:text-xs w-full sm:w-fit sm:px-2 sm:py-1 rounded-lg ${balance >= 0 ? 'text-emerald-600 sm:text-emerald-400 sm:bg-emerald-500/20' : 'text-red-600 sm:text-red-400 sm:bg-red-500/20'}`}>
                            <span>{balance >= 0 ? 'Surplus' : 'Deficit'}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Transactions</h3>
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-emerald-600" size={32} />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.length > 0 ? (
                            transactions.map((t) => {
                                const dateObj = new Date(t.date_time);
                                const dateStr = dateObj.toLocaleDateString();
                                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                
                                return (
                                    <Card 
                                        key={t.id} 
                                        className="p-4 hover:shadow-md transition-shadow group cursor-pointer"
                                        onClick={() => navigate(`/company-accounts/${t.id}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Icon */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                t.transaction_type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {t.transaction_type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                                            </div>
                                            
                                            {/* Content - can shrink */}
                                            <div className="flex-1 min-w-0 overflow-hidden">
                                                <p className="font-bold text-slate-900 truncate">{getPersonDisplay(t)}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {dateStr}</span>
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {timeStr}</span>
                                                </div>
                                                {t.notes && <p className="text-xs text-slate-400 mt-1 truncate">{t.notes}</p>}
                                            </div>
                                            
                                            {/* Amount and Actions - never shrink */}
                                            <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                                                <div className={`font-bold text-sm whitespace-nowrap ${t.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {t.transaction_type === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(t); }}
                                                        className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-slate-500 bg-white rounded-2xl border border-slate-100">
                                <p>No transactions found for this month.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile FAB */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 right-4 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-300 flex items-center justify-center sm:hidden z-40 active:scale-95 transition-transform"
            >
                <Plus size={28} />
            </button>

            {/* Add/Edit Transaction Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
                size="sm"
            >
                <form onSubmit={handleSaveTransaction} className="space-y-3 sm:space-y-4">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 bg-slate-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, type: 'income'})}
                            className={`py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-all ${
                                formData.type === 'income' 
                                    ? 'bg-white text-emerald-600 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, type: 'expense'})}
                            className={`py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-all ${
                                formData.type === 'expense' 
                                    ? 'bg-white text-red-600 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Expense
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Amount</label>
                        <div className="relative">
                            
                            <input
                                type="number"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-lg"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Person / Entity</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={formData.person}
                                onChange={(e) => setFormData({...formData, person: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                            >
                                <option value="">Not Specified</option>
                                {partners.map(partner => (
                                    <option key={partner.id} value={partner.id}>
                                        {partner.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ArrowDownCircle size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <input
                            type="checkbox"
                            id="splitAmount"
                            checked={formData.splitAmount}
                            onChange={(e) => setFormData({...formData, splitAmount: e.target.checked})}
                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                        />
                        <label htmlFor="splitAmount" className="text-sm font-medium text-slate-700">
                            Split Amount
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Receipt / Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-3 pb-4 sm:pt-5 sm:pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-emerald-500 transition-colors cursor-pointer relative bg-slate-50">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <div className="space-y-1 text-center">
                                {formData.image ? (
                                    <div className="flex flex-col items-center">
                                        <img 
                                            src={URL.createObjectURL(formData.image)} 
                                            alt="Preview" 
                                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg mb-2"
                                        />
                                        <p className="text-xs text-emerald-600 font-medium">Image selected</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mx-auto h-8 w-8 text-slate-400">
                                            <Upload size={32} />
                                        </div>
                                        <div className="flex text-xs text-slate-600 justify-center">
                                            <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                                                Upload a file
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Description (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm resize-none h-16 sm:h-20"
                            placeholder="Add notes..."
                        />
                    </div>

                    <Button type="submit" className="w-full py-2.5 sm:py-3 text-base mt-2" disabled={submitting}>
                        {submitting ? 'Saving...' : (editingTransaction ? 'Update Transaction' : 'Save Transaction')}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default CompanyAccounts;
