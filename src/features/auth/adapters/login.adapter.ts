// UI -> Domain
import type { LoginRequestValues } from '../hooks/useLogin.ts';
import type { LoginFormValues } from '../../../components/organisms/LoginForm';

export function mapLoginFormToUseLogin(values: LoginFormValues): LoginRequestValues {
  return {
    email: values.email.trim(),
    password: values.password,
    remember: values.rememberSession === 'true',
  };
}

// Domain -> UI
export function mapUseLoginToLoginForm(values: LoginRequestValues): LoginFormValues {
  return {
    email: values.email,
    password: values.password,
    rememberSession: values.remember.toString(),
  };
}
