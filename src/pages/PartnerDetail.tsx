import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    User,
    Calendar,
    Clock,
    Loader2,
    ArrowUpCircle,
    ArrowDownCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { partnersAPI, type Partner } from '../api/partners';
import { companyAPI } from '../api/company';
import type { CompanyTransaction } from '../types';

const PartnerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [partner, setPartner] = useState<Partner | null>(null);
    const [transactions, setTransactions] = useState<CompanyTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'new' | 'completed'>('new');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch all partners to get the specific partner details
                const partnersData = await partnersAPI.getPartners();
                const currentPartner = partnersData.find(p => p.id === parseInt(id));
                setPartner(currentPartner || null);

                // Fetch all company transactions
                const txData = await companyAPI.getTransactions();
                const allTransactions = Array.isArray(txData) ? txData : txData.results || [];
                
                // Filter transactions for this partner where split_amount is true
                const partnerTransactions = allTransactions.filter((t: CompanyTransaction) => 
                    t.person === parseInt(id) && t.split_amount === true
                );
                setTransactions(partnerTransactions);
            } catch (error) {
                console.error('Failed to fetch partner details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    if (!partner) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500">Partner not found.</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-4 text-emerald-600 font-medium hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Filter transactions based on active tab
    const filteredTransactions = transactions.filter(t => 
        activeTab === 'new' ? !t.is_closed : t.is_closed
    );

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
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Partner Details</h1>
                </div>
            </div>

            {/* Partner Info Card */}
            <Card className="p-6 bg-white border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 text-2xl font-bold">
                        {partner.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{partner.name}</h2>
                        <p className="text-slate-500">Partner ID: {partner.id}</p>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                        activeTab === 'new'
                            ? 'text-emerald-600'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    New
                    {activeTab === 'new' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                        activeTab === 'completed'
                            ? 'text-emerald-600'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Completed
                    {activeTab === 'completed' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
                    )}
                </button>
            </div>

            {/* Transactions */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Transactions</h3>
                {filteredTransactions && filteredTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {filteredTransactions.map((t) => {
                            const tDateObj = new Date(t.date_time);
                            const tDateStr = tDateObj.toLocaleDateString();
                            const tTimeStr = tDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            
                            return (
                                <Card 
                                    key={t.id} 
                                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/billing/${t.id}`)}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            t.transaction_type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {t.transaction_type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <p className="font-bold text-slate-900 truncate">{partner.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {tDateStr}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {tTimeStr}</span>
                                            </div>
                                            {t.notes && <p className="text-xs text-slate-400 mt-1 truncate">{t.notes}</p>}
                                        </div>
                                        
                                        {/* Amount */}
                                        <div className={`font-bold text-sm whitespace-nowrap flex-shrink-0 ${
                                            t.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                            {t.transaction_type === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 text-slate-500">
                        <p>No {activeTab} transactions found for this partner.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerDetail;
