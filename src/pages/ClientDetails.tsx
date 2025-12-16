import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Plus, Edit2, Trash2, Phone, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

interface Transaction {
    id: string;
    date: string;
    description: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
}

const ClientDetails: React.FC = () => {
    const { id } = useParams();

    // Mock client data - replace with API call
    const client = {
        id: id || '1',
        name: 'ABC Corporation',
        email: 'abc@corp.com',
        phone: '+91 98765 00001',
        address: '123 Business Park, Mumbai, Maharashtra 400001',
        totalExpense: 450000,
        totalIncome: 650000,
        profit: 200000,
        status: 'active'
    };

    const [transactions] = useState<Transaction[]>([
        {
            id: '1',
            date: '2025-12-15',
            description: 'Project A - Final Payment',
            type: 'income',
            amount: 150000,
            category: 'Project'
        },
        {
            id: '2',
            date: '2025-12-14',
            description: 'Office supplies and materials',
            type: 'expense',
            amount: 25000,
            category: 'Materials'
        },
        {
            id: '3',
            date: '2025-12-12',
            description: 'Consulting services rendered',
            type: 'income',
            amount: 200000,
            category: 'Service'
        },
        {
            id: '4',
            date: '2025-12-10',
            description: 'Software licenses',
            type: 'expense',
            amount: 75000,
            category: 'Software'
        },
        {
            id: '5',
            date: '2025-12-08',
            description: 'Project B - Advance Payment',
            type: 'income',
            amount: 100000,
            category: 'Project'
        }
    ]);

    const profitMargin = ((client.profit / client.totalIncome) * 100).toFixed(1);

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

            {/* Client Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xl sm:text-2xl">
                                {client.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{client.name}</h1>
                                <span className={clsx(
                                    'sm:hidden px-2.5 py-0.5 rounded-full text-xs font-bold border',
                                    client.status === 'active'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                )}>
                                    {client.status}
                                </span>
                            </div>
                            <div className="space-y-1 sm:mt-2 mt-1">
                                <p className="text-sm text-slate-600 font-medium">{client.email}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                                        <Phone size={14} />
                                        <span>{client.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                                        <MapPin size={14} />
                                        <span className="line-clamp-1">{client.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                            <Edit2 size={16} />
                            <span className="text-sm font-semibold">Edit</span>
                        </button>
                        <span className={clsx(
                            'hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium items-center',
                            client.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                        )}>
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Income</p>
                        <TrendingUp className="text-green-600 hidden sm:block" size={20} />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">₹{client.totalIncome.toLocaleString()}</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Expense</p>
                        <TrendingDown className="text-red-600 hidden sm:block" size={20} />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-red-600">₹{client.totalExpense.toLocaleString()}</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Net Profit</p>
                        <DollarSign className="text-emerald-600 hidden sm:block" size={20} />
                    </div>
                    <p className={clsx(
                        'text-lg sm:text-2xl font-bold',
                        client.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                    )}>
                        ₹{client.profit.toLocaleString()}
                    </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Margin</p>
                        <div className={clsx(
                            'w-2 h-2 rounded-full hidden sm:block',
                            parseFloat(profitMargin) >= 30 ? 'bg-green-500' : 'bg-yellow-500'
                        )} />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">{profitMargin}%</p>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 sm:p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Transactions</h2>
                            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Recent history</p>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm active:scale-95">
                            <Plus size={18} />
                            <span>Add Transaction</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Floating Action Button */}
                <button className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors">
                    <Plus size={24} />
                </button>

                <div className="p-4 sm:p-6">
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors active:bg-slate-200"
                            >
                                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                                    <div className={clsx(
                                        'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                                        transaction.type === 'income'
                                            ? 'bg-green-100'
                                            : 'bg-red-100'
                                    )}>
                                        {transaction.type === 'income' ? (
                                            <TrendingUp className="text-green-600" size={18} />
                                        ) : (
                                            <TrendingDown className="text-red-600" size={18} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 text-sm sm:text-base leading-tight line-clamp-2">{transaction.description}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{transaction.date}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-md font-medium uppercase tracking-wide">
                                                {transaction.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 pl-2">
                                    <p className={clsx(
                                        'text-sm sm:text-lg font-bold',
                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </p>
                                    <div className="flex items-center gap-1 hidden sm:flex">
                                        <button className="p-1 hover:bg-slate-200 rounded transition-colors" title="Edit">
                                            <Edit2 className="text-slate-400" size={14} />
                                        </button>
                                        <button className="p-1 hover:bg-red-100 rounded transition-colors" title="Delete">
                                            <Trash2 className="text-red-400" size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetails;
