import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import api from '../api/axios';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  isAdmin: boolean;

  login: (identifier: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

const storage: StateStorage = {
  getItem: (name: string): string | null => {
    const local = localStorage.getItem(name);
    if (local) return local;
    return sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      const rememberMe = parsed.state?.rememberMe;

      if (rememberMe) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch (e) {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      rememberMe: false,
      isAdmin: false,

      login: async (identifier, password, rememberMe) => {
        try {

          const response = await api.post('/accounts/login/', {
            email: identifier,
            password,
          });

          const { access, refresh, user, is_admin } = response.data;

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            rememberMe,
            isAdmin: is_admin,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          rememberMe: false,
          isAdmin: false,
        });
        localStorage.removeItem('auth-storage');
        sessionStorage.removeItem('auth-storage');
      },

      setAccessToken: (token) => set({ accessToken: token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
