import { MainTemplate } from '../../templates';
import { Card, Icon } from '../../atoms';
import { SectionTitle } from '../../atoms/SectionTitle';
import { LineSpacer } from '../../atoms/LineSpacer';
import { CardTitle } from '../../atoms/CardTitle';
import './AdminUsersPage.styles.css';
import { type CreateUserFormValues, UsersForm } from '../../organisms/UsersForm';
import { useCreateUser } from '../../../features/users/hooks/useCreateUser.ts';
import { useRef, useState, type SubmitEventHandler } from 'react';
import { ActiveUsersPanel } from '../../organisms/ActiveUsersPanel';
import { useUsers } from '../../../features/users/hooks/useUsers.ts';
import type { GetUsersResponse } from '../../../features/users/types.ts';

export function AdminUsersPage() {
  const { values, loading, submit, update, error, setValues } = useCreateUser();
  const { users, loading: loadingUsers, error: usersError, refetch } = useUsers();
  const [formKey, setFormKey] = useState(0);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  const setInputValue = (name: keyof CreateUserFormValues, value: string | boolean) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const userResult = editingUserId ? await update(editingUserId) : await submit();

    if (userResult?.data) {
      setValues({
        name: '',
        phone: '',
        email: '',
        password: '',
        is_admin: 'false',
      });
      setEditingUserId(null);
      setFormKey((prev) => prev + 1);
      await refetch();
    }
  };

  const onEditUser = (user: GetUsersResponse) => {
    setEditingUserId(user.id);
    setValues({
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: '',
      is_admin: user.is_admin === 1 ? 'true' : 'false',
    });
    setFormKey((prev) => prev + 1);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCancelEdit = () => {
    setEditingUserId(null);
    setValues({
      name: '',
      phone: '',
      email: '',
      password: '',
      is_admin: 'false',
    });
    setFormKey((prev) => prev + 1);
  };

  return (
    <MainTemplate>
      <div className={'admin-users-page'} ref={formCardRef}>
        <SectionTitle>Registro de usuarios</SectionTitle>
        <LineSpacer />

        <Card className={'admin-users-page__card'} classNameInner={'admin-users-page__card-inner'}>
          <CardTitle
            icon={<Icon name={'add_circle'} color={'rgb(242, 13, 13)'} size={24} />}
            iconPosition="left"
          >
            {editingUserId ? 'Editar usuario' : 'Registra un nuevo usuario'}
          </CardTitle>

          <UsersForm
            key={formKey}
            values={values}
            loading={loading}
            mode={editingUserId ? 'edit' : 'create'}
            onCancelEdit={onCancelEdit}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
            error={error}
          />
        </Card>

        <div className={'admin-users-page__users-list'}>
          <ActiveUsersPanel
            users={users}
            loading={loadingUsers}
            error={usersError}
            onEditUser={onEditUser}
          />
        </div>
      </div>
    </MainTemplate>
  );
}
