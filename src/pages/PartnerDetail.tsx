import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    ArrowUpCircle,
    ArrowDownCircle,
    Plus
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { partnersAPI } from '../api/partners';
import { companyAPI } from '../api/company';
import type { CompanyTransaction, Partner } from '../types';

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
                const currentPartner = partnersData.partners.find(p => p.id === parseInt(id));
                setPartner(currentPartner || null);

                // Fetch split transactions for this partner using the split-transactions API
                const splitTransactionsResponse = await companyAPI.getSplitTransactions(undefined, undefined, 1, parseInt(id));

                setTransactions(splitTransactionsResponse.results);
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
                    className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'new'
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
                    className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'completed'
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
                                    className="p-3 sm:p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${t.transaction_type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {t.transaction_type === 'income' ? <ArrowUpCircle size={20} className="sm:w-6 sm:h-6" /> : <ArrowDownCircle size={20} className="sm:w-6 sm:h-6" />}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className="font-bold text-slate-900 truncate text-sm sm:text-base">{t.notes || 'Transaction'}</p>
                                                <div className={`px-2 py-0.5 rounded text-[10px] font-medium border flex-shrink-0 ${t.is_closed
                                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    {t.is_closed ? 'Closed' : 'Pending'}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-2 flex-wrap">
                                                <span className="truncate">
                                                    Paid by {
                                                        typeof t.person === 'object' && t.person !== null
                                                            ? (t.person.person_name || t.person.name)
                                                            : t.person_name || 'Unknown'
                                                    }
                                                </span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1 whitespace-nowrap">{tDateStr}</span>
                                                <span className="text-slate-300 hidden sm:inline">•</span>
                                                <span className="hidden sm:inline whitespace-nowrap">{tTimeStr}</span>
                                            </div>

                                            {/* Split Transaction Info */}
                                            {t.amount_per_partner && t.number_of_partners && (
                                                <div className="flex items-center gap-2 text-xs text-slate-600 mb-2 flex-wrap">
                                                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                                                        ₹{t.amount_per_partner.toLocaleString()} per partner
                                                    </span>
                                                    <span className="text-slate-400">•</span>
                                                    <span>{t.number_of_partners} partners</span>
                                                </div>
                                            )}

                                            {/* Amount and Button - Mobile Layout */}
                                            <div className="flex items-center justify-between gap-2 mt-2">
                                                <div className={`font-bold text-base sm:text-lg ${t.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                                    }`}>
                                                    {t.transaction_type === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/partners/${id}/transactions/${t.id}`);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm font-medium shadow-sm"
                                                >
                                                    <Plus size={14} className="sm:w-4 sm:h-4" />
                                                    <span>Add Payment</span>
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
                        <p>No {activeTab} transactions found for this partner.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerDetail;
