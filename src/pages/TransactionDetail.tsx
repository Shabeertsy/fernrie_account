import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    Clock,
    Loader2,
    User
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { companyAPI } from '../api/company';
import { partnersAPI, type Partner } from '../api/partners';
import { personalAPI } from '../api/personal';
import type { CompanyTransaction, PersonalTransaction } from '../types';

const TransactionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<CompanyTransaction | null>(null);
    const [relatedTransactions, setRelatedTransactions] = useState<PersonalTransaction[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch main transaction
                const data = await companyAPI.getTransaction(parseInt(id));
                setTransaction(data);

                // Fetch partners to resolve names
                const partnersData = await partnersAPI.getPartners();
                setPartners(partnersData);

                // Fetch related personal transactions
                try {
                    const relatedData = await personalAPI.getPersonalTransactions(parseInt(id));
                    if (relatedData && Array.isArray(relatedData.data)) {
                        setRelatedTransactions(relatedData.data);
                    } else {
                        console.warn('Unexpected format for related transactions:', relatedData);
                        setRelatedTransactions([]);
                    }
                } catch (innerError) {
                    console.error('Failed to fetch related transactions:', innerError);
                    setRelatedTransactions([]);
                }
            } catch (error) {
                console.error('Failed to fetch transaction details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Helper to get person name from ID or notes
    const getPersonDisplay = (t: CompanyTransaction) => {
        if (t.person_name) return t.person_name;
        if (t.person) {
            const partner = partners.find(p => p.id === t.person);
            if (partner) return partner.name;
        }
        return t.notes || 'Unknown';
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

    const dateObj = new Date(transaction.date_time);
    const dateStr = dateObj.toLocaleDateString();
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
                </div>
            </div>

            {/* Main Transaction Detail Card */}
            <Card className="p-6 bg-white border-slate-100 shadow-sm">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                        transaction.transaction_type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                        {transaction.transaction_type === 'income' ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        {transaction.transaction_type === 'income' ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                    </h2>
                    <p className="text-slate-500 mt-1 capitalize">{transaction.transaction_type}</p>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Person / Entity</span>
                        <span className="font-medium text-slate-900">{getPersonDisplay(transaction)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Date</span>
                        <span className="font-medium text-slate-900">{dateStr}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Time</span>
                        <span className="font-medium text-slate-900">{timeStr}</span>
                    </div>
                    {transaction.notes && (
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-sm">Notes</span>
                            <span className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg text-sm">
                                {transaction.notes}
                            </span>
                        </div>
                    )}
                    {transaction.image && (
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-sm">Receipt</span>
                            <img 
                                src={transaction.image.startsWith('http') ? transaction.image : `${import.meta.env.VITE_API_URL}${transaction.image}`} 
                                alt="Receipt" 
                                className="w-full h-48 object-cover rounded-lg border border-slate-200"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>
            </Card>

            {/* Related Transactions */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Personal Transactions</h3>
                {relatedTransactions && relatedTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {relatedTransactions.map((t) => {
                            const tDateObj = new Date(t.payment_date);
                            const tDateStr = tDateObj.toLocaleDateString();
                            const tTimeStr = tDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            
                            return (
                                <Card 
                                    key={t.id} 
                                    className="p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 flex-shrink-0">
                                                <User size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-bold text-slate-900">{t.user}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        t.is_completed 
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
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-bold text-slate-900 text-lg">
                                                ₹{parseFloat(t.amount).toLocaleString()}
                                            </div>
                                            {t.pending_balance && parseFloat(t.pending_balance) > 0 && (
                                                <div className="text-xs text-amber-600 mt-1">
                                                    Balance: ₹{parseFloat(t.pending_balance).toLocaleString()}
                                                </div>
                                            )}
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
        </div>
    );
};

export default TransactionDetail;
