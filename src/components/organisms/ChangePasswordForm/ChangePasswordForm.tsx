/**
 * Created by porfidev on 21/03/26
 */

import './ChangePasswordForm.styles.css';
import { type SubmitEventHandler, useState } from 'react';
import { InputText } from '../../molecules';
import { Button } from '../../atoms';
import { ErrorMessage } from '../../atoms/ErrorMessage';

export type ChangePasswordFormValues = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

type ChangePasswordFormProps = {
  error?: string | null;
  loading: boolean;
  onInputChange: (name: keyof ChangePasswordFormValues, value: string | boolean) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  values: ChangePasswordFormValues;
};

export function ChangePasswordForm({
  error,
  loading,
  onInputChange,
  onSubmit,
  values,
}: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);

  return (
    <form className={'change-password-form'} onSubmit={onSubmit}>
      <InputText
        id={'current_password'}
        label={'Contraseña actual'}
        type={'password'}
        shouldShow={showCurrentPassword}
        required={true}
        value={values.current_password}
        disabled={loading}
        onChange={(e) =>
          onInputChange(e.target.name as keyof ChangePasswordFormValues, e.target.value)
        }
        onPressShowPassword={() => setShowCurrentPassword((prev) => !prev)}
      />

      <InputText
        id={'new_password'}
        label={'Nueva contraseña'}
        type={'password'}
        shouldShow={showNewPassword}
        required={true}
        value={values.new_password}
        disabled={loading}
        onChange={(e) =>
          onInputChange(e.target.name as keyof ChangePasswordFormValues, e.target.value)
        }
        onPressShowPassword={() => setShowNewPassword((prev) => !prev)}
      />

      <InputText
        id={'new_password_confirmation'}
        label={'Confirmar nueva contraseña'}
        type={'password'}
        shouldShow={showNewPasswordConfirmation}
        required={true}
        value={values.new_password_confirmation}
        disabled={loading}
        onChange={(e) =>
          onInputChange(e.target.name as keyof ChangePasswordFormValues, e.target.value)
        }
        onPressShowPassword={() => setShowNewPasswordConfirmation((prev) => !prev)}
      />

      {error && <ErrorMessage error={`Error: ${error}`} />}

      <div className={'change-password-form__actions'}>
        <Button type={'submit'} disabled={loading}>
          <span className={'button-text'}>
            {loading ? 'Actualizando contraseña' : 'Actualizar contraseña'}
          </span>
        </Button>
      </div>
    </form>
  );
}
