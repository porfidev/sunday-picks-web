/**
 * Created by porfidev on 07/03/26
 */

import './ChangePasswordPage.styles.css';
import { MainTemplate } from '../../templates';
import { Card, Icon } from '../../atoms';
import { SectionTitle } from '../../atoms/SectionTitle';
import { LineSpacer } from '../../atoms/LineSpacer';
import { CardTitle } from '../../atoms/CardTitle';
import { ChangePasswordForm, type ChangePasswordFormValues } from '../../organisms/ChangePasswordForm';
import { useChangePassword } from '../../../features/auth/hooks/useChangePassword.ts';
import { type SubmitEventHandler, useState } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth.ts';

export function ChangePasswordPage() {
  const { user } = useAuth();
  const { values, setValues, loading, submit, error, resetValues } = useChangePassword();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setInputValue = (name: keyof ChangePasswordFormValues, value: string | boolean) => {
    setSuccessMessage(null);
    setValues({ ...values, [name]: value });
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      return;
    }

    const result = await submit(user.id.toString());

    if (result?.data) {
      resetValues();
      setSuccessMessage(result.data.message || 'La contraseña fue actualizada correctamente');
    }
  };

  return (
    <MainTemplate>
      <div className={'change-password-page'}>
        <SectionTitle>Cambio de contraseña</SectionTitle>
        <LineSpacer />

        <Card className={'change-password-page__card'} classNameInner={'change-password-page__card-inner'}>
          <CardTitle
            icon={<Icon name={'lock'} color={'rgb(242, 13, 13)'} size={24} />}
            iconPosition="left"
          >
            Actualizar credenciales
          </CardTitle>

          {successMessage && <p className={'change-password-page__success'}>{successMessage}</p>}

          <ChangePasswordForm
            values={values}
            loading={loading}
            error={error}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
          />
        </Card>
      </div>
    </MainTemplate>
  );
}
