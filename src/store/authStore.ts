import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios, { AxiosRequestConfig } from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, rePassword: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
}

// 👇 Extend Axios config to include _retry
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,

          login: async (email: string, password: string) => {
            set({ isLoading: true });
            try {
              const response = await apiClient.post('/jwt/create/', { email, password });
              const { access, refresh } = response.data;

              const userResponse = await apiClient.get('/users/me/', {
                headers: { Authorization: `Bearer ${access}` },
              });
              const userData = userResponse.data;

              set({
                user: userData,
                token: access,
                refreshToken: refresh,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (error) {
              set({ isLoading: false });
              throw new Error('Login failed');
            }
          },

          register: async (username: string, email: string, password: string, rePassword: string) => {
            set({ isLoading: true });
            try {
              await apiClient.post('/users/', {
                username,
                email,
                password,
                re_password: rePassword,
              });
              await get().login(email, password);
            } catch (error) {
              set({ isLoading: false });
              throw new Error('Registration failed');
            }
          },

          logout: () => {
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
            });
            localStorage.clear();
          },

          refreshAuthToken: async () => {
            const { refreshToken } = get();
            if (!refreshToken) {
              get().logout();
              return;
            }
            try {
              const response = await apiClient.post('/jwt/refresh/', { refresh: refreshToken });
              const { access } = response.data;
              set({ token: access });
            } catch (error) {
              get().logout();
              throw new Error('Token refresh failed');
            }
          },
        }),
        {
          name: 'auth-storage',
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            user: state.user,
            token: state.token,
            refreshToken: state.refreshToken,
            isAuthenticated: state.isAuthenticated,
          }),
        }
    )
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await useAuthStore.getState().refreshAuthToken();
          const { token } = useAuthStore.getState();
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
);
