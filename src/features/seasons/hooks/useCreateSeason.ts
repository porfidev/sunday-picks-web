import { useState } from 'react';
import type { CreateSeasonValues } from '../../../components/organisms/SeasonsForm';
import { seasonService, type SeasonService } from '../services/season.service.ts';

export type CreateSeasonRequestValues = {
  name: string;
};

export function useCreateSeason(service: SeasonService = seasonService) {
  const [values, setValues] = useState<CreateSeasonValues>({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.create(values);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear la temporada');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const upload = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.update(id, values);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar la temporada');
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
    upload,
    error,
  };
}
