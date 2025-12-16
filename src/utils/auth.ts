import type { AuthTokens, User } from '../types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const REMEMBER_ME_KEY = 'rememberMe';

export const authStorage = {
    getAccessToken: (): string | null => {
        return localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
    },

    getUser: (): User | null => {
        const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    getRememberMe: (): boolean => {
        return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    },

    setTokens: (tokens: AuthTokens, rememberMe: boolean): void => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        if (rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, 'true');
        }
        console.log(`[Auth] Tokens saved to ${rememberMe ? 'localStorage' : 'sessionStorage'}`);
        console.log('[Auth] Remember me:', rememberMe);
    },

    setUser: (user: User, rememberMe: boolean): void => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(user));
    },

    clearAuth: (): void => {
        // Clear from both storages
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem(ACCESS_TOKEN_KEY);
            storage.removeItem(REFRESH_TOKEN_KEY);
            storage.removeItem(USER_KEY);
        });
        localStorage.removeItem(REMEMBER_ME_KEY);
    },
};

// Mock API calls - Replace with real API endpoints
export const authAPI = {
    login: async (email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock credentials - accept both old and new email formats
        const validCredentials = [
            { email: 'admin@fernrei.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
            { email: 'admin@masjid.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
            { email: 'user@fernrei.com', password: 'user123', name: 'Regular User', role: 'user' as const }
        ];

        const credential = validCredentials.find(c => c.email === email && c.password === password);

        if (credential) {
            console.log('[Auth] Login successful for:', credential.email);
            return {
                user: {
                    id: '1',
                    name: credential.name,
                    email: credential.email,
                    role: credential.role,
                },
                tokens: {
                    accessToken: 'mock-access-token-' + Date.now(),
                    refreshToken: 'mock-refresh-token-' + Date.now(),
                },
            };
        }
        console.error('[Auth] Login failed - Invalid credentials');
        throw new Error('Invalid credentials');
    },

    refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock response - replace with real API call
        return {
            accessToken: 'new-access-token-' + Date.now(),
            refreshToken: refreshToken,
        };
    },

    logout: async (): Promise<void> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // In real app, invalidate tokens on server
    },
};
