import { useCallback, useEffect, useState } from 'react';
import { gameService, type GameService } from '../services/game.service.ts';
import type { GetGameResponse } from '../types.ts';

export function useGames(service: GameService = gameService) {
  const [games, setGames] = useState<GetGameResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.getAll();
      setGames(result.data.items);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener los partidos');
      return null;
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void fetchGames();
  }, [fetchGames]);

  return {
    games,
    loading,
    error,
    refetch: fetchGames,
  };
}

