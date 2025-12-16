import React, { useState } from 'react';
import {
    Search,
    Plus,
    Filter,
    FileText,
    Clock,
    AlertCircle,
    DollarSign,
    ChevronRight,
    Calendar
} from 'lucide-react';

interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    items: number;
}

const Billing: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

    // Mock data - replace with API call
    const [invoices] = useState<Invoice[]>([
        {
            id: '1',
            invoiceNumber: 'INV-2024-001',
            clientName: 'ABC Corporation',
            date: '2024-03-01',
            dueDate: '2024-03-15',
            amount: 15000,
            status: 'paid',
            items: 3
        },
        {
            id: '2',
            invoiceNumber: 'INV-2024-002',
            clientName: 'XYZ Limited',
            date: '2024-03-05',
            dueDate: '2024-03-19',
            amount: 25000,
            status: 'pending',
            items: 5
        },
        {
            id: '3',
            invoiceNumber: 'INV-2024-003',
            clientName: 'Tech Solutions Inc',
            date: '2024-02-20',
            dueDate: '2024-03-05',
            amount: 18500,
            status: 'overdue',
            items: 2
        },
        {
            id: '4',
            invoiceNumber: 'INV-2024-004',
            clientName: 'Digital Agency',
            date: '2024-03-10',
            dueDate: '2024-03-24',
            amount: 42000,
            status: 'pending',
            items: 8
        },
        {
            id: '5',
            invoiceNumber: 'INV-2024-005',
            clientName: 'Consulting Group',
            date: '2024-03-12',
            dueDate: '2024-03-26',
            amount: 12000,
            status: 'paid',
            items: 2
        }
    ]);

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const pendingAmount = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const overdueAmount = invoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'overdue':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // Mobile Invoice Card
    const InvoiceCard = ({ invoice }: { invoice: Invoice }) => (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-slate-900">{invoice.clientName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{invoice.invoiceNumber}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
            </div>
            
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={14} />
                        <span>Due: {invoice.dueDate}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">₹{invoice.amount.toLocaleString()}</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Billing</h1>
                    <p className="text-xs sm:text-base text-slate-500 mt-0.5">Manage invoices and billing records</p>
                </div>
                {/* Desktop Button */}
                <button className="hidden sm:flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm active:scale-95">
                    <Plus size={20} />
                    <span>Create Invoice</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Revenue</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-emerald-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Pending</p>
                            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">₹{pendingAmount.toLocaleString()}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-amber-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Overdue</p>
                            <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">₹{overdueAmount.toLocaleString()}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-red-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Invoices</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{invoices.length}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-slate-600" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <button className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors">
                <Plus size={24} />
            </button>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:flex-none">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full sm:w-auto pl-9 pr-8 py-2.5 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Mobile List View */}
            <div className="space-y-3 sm:hidden">
                {filteredInvoices.map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice #</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Issued Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{invoice.clientName}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{invoice.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.date}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredInvoices.length === 0 && (
                <div className="text-center py-12 bg-white sm:bg-transparent rounded-xl border border-slate-200 sm:border-none">
                    <FileText className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-500 mt-2">No invoices found</p>
                </div>
            )}
        </div>
    );
};

export default Billing;
