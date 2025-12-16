import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (store: any) => {
    api.interceptors.request.use(
      (config) => {
        const token = store.getState().accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = store.getState().refreshToken;
            
            if (!refreshToken) {
                // No refresh token, logout
                store.getState().logout();
                return Promise.reject(error);
            }

            // Call refresh token endpoint
            const response = await axios.post(`${BASE_URL}/api/refresh-token/`, {
              refresh: refreshToken,
            });

            const { access } = response.data;
            
            // Update store
            store.getState().setAccessToken(access);
            
            // Update header and retry original request
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
            
          } catch (refreshError) {
            // Refresh failed, logout
            store.getState().logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
};

export default api;
