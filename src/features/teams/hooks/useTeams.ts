import { useCallback, useEffect, useState } from 'react';
import { teamService, type TeamService } from '../services/team.service.ts';
import type { CreateTeamResponse } from '../types.ts';

export function useTeams(service: TeamService = teamService) {
  const [teams, setTeams] = useState<CreateTeamResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.getAll();
      setTeams(result.data.items);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener los equipos');
      return null;
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    setTeams,
    loading,
    error,
    refetch: fetchTeams,
  };
}
