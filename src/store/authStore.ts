import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios, { AxiosRequestConfig } from 'axios';

export interface User {
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
  register: (
      username: string,
      email: string,
      password: string,
      rePassword: string
  ) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
}

// 👇 Extend Axios config for retry flag
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL =
    import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuthStore = create<AuthState>()(
    persist<AuthState>(
        (set, get) => ({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,

          login: async (email: string, password: string) => {
            set({ isLoading: true });
            try {
              const response = await apiClient.post('/jwt/create/', {
                email,
                password,
              });
              const { access, refresh } = response.data;

              const userResponse = await apiClient.get('/users/me/', {
                headers: { Authorization: `Bearer ${access}` },
              });

              set({
                user: userResponse.data,
                token: access,
                refreshToken: refresh,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (err) {
              console.error('Login error:', err);
              set({ isLoading: false });
              throw new Error('Login failed');
            }
          },

          register: async (
              username: string,
              email: string,
              password: string,
              rePassword: string
          ) => {
            set({ isLoading: true });
            try {
              await apiClient.post('/users/', {
                username,
                email,
                password,
                re_password: rePassword,
              });
              await get().login(email, password);
            } catch (err) {
              console.error('Registration error:', err);
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
              const response = await apiClient.post('/jwt/refresh/', {
                refresh: refreshToken,
              });
              const { access } = response.data;
              set({ token: access });
            } catch (err) {
              console.error('Token refresh error:', err);
              get().logout();
              throw new Error('Token refresh failed');
            }
          },
        }),
        {
          name: 'auth-storage',
          storage: createJSONStorage(() => localStorage),
          partialize: (state): Partial<AuthState> => ({
            user: state.user,
            token: state.token,
            refreshToken: state.refreshToken,
            isAuthenticated: state.isAuthenticated,
          }),
        }
    )
);

// ⛑️ Automatic token refresh on 401
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
