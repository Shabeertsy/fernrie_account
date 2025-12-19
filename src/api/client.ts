import api from './axios';
import type { Client, CreateClientData, UpdateClientData } from '../types/client';

export const clientAPI = {
    // Get all clients
    getClients: async () => {
        const response = await api.get<Client[]>('accounts/clients/');
        return response.data;
    },

    // Get a single client
    getClient: async (id: number) => {
        const response = await api.get<Client>(`accounts/clients/${id}/`);
        return response.data;
    },

    // Create a new client
    createClient: async (data: CreateClientData) => {
        const response = await api.post<Client>('accounts/clients/', data);
        return response.data;
    },

    // Update a client
    updateClient: async (id: number, data: UpdateClientData) => {
        const response = await api.patch<Client>(`accounts/clients/${id}/`, data);
        return response.data;
    },

    // Delete a client
    deleteClient: async (id: number) => {
        await api.delete(`accounts/clients/${id}/`);
    },
};
