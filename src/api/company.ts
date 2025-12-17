import api from './axios';
import type { CompanyTransaction } from '../types';

export const companyAPI = {
    getTransactions: async (month?: number, year?: number, page: number = 1, person?: number) => {
        const params: any = { page };
        if (month) params.month = month;
        if (year) params.year = year;
        if (person) params.person = person;
        
        const response = await api.get<{ count: number, next: string | null, previous: string | null, results: CompanyTransaction[] }>('accounts/company-transactions/', { params });
        return response.data;
    },

    getTransaction: async (id: number) => {
        const response = await api.get<CompanyTransaction>(`accounts/company-transactions/${id}/`);
        return response.data;
    },

    createTransaction: async (data: FormData) => {
        const response = await api.post<CompanyTransaction>('accounts/company-transactions/create/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteTransaction: async (id: number) => {
        await api.delete(`accounts/company-transactions/${id}/`);
    },
    
    updateTransaction: async (id: number, data: FormData) => {
         const response = await api.patch<CompanyTransaction>(`accounts/company-transactions/${id}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
