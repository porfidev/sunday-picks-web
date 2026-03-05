import './ActiveUsersPanel.styles.css';
import { Button, Card, Icon } from '../../atoms';
import type { GetUsersResponse } from '../../../features/users/types.ts';

type ActiveUsersPanelProps = {
  users: GetUsersResponse[];
  loading: boolean;
  error: string | null;
  onEditUser: (user: GetUsersResponse) => void;
};

export function ActiveUsersPanel({
  users = [],
  loading,
  error,
  onEditUser,
}: ActiveUsersPanelProps) {
  return (
    <section className={'active-users-panel'}>
      <header className={'active-users-panel__header'}>
        <h2 className={'active-users-panel__title'}>{`Usuarios registrados (${users.length})`}</h2>
        <div className={'active-users-panel__title-line'} />
      </header>

      {loading && <p className={'active-users-panel__status'}>Cargando usuarios...</p>}
      {error && <p className={'active-users-panel__status'}>{`Error: ${error}`}</p>}
      {!loading && !error && users.length === 0 && (
        <p className={'active-users-panel__status'}>No hay usuarios registrados.</p>
      )}

      <ul className={'active-users-panel__list'} role={'list'}>
        {users.map((user) => {
          return (
            <li className={'active-users-panel__list-item'} key={user.id}>
              <Card
                className={'active-users-panel__card'}
                classNameInner={'active-users-panel__card-inner'}
              >
                <div className={'active-users-panel__item-content'}>
                  <p className={'active-users-panel__item-name'}>{user.name}</p>
                  <p className={'active-users-panel__item-data'}>{user.email}</p>
                  <p className={'active-users-panel__item-data'}>{user.phone}</p>
                </div>

                <div className={'active-users-panel__item-actions'}>
                  <span
                    className={`active-users-panel__role ${user.is_admin === 1 ? 'active-users-panel__role--admin' : ''}`}
                  >
                    {user.is_admin === 1 ? 'Administrador' : 'Usuario'}
                  </span>

                  <Button
                    className={'active-users-panel__item-button'}
                    id={`edit-${user.id}`}
                    onClick={() => onEditUser(user)}
                  >
                    <Icon name={'edit'} size={20} />
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
