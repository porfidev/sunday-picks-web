import { isAxiosError } from 'axios';
import { http } from '../../../lib/http.ts';
import type { CreateTeamRequestValues } from '../hooks/useCreateTeam.ts';
import type { CreateTeamResponse, GetTeamsResponse } from '../types.ts';
import type { RequestErrorResponse } from '../../../types/RequestErrorResponse.ts';

export type TeamService = {
  create: (payload: CreateTeamRequestValues) => Promise<{ data: CreateTeamResponse }>;
  update: (id: string, payload: CreateTeamRequestValues) => Promise<{ data: CreateTeamResponse }>;
  getAll: () => Promise<{ data: { items: GetTeamsResponse[] } }>;
};

export const teamService: TeamService = {
  async getAll() {
    try {
      const { data } = await http.get<{ items: GetTeamsResponse[] }>('/teams/', {
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al obtener los equipos',
        );
      }

      throw new Error('Error al obtener los equipos');
    }
  },

  async create(payload) {
    try {
      const formData = new FormData();
      formData.append('name', payload.name);

      if (payload.logo) {
        formData.append('logo', payload.logo);
      }

      const { data } = await http.post<CreateTeamResponse>('/teams/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        requiresAuth: true,
      });

      return { data };
    } catch (error) {
      if (isAxiosError<RequestErrorResponse>(error)) {
        throw new Error(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Error al crear el equipo',
        );
      }

      throw new Error('Error al crear el equipo');
    }
  },

  async update(id, payload) {
    try {
      const formData = new FormData();
      formData.append('name', payload.name);

      if (payload.logo) {
        formData.append('logo', payload.logo);
      }

      const { data } = await http.post<CreateTeamResponse>(`/teams/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
};
