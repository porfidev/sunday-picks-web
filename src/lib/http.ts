import axios, { isAxiosError } from 'axios';
import {
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  mergeRefreshAuthData,
} from '../features/auth/lib/authSession.ts';
import type { LoginResponse } from '../features/auth/types.ts';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ej: https://api.tuapp.com
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshHttp = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

http.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (config.requiresAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest.url ?? '';
    const isRefreshRequest = requestUrl.includes('/auth/refresh');

    if (
      status !== 401 ||
      !originalRequest.requiresAuth ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            return null;
          }

          const { data } = await refreshHttp.post<LoginResponse>('/auth/refresh', {
            refresh_token: refreshToken,
          });

          const nextAuthData = mergeRefreshAuthData(data);
          return nextAuthData?.access_token ?? null;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const nextAccessToken = await refreshPromise;

      if (!nextAccessToken) {
        clearAuthData();
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      clearAuthData();
      return Promise.reject(refreshError);
    }
  },
);
