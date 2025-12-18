import api from './axios';
import type { PersonalTransaction, PartnersResponse } from '../types';

export const partnersAPI = {
    getPartners: async () => {
        const response = await api.get<PartnersResponse>('accounts/partners/');
        return response.data;
    },

    getPartnerTransactions: async (partnerId: number) => {
        const response = await api.get<PersonalTransaction[]>('accounts/partners/transactions/', {
            params: { partner: partnerId }
        });
        return response.data;
    },

    getPartnerTransactionDetails: async (partnerId: number, transactionId: number) => {
        const response = await api.get<PersonalTransaction[]>(`accounts/partners/${partnerId}/transactions/${transactionId}/`);
        return response.data;
    }
};
