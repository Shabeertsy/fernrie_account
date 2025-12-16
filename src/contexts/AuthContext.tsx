import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../types';
import { useAuthStore } from '../store/useAuthStore';

interface AuthContextType extends AuthState {
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { 
        user, 
        accessToken, 
        refreshToken, 
        isAuthenticated, 
        rememberMe, 
        login: storeLogin, 
        logout: storeLogout 
    } = useAuthStore();

    const login = async (email: string, password: string, rememberMe: boolean) => {
        await storeLogin(email, password, rememberMe);
    };

    const logout = async () => {
        storeLogout();
    };

    const refreshAccessToken = async () => {
        // Handled by axios interceptors automatically
        console.log('Manual token refresh requested - handled by interceptors');
    };

    const authState: AuthState = {
        user,
        tokens: accessToken && refreshToken ? { accessToken, refreshToken } : null,
        isAuthenticated,
        rememberMe,
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
