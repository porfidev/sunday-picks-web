import './ActiveSeasonsPanel.styles.css';
import { Button, Card, Icon } from '../../atoms';
import type { GetSeasonResponse } from '../../../features/seasons/types.ts';

type ActiveSeasonsPanelProps = {
  seasons: GetSeasonResponse[];
  loading: boolean;
  deletingId: string | null;
  error: string | null;
  onEditSeason: (season: GetSeasonResponse) => void;
  onDeleteSeason: (season: GetSeasonResponse) => void;
};

export function ActiveSeasonsPanel({
  seasons = [],
  loading,
  deletingId,
  error,
  onEditSeason,
  onDeleteSeason,
}: ActiveSeasonsPanelProps) {
  return (
    <section className={'active-seasons-panel'}>
      <header className={'active-seasons-panel__header'}>
        <h2
          className={'active-seasons-panel__title'}
        >{`Temporadas registradas (${seasons.length})`}</h2>
        <div className={'active-seasons-panel__title-line'} />
      </header>

      {loading && <p className={'active-seasons-panel__status'}>Cargando temporadas...</p>}
      {error && <p className={'active-seasons-panel__status'}>{`Error: ${error}`}</p>}
      {!loading && !error && seasons.length === 0 && (
        <p className={'active-seasons-panel__status'}>No hay temporadas registradas.</p>
      )}

      <ul className={'active-seasons-panel__list'} role={'list'}>
        {seasons.map((season) => {
          const isDeleting = deletingId === season.id;

          return (
            <li className={'active-seasons-panel__list-item'} key={season.id}>
              <Card
                className={'active-seasons-panel__card'}
                classNameInner={'active-seasons-panel__card-inner'}
              >
                <div className={'active-seasons-panel__item-content'}>
                  <p className={'active-seasons-panel__item-name'}>{season.name}</p>
                  <p className={'active-seasons-panel__item-update'}>
                    {`Actualizado en: ${new Date(season.updated_at).toLocaleString()}`}
                  </p>
                </div>

                <div className={'active-seasons-panel__item-actions'}>
                  <Button
                    className={
                      'active-seasons-panel__item-button active-seasons-panel__item-button--edit'
                    }
                    disabled={isDeleting}
                    id={`edit-${season.id}`}
                    onClick={() => onEditSeason(season)}
                  >
                    <Icon name={'edit'} size={20} />
                  </Button>

                  <Button
                    className={
                      'active-seasons-panel__item-button active-seasons-panel__item-button--delete'
                    }
                    disabled={isDeleting}
                    id={`delete-${season.id}`}
                    onClick={() => onDeleteSeason(season)}
                  >
                    <Icon name={'delete'} size={20} />
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
