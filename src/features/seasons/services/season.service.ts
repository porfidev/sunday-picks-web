import { isAxiosError } from 'axios';
import { http } from '../../../lib/http.ts';
import type { RequestErrorResponse } from '../../../types/RequestErrorResponse.ts';
import type { CreateSeasonRequestValues } from '../hooks/useCreateSeason.ts';
import type { CreateSeasonResponse, GetSeasonResponse } from '../types.ts';

export type SeasonService = {
  create: (payload: CreateSeasonRequestValues) => Promise<{ data: CreateSeasonResponse }>;
  update: (id: string, payload: CreateSeasonRequestValues) => Promise<{ data: CreateSeasonResponse }>;
  getAll: () => Promise<{ data: { items: GetSeasonResponse[] } }>;
  softDelete: (id: string) => Promise<void>;
};

export const seasonService: SeasonService = {
  async getAll() {
    try {
      const { data } = await http.get<{ items: GetSeasonResponse[] }>('/seasons/', {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al obtener las temporadas',
        );
      }

      throw new Error('Error al obtener las temporadas');
    }
  },
  async create(payload) {
    try {
      const { data } = await http.post<CreateSeasonResponse>('/seasons/', payload, {
        requiresAuth: true,
      });
      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al crear la temporada',
        );
      }

      throw new Error('Error al crear la temporada');
    }
  },
  async update(id, payload) {
    try {
      const { data } = await http.put<CreateSeasonResponse>(`/seasons/${id}`, payload, {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al actualizar la temporada',
        );
      }

      throw new Error('Error al actualizar la temporada');
    }
  },
  async softDelete(id) {
    try {
      await http.delete(`/seasons/${id}`, {
        requiresAuth: true,
      });
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al eliminar la temporada',
        );
      }

      throw new Error('Error al eliminar la temporada');
    }
  },
};
