/**
 * Created by porfidev on 16/02/26
 */

import './LoginForm.styles.css';
import { InputCheckbox, InputText } from '../../molecules';
import { Button } from '../../atoms';
import type { SubmitEventHandler } from 'react';

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
};

export function LoginForm({
  values,
  loading,
  showPassword,
  onTogglePassword,
  onInputChange,
  onSubmit,
}: LoginFormProps) {
  console.log('loading', loading);
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
        id={'keepSession'}
        label={'Mantener sesión activa'}
        value={values.rememberSession}
        disabled={loading}
        onChange={(e) => onInputChange(e.target.name as keyof LoginFormValues, e.target.value)}
      />
      <Button disabled={loading}>
        <span className={'button-text'}>{loading ? 'Ingresando...' : 'Ingresar'}</span>
      </Button>
    </form>
  );
}
