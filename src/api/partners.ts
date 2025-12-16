import api from './axios';

export interface Partner {
    id: number;
    name: string;
    // Add other fields if necessary
}

export const partnersAPI = {
    getPartners: async () => {
        const response = await api.get<Partner[]>('partners/');
        return response.data;
    }
};
