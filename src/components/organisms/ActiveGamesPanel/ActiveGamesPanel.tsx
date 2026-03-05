import './ActiveGamesPanel.styles.css';
import { type ChangeEvent, useMemo, useState } from 'react';
import { Icon } from '../../atoms';
import type { GetGameResponse } from '../../../features/games/types.ts';
import type { GetSeasonResponse } from '../../../features/seasons/types.ts';
import type { GetWeekResponse } from '../../../features/weeks/types.ts';
import type { GetTeamsResponse } from '../../../features/teams/types.ts';

type ActiveGamesPanelProps = {
  games: GetGameResponse[];
  seasons: GetSeasonResponse[];
  weeks: GetWeekResponse[];
  teams: GetTeamsResponse[];
  loading: boolean;
  error: string | null;
};

const PAGE_SIZE = 5;

type FilterValues = {
  seasonId: string;
  weekId: string;
  teamId: string;
  activeOnly: boolean;
};

function normalizeId(value?: string | number | null) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value);
}

function mapGameDate(gameDatetime: string) {
  const date = new Date(gameDatetime.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) {
    return {
      dateLabel: gameDatetime,
      timeLabel: '',
    };
  }

  return {
    dateLabel: date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    timeLabel: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function ActiveGamesPanel({
  games = [],
  seasons,
  weeks,
  teams,
  loading,
  error,
}: ActiveGamesPanelProps) {
  const [filters, setFilters] = useState<FilterValues>({
    seasonId: '',
    weekId: '',
    teamId: '',
    activeOnly: true,
  });
  const [page, setPage] = useState(1);

  const teamNames = useMemo(() => {
    return new Map(teams.map((team) => [String(team.id), team.name]));
  }, [teams]);

  const seasonNames = useMemo(() => {
    return new Map(seasons.map((season) => [String(season.id), season.name]));
  }, [seasons]);

  const weekNames = useMemo(() => {
    return new Map(weeks.map((week) => [String(week.id), week.name]));
  }, [weeks]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const seasonId = normalizeId(game.season_id);
      const weekId = normalizeId(game.week_id);
      const localTeamId = normalizeId(game.local_team_id);
      const visitTeamId = normalizeId(game.visit_team_id);
      const isActive = game.is_played === 0;

      if (filters.activeOnly && !isActive) {
        return false;
      }

      if (filters.seasonId && filters.seasonId !== seasonId) {
        return false;
      }

      if (filters.weekId && filters.weekId !== weekId) {
        return false;
      }

      if (filters.teamId && filters.teamId !== localTeamId && filters.teamId !== visitTeamId) {
        return false;
      }

      return true;
    });
  }, [filters, games]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginatedGames = filteredGames.slice(pageStart, pageStart + PAGE_SIZE);

  const setFilterValue = (name: keyof FilterValues, value: string | boolean) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectFilter =
    (name: 'seasonId' | 'weekId' | 'teamId') => (e: ChangeEvent<HTMLSelectElement>) => {
      setFilterValue(name, e.target.value);
    };

  const onToggleActiveOnly = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue('activeOnly', e.target.checked);
  };

  return (
    <section className={'active-games-panel'}>
      <header className={'active-games-panel__header'}>
        <h2 className={'active-games-panel__title'}>Active Matches</h2>
        <span
          className={'active-games-panel__counter'}
        >{`${filteredGames.length} Total Matches`}</span>
      </header>

      <div className={'active-games-panel__filters'}>
        <select
          className={'active-games-panel__filter-select'}
          value={filters.seasonId}
          onChange={onSelectFilter('seasonId')}
        >
          <option value={''}>All Seasons</option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>

        <select
          className={'active-games-panel__filter-select'}
          value={filters.weekId}
          onChange={onSelectFilter('weekId')}
        >
          <option value={''}>All Weeks</option>
          {weeks.map((week) => (
            <option key={week.id} value={week.id}>
              {week.name}
            </option>
          ))}
        </select>

        <select
          className={'active-games-panel__filter-select'}
          value={filters.teamId}
          onChange={onSelectFilter('teamId')}
        >
          <option value={''}>All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <label className={'active-games-panel__checkbox'}>
          <input type={'checkbox'} checked={filters.activeOnly} onChange={onToggleActiveOnly} />
          <span>Active Only</span>
        </label>
      </div>

      <div className={'active-games-panel__table-wrapper'}>
        <table className={'active-games-panel__table'}>
          <thead>
            <tr>
              <th className={'active-games-panel__col-check'}>
                <input type={'checkbox'} aria-label={'Seleccionar todos'} disabled={true} />
              </th>
              <th>Teams (Home vs Away)</th>
              <th>Date / Time</th>
              <th>Status</th>
              <th className={'active-games-panel__col-actions'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className={'active-games-panel__empty'} colSpan={5}>
                  Cargando partidos...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td className={'active-games-panel__empty'} colSpan={5}>
                  {`Error: ${error}`}
                </td>
              </tr>
            )}

            {!loading && !error && paginatedGames.length === 0 && (
              <tr>
                <td className={'active-games-panel__empty'} colSpan={5}>
                  No hay partidos con los filtros seleccionados.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              paginatedGames.map((game) => {
                const localTeamName =
                  game.local_team_name ??
                  game.local_team?.name ??
                  teamNames.get(normalizeId(game.local_team_id)) ??
                  `Equipo ${game.local_team_id}`;

                const visitTeamName =
                  game.visit_team_name ??
                  game.visit_team?.name ??
                  teamNames.get(normalizeId(game.visit_team_id)) ??
                  `Equipo ${game.visit_team_id}`;

                const seasonName =
                  game.season_name ??
                  seasonNames.get(normalizeId(game.season_id)) ??
                  `Temporada ${game.season_id}`;

                const weekName =
                  game.week_name ??
                  weekNames.get(normalizeId(game.week_id)) ??
                  `Semana ${game.week_id}`;

                const { dateLabel, timeLabel } = mapGameDate(game.game_datetime);
                const played = game.is_played === 1;

                return (
                  <tr key={game.id}>
                    <td className={'active-games-panel__col-check'}>
                      <input type={'checkbox'} aria-label={`Seleccionar partido ${game.id}`} />
                    </td>
                    <td>
                      <p className={'active-games-panel__teams'}>
                        <strong>{localTeamName}</strong>
                        <span>{' vs '}</span>
                        <strong>{visitTeamName}</strong>
                      </p>
                      <p className={'active-games-panel__meta'}>{`${seasonName} · ${weekName}`}</p>
                    </td>
                    <td>
                      <p className={'active-games-panel__datetime'}>{dateLabel}</p>
                      <p className={'active-games-panel__meta'}>{timeLabel}</p>
                    </td>
                    <td>
                      <span
                        className={`active-games-panel__status-pill ${played ? 'active-games-panel__status-pill--confirmed' : 'active-games-panel__status-pill--pending'}`}
                      >
                        <span className={'active-games-panel__status-dot'} />
                        {played ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                    <td className={'active-games-panel__col-actions'}>
                      <button
                        type={'button'}
                        className={'active-games-panel__edit-btn'}
                        aria-label={`Editar partido ${game.id}`}
                      >
                        <Icon name={'edit'} size={22} />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <footer className={'active-games-panel__footer'}>
        <p className={'active-games-panel__summary'}>
          {filteredGames.length === 0
            ? 'Showing 0 to 0 of 0 matches'
            : `Showing ${pageStart + 1} to ${Math.min(pageStart + PAGE_SIZE, filteredGames.length)} of ${filteredGames.length} matches`}
        </p>

        <div className={'active-games-panel__pagination'}>
          <button
            type={'button'}
            className={'active-games-panel__page-btn'}
            disabled={safePage <= 1}
            onClick={() => setPage(Math.max(1, safePage - 1))}
          >
            Previous
          </button>
          <button
            type={'button'}
            className={'active-games-panel__page-btn'}
            disabled={safePage >= totalPages}
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
