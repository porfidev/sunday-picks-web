import './AdminGameResultsPage.styles.css';
import { useMemo, useState, type ChangeEvent } from 'react';
import { MainTemplate } from '../../templates';
import { Button, Icon } from '../../atoms';
import { useSeasons } from '../../../features/seasons/hooks/useSeasons.ts';
import { useWeeks } from '../../../features/weeks/hooks/useWeeks.ts';
import { useGames } from '../../../features/games/hooks/useGames.ts';
import { useTeams } from '../../../features/teams/hooks/useTeams.ts';
import { useSaveGameResults } from '../../../features/gameResults/hooks/useSaveGameResults.ts';
import type { SaveGameResultItem } from '../../../features/gameResults/types.ts';

type DraftResult = {
  local_score: string;
  visit_score: string;
};

function normalizeId(value?: string | number | null) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value);
}

function toNumberOrNull(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function AdminGameResultsPage() {
  const { seasons, loading: loadingSeasons, error: seasonsError } = useSeasons();
  const { weeks, loading: loadingWeeks, error: weeksError } = useWeeks();
  const { games, loading: loadingGames, error: gamesError, refetch: refetchGames } = useGames();
  const { teams } = useTeams();
  const { loading: saving, error: saveError, successMessage, saveMany, clearMessages } = useSaveGameResults();

  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState('');
  const [draftResults, setDraftResults] = useState<Record<string, DraftResult>>({});

  const teamNames = useMemo(() => {
    return new Map(teams.map((team) => [String(team.id), team.name]));
  }, [teams]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (selectedSeasonId && normalizeId(game.season_id) !== selectedSeasonId) {
        return false;
      }

      if (selectedWeekId && normalizeId(game.week_id) !== selectedWeekId) {
        return false;
      }

      return true;
    });
  }, [games, selectedSeasonId, selectedWeekId]);

  const draftCount = useMemo(() => {
    return Object.values(draftResults).filter((draft) => {
      return draft.local_score.trim() !== '' || draft.visit_score.trim() !== '';
    }).length;
  }, [draftResults]);

  const savableDraftCount = useMemo(() => {
    return Object.values(draftResults).filter((draft) => {
      return toNumberOrNull(draft.local_score) !== null && toNumberOrNull(draft.visit_score) !== null;
    }).length;
  }, [draftResults]);

  const setScoreValue = (gameId: string, field: keyof DraftResult, value: string) => {
    clearMessages();
    const safeValue = value.replace(/[^\d]/g, '');
    setDraftResults((prev) => ({
      ...prev,
      [gameId]: {
        local_score: prev[gameId]?.local_score ?? '',
        visit_score: prev[gameId]?.visit_score ?? '',
        [field]: safeValue,
      },
    }));
  };

  const onDiscardChanges = () => {
    setDraftResults({});
    clearMessages();
  };

  const onSaveResults = async () => {
    const payload: SaveGameResultItem[] = Object.entries(draftResults)
      .map(([gameId, draft]) => {
        const local = toNumberOrNull(draft.local_score);
        const visit = toNumberOrNull(draft.visit_score);

        if (local === null || visit === null) {
          return null;
        }

        return {
          game_id: Number(gameId),
          local_score: local,
          visit_score: visit,
        };
      })
      .filter((item): item is SaveGameResultItem => item !== null);

    if (payload.length === 0) {
      return;
    }

    const result = await saveMany(payload);
    if (result) {
      setDraftResults({});
      await refetchGames();
    }
  };

  const getTeamName = (teamId: string | number, fallback?: string) => {
    return fallback ?? teamNames.get(normalizeId(teamId)) ?? `Equipo ${teamId}`;
  };

  const fetchError = seasonsError ?? weeksError ?? gamesError;
  const hasFilterSelection = selectedSeasonId !== '' && selectedWeekId !== '';
  const canSave = !saving && savableDraftCount > 0;

  return (
    <MainTemplate>
      <section className={'admin-game-results-page'}>
        <header className={'admin-game-results-page__header'}>
          <h1 className={'admin-game-results-page__title'}>Register Match Results</h1>
          <p className={'admin-game-results-page__subtitle'}>
            Input and update official scores for league matchups
          </p>
        </header>

        <div className={'admin-game-results-page__filters-card'}>
          <div className={'admin-game-results-page__filter'}>
            <label className={'admin-game-results-page__filter-label'} htmlFor={'results-season-id'}>
              Select Season
            </label>
            <select
              id={'results-season-id'}
              className={'admin-game-results-page__select'}
              value={selectedSeasonId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedSeasonId(e.target.value)}
              disabled={loadingSeasons || saving}
            >
              <option value={''}>Select season</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          <div className={'admin-game-results-page__filter'}>
            <label className={'admin-game-results-page__filter-label'} htmlFor={'results-week-id'}>
              Select Week
            </label>
            <select
              id={'results-week-id'}
              className={'admin-game-results-page__select'}
              value={selectedWeekId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedWeekId(e.target.value)}
              disabled={loadingWeeks || saving}
            >
              <option value={''}>Select week</option>
              {weeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={'admin-game-results-page__table-card'}>
          <table className={'admin-game-results-page__table'}>
            <thead>
              <tr>
                <th>Home Team</th>
                <th>Home Score</th>
                <th className={'admin-game-results-page__vs-col'} aria-label={'Versus'}>
                  {' '}
                </th>
                <th>Away Score</th>
                <th className={'admin-game-results-page__away-team-col'}>Away Team</th>
              </tr>
            </thead>
            <tbody>
              {(loadingGames || loadingSeasons || loadingWeeks) && (
                <tr>
                  <td className={'admin-game-results-page__empty'} colSpan={5}>
                    Cargando partidos...
                  </td>
                </tr>
              )}

              {!loadingGames && !fetchError && !hasFilterSelection && (
                <tr>
                  <td className={'admin-game-results-page__empty'} colSpan={5}>
                    Selecciona temporada y semana para capturar resultados.
                  </td>
                </tr>
              )}

              {!loadingGames && !fetchError && hasFilterSelection && filteredGames.length === 0 && (
                <tr>
                  <td className={'admin-game-results-page__empty'} colSpan={5}>
                    No hay partidos para la temporada y semana seleccionadas.
                  </td>
                </tr>
              )}

              {!loadingGames &&
                !fetchError &&
                hasFilterSelection &&
                filteredGames.map((game) => {
                  const gameId = String(game.id);
                  const draft = draftResults[gameId];
                  const localScoreValue =
                    draft?.local_score ??
                    (game.local_score !== undefined && game.local_score !== null
                      ? String(game.local_score)
                      : '');
                  const visitScoreValue =
                    draft?.visit_score ??
                    (game.visit_score !== undefined && game.visit_score !== null
                      ? String(game.visit_score)
                      : '');

                  const localTeamName = getTeamName(
                    game.local_team_id,
                    game.local_team_name ?? game.local_team?.name,
                  );
                  const visitTeamName = getTeamName(
                    game.visit_team_id,
                    game.visit_team_name ?? game.visit_team?.name,
                  );

                  return (
                    <tr key={game.id}>
                      <td>
                        <div className={'admin-game-results-page__team-cell'}>
                          <span className={'admin-game-results-page__team-icon'}>
                            <Icon name={'shield'} size={20} />
                          </span>
                          <span className={'admin-game-results-page__team-name'}>{localTeamName}</span>
                        </div>
                      </td>
                      <td>
                        <input
                          className={'admin-game-results-page__score-input'}
                          type={'text'}
                          inputMode={'numeric'}
                          placeholder={'--'}
                          value={localScoreValue}
                          onChange={(e) => setScoreValue(gameId, 'local_score', e.target.value)}
                          disabled={saving}
                        />
                      </td>
                      <td className={'admin-game-results-page__vs-col'}>
                        <span className={'admin-game-results-page__vs'}>VS</span>
                      </td>
                      <td>
                        <input
                          className={'admin-game-results-page__score-input'}
                          type={'text'}
                          inputMode={'numeric'}
                          placeholder={'--'}
                          value={visitScoreValue}
                          onChange={(e) => setScoreValue(gameId, 'visit_score', e.target.value)}
                          disabled={saving}
                        />
                      </td>
                      <td>
                        <div className={'admin-game-results-page__team-cell admin-game-results-page__team-cell--away'}>
                          <span className={'admin-game-results-page__team-name'}>{visitTeamName}</span>
                          <span className={'admin-game-results-page__team-icon'}>
                            <Icon name={'shield'} size={20} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!loadingGames && fetchError && (
                <tr>
                  <td className={'admin-game-results-page__empty'} colSpan={5}>
                    {`Error: ${fetchError}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className={'admin-game-results-page__footer'}>
          <p className={'admin-game-results-page__note'}>
            * Note: Registered scores will be reflected in global standings immediately.
          </p>

          <div className={'admin-game-results-page__actions'}>
            <Button
              type={'button'}
              className={'admin-game-results-page__discard-button'}
              disabled={saving || draftCount === 0}
              onClick={onDiscardChanges}
            >
              <span className={'button-text'}>Discard Changes</span>
            </Button>

            <Button
              type={'button'}
              className={'admin-game-results-page__save-button'}
              disabled={!canSave}
              onClick={onSaveResults}
            >
              <span className={'admin-game-results-page__save-content'}>
                <Icon name={'save'} size={20} />
                <span className={'button-text'}>{saving ? 'Guardando' : 'Save Results'}</span>
              </span>
            </Button>
          </div>
        </footer>

        {saveError && (
          <p className={'admin-game-results-page__message admin-game-results-page__message--error'}>
            {`Error: ${saveError}`}
          </p>
        )}
        {successMessage && (
          <p className={'admin-game-results-page__message admin-game-results-page__message--success'}>
            {successMessage}
          </p>
        )}
      </section>
    </MainTemplate>
  );
}
