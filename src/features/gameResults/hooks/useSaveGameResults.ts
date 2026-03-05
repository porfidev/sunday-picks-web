import { useState } from 'react';
import { gameResultService, type GameResultService } from '../services/gameResult.service.ts';
import type { SaveGameResultItem } from '../types.ts';

export function useSaveGameResults(service: GameResultService = gameResultService) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const saveMany = async (payload: SaveGameResultItem[]) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await service.saveMany(payload);
      setSuccessMessage('Resultados guardados correctamente');
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar resultados');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    loading,
    error,
    successMessage,
    saveMany,
    clearMessages,
  };
}

