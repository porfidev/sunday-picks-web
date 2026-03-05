import { useCallback, useEffect, useState } from 'react';
import { seasonService, type SeasonService } from '../services/season.service.ts';
import type { GetSeasonResponse } from '../types.ts';

export function useSeasons(service: SeasonService = seasonService) {
  const [seasons, setSeasons] = useState<GetSeasonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.getAll();
      setSeasons(result.data.items);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener las temporadas');
      return null;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const deleteSeason = useCallback(
    async (id: string) => {
      setDeletingId(id);
      setError(null);

      try {
        await service.softDelete(id);
        await fetchSeasons();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al eliminar la temporada');
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [fetchSeasons, service],
  );

  useEffect(() => {
    void fetchSeasons();
  }, [fetchSeasons]);

  return {
    seasons,
    loading,
    deletingId,
    error,
    deleteSeason,
    refetch: fetchSeasons,
  };
}
