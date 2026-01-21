import api from './axios';
import type { DashboardStats } from '../types/dashboard';

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get('api/dashboard-stats/');
    return response.data;
};
