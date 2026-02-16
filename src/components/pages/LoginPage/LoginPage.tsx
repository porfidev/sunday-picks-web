import { AuthTemplate } from '../../templates';
import './LoginPage.css';
import { Logo, Card, BrandTitle } from '../../atoms';
import { LoginForm, type LoginFormValues } from '../../organisms/LoginForm';
import { useLogin } from '../../../features/auth/hooks/useLogin.ts';
import {
  mapLoginFormToUseLogin,
  mapUseLoginToLoginForm,
} from '../../../features/auth/adapters/login.adapter.ts';
import type { SubmitEventHandler } from 'react';

export function LoginPage() {
  const {
    values: domainValues,
    loading,
    setShowPassword,
    showPassword,
    setValues,
    submit,
  } = useLogin();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log('enviando');
    await submit();
  };

  const formValues = mapUseLoginToLoginForm(domainValues);

  const setInputValue = (name: keyof LoginFormValues, value: string | boolean) => {
    const newValues = { ...formValues, [name]: value };
    setValues(mapLoginFormToUseLogin(newValues));
  };

  return (
    <AuthTemplate>
      <Card>
        <div className={'login-header'}>
          <Logo />
          <BrandTitle main={'Sunday'} highlight={'Picks'} />
        </div>

        <LoginForm
          loading={loading}
          onSubmit={onSubmit}
          values={formValues}
          showPassword={showPassword}
          onInputChange={setInputValue}
          onTogglePassword={togglePassword}
        />
      </Card>
    </AuthTemplate>
  );
}
