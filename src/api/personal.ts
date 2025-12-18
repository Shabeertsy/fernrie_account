import api from './axios';
import type { PersonalTransactionResponse, PersonalTransactionAPIResponse } from '../types';

export const personalAPI = {
    getPersonalTransactions: async (companyTransactionId: number) => {
        const response = await api.get<PersonalTransactionResponse>(`accounts/personal-transactions/${companyTransactionId}/`);
        return response.data;
    },

    getPartnerTransactionDetails: async (partnerId: number | string, transactionId: number | string) => {
        const response = await api.get<PersonalTransactionAPIResponse>(`accounts/personal-transactions/details/${partnerId}/${transactionId}/`);
        return response.data;
    },

    createPersonalTransaction: async (data: any) => {
        const { user, transaction, ...body } = data;
        // Pass user and transaction as query parameters as requested
        const response = await api.post('accounts/personal-transactions/create/', body, {
            params: { user, transaction }
        });
        return response.data;
    },

    updatePersonalTransaction: async (id: number, data: any) => {
        const response = await api.patch(`accounts/personal-transactions/edit/${id}/`, data);
        return response.data;
    },

    deletePersonalTransaction: async (id: number) => {
        await api.delete(`accounts/personal-transactions/edit/${id}/`);
    }
};
