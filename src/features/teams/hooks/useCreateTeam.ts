import { useState } from 'react';
import { teamService, type TeamService } from '../services/team.service.ts';

export type CreateTeamRequestValues = {
  name: string;
  logo: File | null;
};

export function useCreateTeam(service: TeamService = teamService) {
  const [values, setValues] = useState<CreateTeamRequestValues>({
    name: '',
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.create(values);
      console.log('result create TEAM', result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el equipo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.update(id, values);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar el equipo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setValues,
    loading,
    submit,
    update,
    error,
  };
}
