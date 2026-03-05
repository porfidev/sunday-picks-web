import { isAxiosError } from 'axios';
import type { RequestErrorResponse } from '../../../types/RequestErrorResponse.ts';
import { http } from '../../../lib/http.ts';
import type { CreateUserRequestValues, UpdateUserRequestValues } from '../hooks/useCreateUser.ts';
import type { CreateUserResponse, GetUsersResponse } from '../types.ts';

export type UserService = {
  create: (payload: CreateUserRequestValues) => Promise<{ data: CreateUserResponse }>;
  update: (id: string, payload: UpdateUserRequestValues) => Promise<{ data: CreateUserResponse }>;
  getAll: () => Promise<{ data: { items: GetUsersResponse[] } }>;
};

export const userService: UserService = {
  async getAll() {
    try {
      const { data } = await http.get<{ items: GetUsersResponse[] }>('/users/', {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al obtener los usuarios',
        );
      }

      throw new Error('Error al obtener los usuarios');
    }
  },

  async create(payload) {
    try {
      const { data } = await http.post<CreateUserResponse>('/users/', payload, {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ?? error.response?.data?.error ?? 'Error al crear el usuario',
        );
      }

      throw new Error('Error al crear el usuario');
    }
  },

  async update(id, payload) {
    try {
      const { data } = await http.put<CreateUserResponse>(`/users/${id}`, payload, {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al actualizar el usuario',
        );
      }

      throw new Error('Error al actualizar el usuario');
    }
  },
};
