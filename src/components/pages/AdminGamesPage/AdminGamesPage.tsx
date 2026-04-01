import './AdminGamesPage.styles.css';
import { MainTemplate } from '../../templates';
import { SectionTitle } from '../../atoms/SectionTitle';
import { LineSpacer } from '../../atoms/LineSpacer';
import { Card, Icon } from '../../atoms';
import { CardTitle } from '../../atoms/CardTitle';
import { type CreateGameValues, GamesForm } from '../../organisms/GamesForm';
import { type SubmitEventHandler } from 'react';
import { useCreateGame } from '../../../features/games/hooks/useCreateGame.ts';
import { useSeasons } from '../../../features/seasons/hooks/useSeasons.ts';
import { useWeeks } from '../../../features/weeks/hooks/useWeeks.ts';
import { useTeams } from '../../../features/teams/hooks/useTeams.ts';
import { useGames } from '../../../features/games/hooks/useGames.ts';
import { ActiveGamesPanel } from '../../organisms/ActiveGamesPanel';

export function AdminGamesPage() {
  const { values, setValues, loading, submit, error } = useCreateGame();
  const { seasons, loading: loadingSeasons, error: seasonsError } = useSeasons();
  const { weeks, loading: loadingWeeks, error: weeksError } = useWeeks();
  const { teams, loading: loadingTeams, error: teamsError } = useTeams();
  const { games, loading: loadingGames, error: gamesError, refetch: refetchGames } = useGames();

  const setInputValue = (updateValue: { name: keyof CreateGameValues; value: string }) => {
    setValues({ ...values, [updateValue.name]: updateValue.value });
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const result = await submit();

    if (result?.data) {
      setValues({
        season_id: '',
        week_id: '',
        local_team_id: '',
        visit_team_id: '',
        game_datetime: '',
      });
      await refetchGames();
    }
  };

  return (
    <MainTemplate>
      <div className={'admin-games-page'}>
        <SectionTitle>Registro de Partidos</SectionTitle>
        <LineSpacer />

        <Card className={'admin-games-page__card'} classNameInner={'admin-games-page__card-inner'}>
          <CardTitle
            icon={<Icon name={'add_circle'} color={'rgb(242, 13, 13)'} size={24} />}
            iconPosition="left"
          >
            Alta de partidos
          </CardTitle>

          <GamesForm
            values={values}
            seasons={seasons}
            weeks={weeks}
            teams={teams}
            loading={loading}
            loadingCatalogs={loadingSeasons || loadingWeeks || loadingTeams}
            error={error ?? seasonsError ?? weeksError ?? teamsError}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
          />
        </Card>

        <div className={'admin-games-page__games-list'}>
          <ActiveGamesPanel
            games={games}
            seasons={seasons}
            weeks={weeks}
            teams={teams}
            loading={loadingGames}
            error={gamesError}
          />
        </div>
      </div>
    </MainTemplate>
  );
}
