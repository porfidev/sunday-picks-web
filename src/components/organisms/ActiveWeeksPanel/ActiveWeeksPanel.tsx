import './ActiveWeeksPanel.styles.css';
import { Button, Card, Icon } from '../../atoms';
import type { GetWeekResponse } from '../../../features/weeks/types.ts';

type ActiveWeeksPanelProps = {
  weeks: GetWeekResponse[];
  loading: boolean;
  deletingId: string | null;
  error: string | null;
  onEditWeek: (week: GetWeekResponse) => void;
  onDeleteWeek: (week: GetWeekResponse) => void;
};

export function ActiveWeeksPanel({
  weeks,
  loading,
  deletingId,
  error,
  onEditWeek,
  onDeleteWeek,
}: ActiveWeeksPanelProps) {
  return (
    <section className={'active-weeks-panel'}>
      <header className={'active-weeks-panel__header'}>
        <h2 className={'active-weeks-panel__title'}>{`Semanas registradas (${weeks.length})`}</h2>
        <div className={'active-weeks-panel__title-line'} />
      </header>

      {loading && <p className={'active-weeks-panel__status'}>Cargando semanas...</p>}
      {error && <p className={'active-weeks-panel__status'}>{`Error: ${error}`}</p>}
      {!loading && !error && weeks.length === 0 && (
        <p className={'active-weeks-panel__status'}>No hay semanas registradas.</p>
      )}

      <ul className={'active-weeks-panel__list'} role={'list'}>
        {weeks.map((week) => {
          const isDeleting = deletingId === week.id;

          return (
            <li className={'active-weeks-panel__list-item'} key={week.id}>
              <Card
                className={'active-weeks-panel__card'}
                classNameInner={'active-weeks-panel__card-inner'}
              >
                <div className={'active-weeks-panel__item-content'}>
                  <p className={'active-weeks-panel__item-name'}>{week.name}</p>
                  <p
                    className={'active-weeks-panel__item-update'}
                  >{`Actualizado en: ${new Date(week.updated_at).toLocaleString()}`}</p>
                </div>
                <div className={'active-weeks-panel__item-actions'}>
                  <Button
                    className={
                      'active-weeks-panel__item-button active-weeks-panel__item-button--edit'
                    }
                    disabled={isDeleting}
                    id={`edit-${week.id}`}
                    onClick={() => onEditWeek(week)}
                  >
                    <Icon name={'edit'} size={20} />
                  </Button>

                  <Button
                    className={
                      'active-weeks-panel__item-button active-weeks-panel__item-button--delete'
                    }
                    disabled={isDeleting}
                    id={`delete-${week.id}`}
                    onClick={() => onDeleteWeek(week)}
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
