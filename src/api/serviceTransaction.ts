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

    // Create a new service transaction
    createServiceTransaction: async (data: CreateServiceTransactionData) => {
        const response = await api.post<ServiceTransaction>('accounts/service-transactions/', data);
        return response.data;
    },

    // Update a service transaction
    updateServiceTransaction: async (id: number, data: UpdateServiceTransactionData) => {
        const response = await api.patch<ServiceTransaction>(`accounts/service-transactions/${id}/`, data);
        return response.data;
    },

    // Delete a service transaction
    deleteServiceTransaction: async (id: number) => {
        await api.delete(`accounts/service-transactions/${id}/`);
    },
};
