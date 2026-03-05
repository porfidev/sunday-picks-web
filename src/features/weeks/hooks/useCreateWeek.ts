import { weekService, type WeekService } from '../services/week.service.ts';
import { useState } from 'react';
import type { CreateWeekValues } from '../../../components/organisms/WeeksForm';

export type CreateWeekRequestValues = {
  name: string;
};

export function useCreateWeek(service: WeekService = weekService) {
  const [values, setValues] = useState<CreateWeekValues>({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.create(values);
      console.log('result create week', result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear la semana');
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
      setError(e instanceof Error ? e.message : 'Error al actualizar la semana');
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
