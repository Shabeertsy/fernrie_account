import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, TrendingUp, TrendingDown, DollarSign, Plus, Edit2, Trash2,
    Phone, MapPin, Calendar, Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { clientAPI } from '../api/client';
import { serviceAPI } from '../api/service';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import type { Client } from '../types/client';
import type { Service, CreateServiceData } from '../types/service';

const ClientDetails: React.FC = () => {
    const { id } = useParams();
    const clientId = parseInt(id || '0');

    const [client, setClient] = useState<Client | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'transactions' | 'services'>('transactions');
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [serviceFormData, setServiceFormData] = useState<CreateServiceData>({
        client: clientId,
        service_name: '',
        description: '',
        start_date: '',
        end_date: '',
        is_active: true,
        amount: '',
        is_closed: false
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
        fetchClient();
        fetchServices();
    }, [clientId]);

    const fetchClient = async () => {
        try {
            const data = await clientAPI.getClient(clientId);
            setClient(data);
        } catch (error) {
            console.error('Failed to fetch client:', error);
        }
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await serviceAPI.getServices(clientId);
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingService) {
                await serviceAPI.updateService(editingService.id, serviceFormData);
            } else {
                await serviceAPI.createService({ ...serviceFormData, client: clientId });
            }
            await fetchServices();
            closeServiceModal();
        } catch (error) {
            console.error('Failed to save service:', error);
        }
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setServiceFormData({
            client: service.client,
            service_name: service.service_name,
            description: service.description || '',
            start_date: service.start_date,
            end_date: service.end_date || '',
            is_active: service.is_active,
            amount: service.amount,
            is_closed: service.is_closed
        });
        setIsServiceModalOpen(true);
    };

    const handleDeleteService = (id: number) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Service',
            message: 'Are you sure you want to delete this service? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            isLoading: false,
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, isLoading: true }));
                try {
                    await serviceAPI.deleteService(id);
                    await fetchServices();
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error('Failed to delete service:', error);
                    setConfirmDialog(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    const closeServiceModal = () => {
        setIsServiceModalOpen(false);
        setEditingService(null);
        setServiceFormData({
            client: clientId,
            service_name: '',
            description: '',
            start_date: '',
            end_date: '',
            is_active: true,
            amount: '',
            is_closed: false
        });
    };

    if (!client) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    const profit = (client.profit !== undefined) ? client.profit :
        ((client.total_income || 0) - (client.total_expense || 0));
    const profitMargin = client.total_income ? ((profit / client.total_income) * 100).toFixed(1) : '0.0';

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
                                    {client.phone && (
                                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                                            <Phone size={14} />
                                            <span>{client.phone}</span>
                                        </div>
                                    )}
                                    {client.address && (
                                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                                            <MapPin size={14} />
                                            <span className="line-clamp-1">{client.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <span className={clsx(
                        'hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium items-center',
                        client.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                    )}>
                        {(client.status?.charAt(0).toUpperCase() ?? '') + (client.status?.slice(1) ?? '') || 'Active'}
                    </span>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Income</p>
                        <TrendingUp className="text-green-600 hidden sm:block" size={20} />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">₹{(client.total_income || 0).toLocaleString()}</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Expense</p>
                        <TrendingDown className="text-red-600 hidden sm:block" size={20} />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-red-600">₹{(client.total_expense || 0).toLocaleString()}</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Net Profit</p>
                        <DollarSign className="text-emerald-600 hidden sm:block" size={20} />
                    </div>
                    <p className={clsx(
                        'text-lg sm:text-2xl font-bold',
                        profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                    )}>
                        ₹{profit.toLocaleString()}
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

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'transactions'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Transactions
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'services'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Services
                </button>
            </div>

            {/* Transactions Section */}
            {activeTab === 'transactions' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-4 sm:p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Transactions</h2>
                                <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Recent history</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="text-center py-12 text-slate-500">
                            <p>No transactions found</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Services Section */}
            {activeTab === 'services' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-4 sm:p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Services</h2>
                                <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Manage client services</p>
                            </div>
                            <button
                                onClick={() => setIsServiceModalOpen(true)}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
                            >
                                <Plus size={18} />
                                <span>Add Service</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile FAB */}
                    <button
                        onClick={() => setIsServiceModalOpen(true)}
                        className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors"
                    >
                        <Plus size={24} />
                    </button>

                    <div className="p-4 sm:p-6">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-emerald-600" size={32} />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <Link
                                            key={service.id}
                                            to={`/services/${service.id}`}
                                            className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-2 mb-2">
                                                        <h3 className="font-semibold text-slate-900">{service.service_name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            {service.is_active ? (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-full font-medium">Inactive</span>
                                                            )}
                                                            {service.is_closed && (
                                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">Closed</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {service.description && (
                                                        <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            <span>{new Date(service.start_date).toLocaleDateString()}</span>
                                                        </div>
                                                        {service.end_date && (
                                                            <>
                                                                <span>→</span>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar size={12} />
                                                                    <span>{new Date(service.end_date).toLocaleDateString()}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <p className="text-lg font-bold text-emerald-600">₹{parseFloat(service.amount).toLocaleString()}</p>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleEditService(service);
                                                            }}
                                                            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDeleteService(service.id);
                                                            }}
                                                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-500">
                                        <p>No services found. Add your first service to get started!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Service Modal */}
            <Modal
                isOpen={isServiceModalOpen}
                onClose={closeServiceModal}
                title={editingService ? "Edit Service" : "Add New Service"}
                size="sm"
            >
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service Name *</label>
                        <input
                            type="text"
                            required
                            value={serviceFormData.service_name}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, service_name: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="Service name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={serviceFormData.description}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-20"
                            placeholder="Service description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
                            <input
                                type="date"
                                required
                                value={serviceFormData.start_date}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, start_date: e.target.value })}
                                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={serviceFormData.end_date}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, end_date: e.target.value })}
                                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            value={serviceFormData.amount}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, amount: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={serviceFormData.is_active}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, is_active: e.target.checked })}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={serviceFormData.is_closed}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, is_closed: e.target.checked })}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Closed</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                    >
                        {editingService ? 'Update Service' : 'Add Service'}
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

export default ClientDetails;
