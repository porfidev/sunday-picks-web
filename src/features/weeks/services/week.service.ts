import type { CreateWeekRequestValues } from '../hooks/useCreateWeek.ts';
import type { CreateWeekResponse, GetWeekResponse } from '../types.ts';
import { isAxiosError } from 'axios';
import type { RequestErrorResponse } from '../../../types/RequestErrorResponse.ts';
import { http } from '../../../lib/http.ts';

export type WeekService = {
  create: (payload: CreateWeekRequestValues) => Promise<{ data: CreateWeekResponse }>;
  update: (id: string, payload: CreateWeekRequestValues) => Promise<{ data: CreateWeekResponse }>;
  getAll: () => Promise<{ data: { items: GetWeekResponse[] } }>;
  softDelete: (id: string) => Promise<void>;
};

export const weekService: WeekService = {
  async getAll() {
    try {
      const { data } = await http.get<{ items: GetWeekResponse[] }>('/weeks/', {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al obtener las semanas',
        );
      }

      throw new Error('Error al obtener las semanas');
    }
  },
  async create(payload) {
    try {
      const { data } = await http.post<CreateWeekResponse>('/weeks/', payload, {
        requiresAuth: true,
      });
      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al crear la semana',
        );
      }

      throw new Error('Error al crear la semana');
    }
  },
  async update(id, payload) {
    try {
      const { data } = await http.put<CreateWeekResponse>(`/weeks/${id}`, payload, {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al actualizar el equipo',
        );
      }

      throw new Error('Error al actualizar el equipo');
    }
  },
  async softDelete(id) {
    try {
      await http.delete(`/weeks/${id}`, {
        requiresAuth: true,
      });
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al eliminar la semana',
        );
      }

      throw new Error('Error al eliminar la semana');
    }
  },
};
