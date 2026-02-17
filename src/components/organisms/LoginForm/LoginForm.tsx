/**
 * Created by porfidev on 16/02/26
 */

import './LoginForm.styles.css';
import { InputCheckbox, InputText } from '../../molecules';
import { Button } from '../../atoms';
import type { SubmitEventHandler } from 'react';
import { ErrorMessage } from '../../atoms/ErrorMessage';

export type LoginFormValues = {
  email: string;
  password: string;
  rememberSession: string;
};

type LoginFormProps = {
  values: LoginFormValues;
  loading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onInputChange: (name: keyof LoginFormValues, value: string | boolean) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  error?: string | null;
};

export function LoginForm({
  values,
  loading,
  showPassword,
  onTogglePassword,
  onInputChange,
  onSubmit,
  error,
}: LoginFormProps) {
  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <InputText
        id="email"
        label={'Correo electrónico'}
        type={'email'}
        required={true}
        placeholder={'admin@dominio.com'}
        value={values.email}
        disabled={loading}
        onChange={(e) => onInputChange(e.target.name as keyof LoginFormValues, e.target.value)}
      />

      <InputText
        id={'password'}
        label={'Contraseña'}
        type="password"
        shouldShow={showPassword}
        onPressShowPassword={onTogglePassword}
        required={true}
        placeholder={'Ingresa tus credenciales'}
        value={values.password}
        disabled={loading}
        onChange={(e) => onInputChange(e.target.name as keyof LoginFormValues, e.target.value)}
      />
      <InputCheckbox
        id={'rememberSession'}
        label={'Mantener sesión activa'}
        checked={values.rememberSession === 'true'}
        disabled={loading}
        onChange={(e) => onInputChange(e.target.name as keyof LoginFormValues, e.target.checked.toString())}
      />

      {error && <ErrorMessage error={`Error: ${error}`} />}
      <Button disabled={loading}>
        <span className={'button-text'}>{loading ? 'Ingresando...' : 'Ingresar'}</span>
      </Button>
    </form>
  );
}
