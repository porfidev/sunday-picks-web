import { AxiosError } from 'axios';
import { http } from '../../../lib/http.ts';
import type { LoginRequestValues } from '../hooks/useLogin.ts';
import type { LoginResponse } from '../types.ts';

export type AuthService = {
  login: (payload: LoginRequestValues) => Promise<{ data: LoginResponse }>;
};

export const authService: AuthService = {
  async login(payload) {
    try {
      const { data } = await http.post<LoginResponse>('/auth/login', payload);
      return { data };
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      throw new Error(axiosError.response?.data?.error ?? 'Error al iniciar sesión');
    }
  },
};
