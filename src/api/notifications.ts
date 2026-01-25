import api from './axios';

export const notificationAPI = {
    saveFCMToken: async (token: string) => {
        const response = await api.post('api/save-fcm-token/', { token });
        return response.data;
    }
};
