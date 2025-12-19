import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Filter,
    Clock,
    DollarSign,
    Loader2,
    Edit2,
    Trash2,
    Calendar
} from 'lucide-react';
import { serviceTransactionAPI } from '../api/serviceTransaction';
import { serviceAPI } from '../api/service';
import { clientAPI } from '../api/client';
import type { ServiceTransaction, CreateServiceTransactionData } from '../types/serviceTransaction';
import type { Service } from '../types/service';
import type { Client } from '../types/client';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

const Billing: React.FC = () => {
    const [transactions, setTransactions] = useState<ServiceTransaction[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'advance' | 'settled' | 'other'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<ServiceTransaction | null>(null);

    const [formData, setFormData] = useState<CreateServiceTransactionData & { client_id?: number }>({
        service: 0,
        client_id: 0,
        amount: '',
        status: 'other',
        notes: ''
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
        fetchTransactions();
        fetchClients();
        fetchServices();
    }, []);

    useEffect(() => {
        // Filter services by selected client
        if (formData.client_id) {
            const clientServices = services.filter(s => s.client === formData.client_id);
            setFilteredServices(clientServices);
        } else {
            setFilteredServices([]);
        }
    }, [formData.client_id, services]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await serviceTransactionAPI.getServiceTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const data = await clientAPI.getClients();
            setClients(data);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const data = await serviceAPI.getServices();
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { client_id, ...transactionData } = formData;
            if (editingTransaction) {
                await serviceTransactionAPI.updateServiceTransaction(editingTransaction.id, transactionData);
            } else {
                await serviceTransactionAPI.createServiceTransaction(transactionData);
            }
            await fetchTransactions();
            closeModal();
        } catch (error) {
            console.error('Failed to save transaction:', error);
        }
    };

    const handleEdit = (transaction: ServiceTransaction) => {
        const service = services.find(s => s.id === transaction.service);
        setEditingTransaction(transaction);
        setFormData({
            service: transaction.service,
            client_id: service?.client || 0,
            amount: transaction.amount,
            status: transaction.status,
            notes: transaction.notes || ''
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
            service: 0,
            client_id: 0,
            amount: '',
            status: 'other',
            notes: ''
        });
    };

    const getServiceName = (serviceId: number) => {
        const service = services.find(s => s.id === serviceId);
        return service?.service_name || 'Unknown Service';
    };

    const getClientName = (serviceId: number) => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
            const client = clients.find(c => c.id === service.client);
            return client?.name || 'Unknown Client';
        }
        return 'Unknown Client';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'advance':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'settled':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
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

    const filteredTransactions = transactions.filter(transaction => {
        const serviceName = getServiceName(transaction.service).toLowerCase();
        const clientName = getClientName(transaction.service).toLowerCase();
        const matchesSearch = serviceName.includes(searchTerm.toLowerCase()) ||
            clientName.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const advanceAmount = transactions
        .filter(t => t.status === 'advance')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const settledAmount = transactions
        .filter(t => t.status === 'settled')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Billing</h1>
                    <p className="text-xs sm:text-base text-slate-500 mt-0.5">Manage invoices and billing records</p>
                </div>
                {/* Desktop Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="hidden sm:flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
                >
                    <Plus size={20} />
                    <span>Create Invoice</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Total</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">₹{totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-emerald-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Advance</p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">₹{advanceAmount.toLocaleString()}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-blue-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Settled</p>
                            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">₹{settledAmount.toLocaleString()}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-emerald-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Transactions</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{transactions.length}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Calendar className="text-slate-600" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors"
            >
                <Plus size={24} />
            </button>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
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
                            <option value="advance">Advance</option>
                            <option value="settled">Settled</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="space-y-3 sm:hidden">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{getClientName(transaction.service)}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{getServiceName(transaction.service)}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                                        {getStatusLabel(transaction.status)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Clock size={14} />
                                            <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">₹{parseFloat(transaction.amount).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(transaction)}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{getClientName(transaction.service)}</td>
                                            <td className="px-6 py-4 text-sm text-slate-700">{getServiceName(transaction.service)}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{parseFloat(transaction.amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                                                    {getStatusLabel(transaction.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(transaction)}
                                                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(transaction.id)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12 bg-white sm:bg-transparent rounded-xl border border-slate-200 sm:border-none">
                            <Calendar className="mx-auto text-slate-300" size={48} />
                            <p className="text-slate-500 mt-2">No transactions found</p>
                        </div>
                    )}
                </>
            )}

            {/* Transaction Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingTransaction ? "Edit Transaction" : "Create Invoice"}
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
                        <select
                            required
                            value={formData.client_id}
                            onChange={(e) => setFormData({ ...formData, client_id: parseInt(e.target.value), service: 0 })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            disabled={!!editingTransaction}
                        >
                            <option value={0}>Select Client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service *</label>
                        <select
                            required
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            disabled={!formData.client_id || !!editingTransaction}
                        >
                            <option value={0}>Select Service</option>
                            {filteredServices.map(service => (
                                <option key={service.id} value={service.id}>{service.service_name}</option>
                            ))}
                        </select>
                        {formData.client_id && filteredServices.length === 0 && (
                            <p className="text-xs text-slate-500 mt-1">No services found for this client</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                        <select
                            required
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'advance' | 'settled' | 'other' })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        >
                            <option value="other">Other</option>
                            <option value="advance">Advance</option>
                            <option value="settled">Settled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-20"
                            placeholder="Add notes..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
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

export default Billing;
