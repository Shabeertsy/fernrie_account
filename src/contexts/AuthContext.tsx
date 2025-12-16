import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthTokens, AuthState } from '../types';
import { authStorage, authAPI } from '../utils/auth';

interface AuthContextType extends AuthState {
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        tokens: null,
        isAuthenticated: false,
        rememberMe: false,
    });

    // Initialize auth state from storage
    useEffect(() => {
        const user = authStorage.getUser();
        const accessToken = authStorage.getAccessToken();
        const refreshToken = authStorage.getRefreshToken();
        const rememberMe = authStorage.getRememberMe();

        if (user && accessToken && refreshToken) {
            setAuthState({
                user,
                tokens: { accessToken, refreshToken },
                isAuthenticated: true,
                rememberMe,
            });
        }
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        try {
            const { user, tokens } = await authAPI.login(email, password);

            authStorage.setTokens(tokens, rememberMe);
            authStorage.setUser(user, rememberMe);

            setAuthState({
                user,
                tokens,
                isAuthenticated: true,
                rememberMe,
            });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            authStorage.clearAuth();
            setAuthState({
                user: null,
                tokens: null,
                isAuthenticated: false,
                rememberMe: false,
            });
        }
    };

    const refreshAccessToken = async () => {
        const refreshToken = authStorage.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const newTokens = await authAPI.refreshToken(refreshToken);
            authStorage.setTokens(newTokens, authState.rememberMe);

            setAuthState(prev => ({
                ...prev,
                tokens: newTokens,
            }));
        } catch (error) {
            // If refresh fails, logout user
            await logout();
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
