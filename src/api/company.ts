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

    getTransactionRequests: async (month?: number, year?: number) => {
        const params: any = {};
        if (month) params.month = month;
        if (year) params.year = year;

        const response = await api.get<CompanyTransaction[]>('accounts/transaction-requests/', { params });
        return response.data;
    },

    getPartnerCompanyTransactions: async (partnerId?: number, month?: number, year?: number) => {
        const params: any = {};
        if (partnerId) params.partner = partnerId;
        if (month) params.month = month;
        if (year) params.year = year;

        const response = await api.get<{ count: number, next: string | null, previous: string | null, results: CompanyTransaction[] }>('accounts/company-transactions/partners/', { params });
        return response.data;
    },

    getSplitTransactions: async (personId?: number, isClosed?: boolean, page: number = 1) => {
        const params: any = { page };
        if (personId) params.person = personId;
        if (isClosed !== undefined) params.is_closed = isClosed;

        const response = await api.get<{ count: number, next: string | null, previous: string | null, results: CompanyTransaction[] }>('accounts/split-transactions/', { params });
        return response.data;
    },

    approveTransactionRequest: async (id: number, status: 'approve' | 'reject') => {
        const response = await api.patch<CompanyTransaction>(`accounts/transaction-requests/${id}/approve/`, { admin_status: status });
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
    },

    // Split Transaction APIs
    getSplitTransactions: async (month?: number, year?: number, page: number = 1, person?: number) => {
        const params: any = { page };
        if (month) params.month = month;
        if (year) params.year = year;
        if (person) params.person = person;
        
        const response = await api.get<{ count: number, next: string | null, previous: string | null, results: CompanyTransaction[] }>('accounts/split-transactions/', { params });
        return response.data;
    },

    getSplitTransaction: async (id: number) => {
        const response = await api.get<CompanyTransaction>(`accounts/split-transactions/${id}/`);
        return response.data;
    },

    createSplitTransaction: async (data: FormData) => {
        const response = await api.post<CompanyTransaction>('accounts/split-transactions/create/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteSplitTransaction: async (id: number) => {
        await api.delete(`accounts/split-transactions/${id}/`);
    },
    
    updateSplitTransaction: async (id: number, data: FormData) => {
         const response = await api.patch<CompanyTransaction>(`accounts/split-transactions/${id}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
