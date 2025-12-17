import api from './axios';
import type { PersonalTransactionResponse } from '../types';

export const personalAPI = {
    getPersonalTransactions: async (companyTransactionId: number) => {
        const response = await api.get<PersonalTransactionResponse>(`accounts/personal-transactions/${companyTransactionId}/`);
        return response.data;
    }
};
