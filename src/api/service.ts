import api from './axios';
import type { Service, CreateServiceData, UpdateServiceData } from '../types/service';

export const serviceAPI = {
    // Get all services (optionally filtered by client)
    getServices: async (clientId?: number) => {
        const params = clientId ? { client: clientId } : {};
        const response = await api.get<Service[]>('accounts/services/', { params });
        return response.data;
    },

    // Get a single service
    getService: async (id: number) => {
        const response = await api.get<Service>(`accounts/services/${id}/`);
        return response.data;
    },

    // Create a new service
    createService: async (data: CreateServiceData) => {
        const response = await api.post<Service>('accounts/services/', data);
        return response.data;
    },

    // Update a service
    updateService: async (id: number, data: UpdateServiceData) => {
        const response = await api.patch<Service>(`accounts/services/${id}/`, data);
        return response.data;
    },

    // Delete a service
    deleteService: async (id: number) => {
        await api.delete(`accounts/services/${id}/`);
    },
};
