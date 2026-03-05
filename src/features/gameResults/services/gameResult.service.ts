import { isAxiosError } from 'axios';
import { http } from '../../../lib/http.ts';
import type { RequestErrorResponse } from '../../../types/RequestErrorResponse.ts';
import type { SaveGameResultItem, SaveGameResultResponse } from '../types.ts';

export type GameResultService = {
  saveMany: (payload: SaveGameResultItem[]) => Promise<{ data: SaveGameResultResponse }>;
};

export const gameResultService: GameResultService = {
  async saveMany(payload) {
    try {
      const { data } = await http.post<SaveGameResultResponse>('/game-results/', payload, {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al guardar resultados',
        );
      }

      throw new Error('Error al guardar resultados');
    }
  },
};
