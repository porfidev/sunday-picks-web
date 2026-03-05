import { isAxiosError } from 'axios';
import { http } from '../../../lib/http.ts';
import type { RequestErrorResponse } from '../../../types/RequestErrorResponse.ts';
import type { CreateGameRequestValues } from '../hooks/useCreateGame.ts';
import type { CreateGameResponse, GetGameResponse } from '../types.ts';

export type GameService = {
  create: (payload: CreateGameRequestValues) => Promise<{ data: CreateGameResponse }>;
  getAll: () => Promise<{ data: { items: GetGameResponse[] } }>;
};

export const gameService: GameService = {
  async getAll() {
    try {
      const { data } = await http.get<{ items: GetGameResponse[] }>('/games/', {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al obtener los partidos',
        );
      }

      throw new Error('Error al obtener los partidos');
    }
  },
  async create(payload) {
    try {
      const { data } = await http.post<CreateGameResponse>('/games/', payload, {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al crear el partido',
        );
      }

      throw new Error('Error al crear el partido');
    }
  },
};
