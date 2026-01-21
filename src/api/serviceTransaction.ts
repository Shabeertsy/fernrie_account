import api from './axios';
import type { ServiceTransaction, CreateServiceTransactionData, UpdateServiceTransactionData } from '../types/serviceTransaction';

export const serviceTransactionAPI = {
    // Get all service transactions (optionally filtered by service)
    getServiceTransactions: async (serviceId?: number) => {
        const params = serviceId ? { service: serviceId } : {};
        const response = await api.get<ServiceTransaction[]>('accounts/service-transactions/', { params });
        return response.data;
    },

    // Get a single service transaction
    getServiceTransaction: async (id: number) => {
        const response = await api.get<ServiceTransaction>(`accounts/service-transactions/${id}/`);
        return response.data;
    },

    // Get transactions by client with summary
    getServiceTransactionsByClient: async (clientId: number, filters?: { transaction_type?: string; status?: string }) => {
        const params = new URLSearchParams();
        if (filters?.transaction_type) params.append('transaction_type', filters.transaction_type);
        if (filters?.status) params.append('status', filters.status);

        const url = `accounts/clients/${clientId}/transactions/${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await api.get<{
            client: { id: number; name: string; email: string };
            summary: { total_transactions: number; total_income: number; total_expense: number; net_profit: number };
            transactions: ServiceTransaction[];
        }>(url);
        return response.data;
    },

    // Get transactions by service with summary
    getServiceTransactionsByService: async (serviceId: number, filters?: { transaction_type?: string; status?: string }) => {
        const params = new URLSearchParams();
        if (filters?.transaction_type) params.append('transaction_type', filters.transaction_type);
        if (filters?.status) params.append('status', filters.status);

        const url = `accounts/services/${serviceId}/transactions/${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await api.get<{
            service: { id: number; service_name: string; client_name: string; amount: number; is_active: boolean; is_closed: boolean };
            summary: { total_transactions: number; total_income: number; total_expense: number; net_profit: number };
            transactions: ServiceTransaction[];
        }>(url);
        return response.data;
    },

    // Create a new service transaction
    createServiceTransaction: async (data: CreateServiceTransactionData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
            }
        });
        // Axios automatically sets Content-Type to multipart/form-data when body is FormData
        const response = await api.post<ServiceTransaction>('accounts/service-transactions/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Update a service transaction
    updateServiceTransaction: async (id: number, data: UpdateServiceTransactionData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
            }
        });
        const response = await api.patch<ServiceTransaction>(`accounts/service-transactions/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete a service transaction
    deleteServiceTransaction: async (id: number) => {
        await api.delete(`accounts/service-transactions/${id}/`);
    },
};
