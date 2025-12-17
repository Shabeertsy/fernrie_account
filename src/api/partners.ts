import api from './axios';
import type { PersonalTransaction } from '../types';

export interface Partner {
    id: number;
    name: string;
    // Add other fields if necessary
}

export const partnersAPI = {
    getPartners: async () => {
        const response = await api.get<Partner[]>('accounts/partners/');
        return response.data;
    },
    
    getPartnerTransactions: async (partnerId: number) => {
        const response = await api.get<PersonalTransaction[]>('accounts/partner-transactions/', {
            params: { partner: partnerId }
        });
        return response.data;
    }
};
