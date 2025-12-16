import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    Clock,
    Loader2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { companyAPI } from '../api/company';
import { partnersAPI, type Partner } from '../api/partners';
import type { CompanyTransaction } from '../types';

const TransactionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<CompanyTransaction | null>(null);
    const [relatedTransactions, setRelatedTransactions] = useState<CompanyTransaction[]>([]);
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

                // Fetch related transactions if person exists
                if (data.person) {
                    const relatedData = await companyAPI.getTransactions(undefined, undefined, 1, data.person);
                    // Filter out the current transaction from related list
                    setRelatedTransactions(relatedData.results.filter(t => t.id !== parseInt(id)));
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
                                src={transaction.image} 
                                alt="Receipt" 
                                className="w-full h-48 object-cover rounded-lg border border-slate-200"
                            />
                        </div>
                    )}
                </div>
            </Card>

            {/* Related Transactions */}
            {relatedTransactions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg">Recent History with {getPersonDisplay(transaction)}</h3>
                    <div className="space-y-3">
                        {relatedTransactions.map((t) => {
                            const tDateObj = new Date(t.date_time);
                            const tDateStr = tDateObj.toLocaleDateString();
                            const tTimeStr = tDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            
                            return (
                                <Card 
                                    key={t.id} 
                                    className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/company-accounts/${t.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            t.transaction_type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {t.transaction_type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{getPersonDisplay(t)}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {tDateStr}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {tTimeStr}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-right font-bold ${t.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {t.transaction_type === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionDetail;
