import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Hook to ensure auth state persists across page refreshes
 * This hook runs on app initialization to validate stored auth state
 */
export const useAuthPersistence = () => {
    const { isAuthenticated, accessToken, refreshToken, logout } = useAuthStore();

    useEffect(() => {
        // Check if we have auth state but missing tokens
        if (isAuthenticated && (!accessToken || !refreshToken)) {
            console.warn('[Auth] Auth state inconsistent - missing tokens, logging out');
            logout();
            return;
        }

        // Log current auth state on mount
        if (isAuthenticated) {
            console.log('[Auth] User is authenticated on app load', {
                hasAccessToken: !!accessToken,
                hasRefreshToken: !!refreshToken,
            });
        } else {
            console.log('[Auth] No authenticated user on app load');
        }
    }, []);

    return null;
};
