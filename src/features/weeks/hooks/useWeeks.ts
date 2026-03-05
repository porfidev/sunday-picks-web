import { useCallback, useEffect, useState } from 'react';
import { weekService, type WeekService } from '../services/week.service.ts';
import type { GetWeekResponse } from '../types.ts';

export function useWeeks(service: WeekService = weekService) {
  const [weeks, setWeeks] = useState<GetWeekResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.getAll();
      setWeeks(result.data.items);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener las semanas');
      return null;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const deleteWeek = useCallback(
    async (id: string) => {
      setDeletingId(id);
      setError(null);

      try {
        await service.softDelete(id);
        await fetchWeeks();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al eliminar la semana');
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [fetchWeeks, service],
  );

  useEffect(() => {
    void fetchWeeks();
  }, [fetchWeeks]);

  return {
    weeks,
    loading,
    deletingId,
    error,
    deleteWeek,
    refetch: fetchWeeks,
  };
}
