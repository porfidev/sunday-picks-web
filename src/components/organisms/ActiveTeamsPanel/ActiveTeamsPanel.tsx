/**
 * Created by porfidev on 26/02/26
 */

import './ActiveTeamsPanel.styles.css';
import { Button, Card, Icon } from '../../atoms';
import type { CreateTeamResponse } from '../../../features/teams/types.ts';

const apiBaseUrl = import.meta.env.VITE_API_URL;

function getTeamLogoSrc(logoUri: string) {
  if (!logoUri) {
    return '';
  }

  if (logoUri.startsWith('http://') || logoUri.startsWith('https://')) {
    return logoUri;
  }

  if (!apiBaseUrl) {
    return logoUri;
  }

  const normalizedLogoUri = logoUri.replace(/\\/g, '/');
  return new URL(normalizedLogoUri, apiBaseUrl).toString();
}

type ActiveTeamsPanelProps = {
  teams: CreateTeamResponse[];
  loading: boolean;
  error: string | null;
};

export function ActiveTeamsPanel({ teams, loading, error }: ActiveTeamsPanelProps) {
  console.log('TEAMS', teams);
  return (
    <section className={'active-teams-panel'}>
      <header className={'active-teams-panel__header'}>
        <h2 className={'active-teams-panel__title'}>{`Equipos registrados (${teams.length})`}</h2>
        <div className={'active-teams-panel__title-line'} />
      </header>

      {loading && <p className={'active-teams-panel__status'}>Cargando equipos...</p>}
      {error && <p className={'active-teams-panel__status'}>{`Error: ${error}`}</p>}
      {!loading && !error && teams.length === 0 && (
        <p className={'active-teams-panel__status'}>No hay equipos registrados.</p>
      )}

      <ul className={'active-teams-panel__list'} role={'list'}>
        {teams.map((team) => {
          return (
            <li className={'active-teams-panel__list-item'} key={team.id}>
              <Card
                className={'active-teams-panel__card'}
                classNameInner={'active-teams-panel__card-inner'}
              >
                <div className={'active-teams-panel__item-logo'}>
                  <img
                    className={'active-teams-panel__item-image'}
                    src={getTeamLogoSrc(team.logo_uri)}
                    alt={team.name}
                  />
                </div>

                <div className={'active-teams-panel__item-content'}>
                  <p className={'active-teams-panel__item-name'}>{team.name}</p>
                  <p className={'active-teams-panel__item-update'}>{`ID: ${team.id}`}</p>
                </div>

                <Button className={'active-teams-panel__item-button'}>
                  <Icon name={'edit'} size={20} />
                </Button>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
