import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

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

      // Don't logout on network errors
      if (!error.response) {
        console.error('[Auth] Network error - not logging out');
        return Promise.reject(error);
      }

      // Check if error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = store.getState().refreshToken;

          if (!refreshToken) {
            console.log('[Auth] No refresh token available - logging out');
            store.getState().logout();
            return Promise.reject(error);
          }

          console.log('[Auth] Attempting to refresh access token...');

          // Call refresh token endpoint
          const response = await axios.post(`${BASE_URL}api/refresh-token/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;

          console.log('[Auth] Access token refreshed successfully');

          // Update store
          store.getState().setAccessToken(access);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);

        } catch (refreshError: any) {
          // Only logout if refresh token is invalid (401)
          if (refreshError.response?.status === 401) {
            console.log('[Auth] Refresh token invalid - logging out');
            store.getState().logout();
          } else {
            console.error('[Auth] Token refresh failed but not logging out:', refreshError.message);
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
