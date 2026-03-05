import { useState } from 'react';
import type { CreateGameValues } from '../../../components/organisms/GamesForm';
import { gameService, type GameService } from '../services/game.service.ts';

export type CreateGameRequestValues = {
  game_datetime: string;
  season_id: number;
  week_id: number;
  local_team_id: number;
  visit_team_id: number;
  is_played: number;
};

function normalizeGameDatetime(rawValue: string) {
  const trimmed = rawValue.trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(trimmed)) {
    return `${trimmed}:00`;
  }
  return trimmed;
}

export function useCreateGame(service: GameService = gameService) {
  const [values, setValues] = useState<CreateGameValues>({
    season_id: '',
    week_id: '',
    local_team_id: '',
    visit_team_id: '',
    game_datetime: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (values.local_team_id && values.local_team_id === values.visit_team_id) {
      setError('El equipo local y visitante deben ser diferentes');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateGameRequestValues = {
        game_datetime: normalizeGameDatetime(values.game_datetime),
        season_id: Number(values.season_id),
        week_id: Number(values.week_id),
        local_team_id: Number(values.local_team_id),
        visit_team_id: Number(values.visit_team_id),
        is_played: 0,
      };

      return await service.create(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el partido');
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
    error,
  };
}
