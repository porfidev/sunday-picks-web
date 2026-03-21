import { AxiosError, isAxiosError } from 'axios';
import { http } from '../../../lib/http.ts';
import type { LoginRequestValues } from '../hooks/useLogin.ts';
import type { ChangePasswordRequestValues } from '../hooks/useChangePassword.ts';
import type { ChangePasswordResponse, LoginResponse } from '../types.ts';
import type { RequestErrorResponse } from '../../../types/RequestErrorResponse.ts';

export type AuthService = {
  login: (payload: LoginRequestValues) => Promise<{ data: LoginResponse }>;
  changePassword: (
    id: string,
    payload: ChangePasswordRequestValues,
  ) => Promise<{ data: ChangePasswordResponse }>;
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

  async changePassword(id, payload) {
    try {
      const { data } = await http.patch<ChangePasswordResponse>(`/users/${id}/password`, payload, {
        requiresAuth: true,
      });
      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al cambiar la contraseña',
        );
      }

      throw new Error('Error al actualizar la contraseña');
    }
  },
};
