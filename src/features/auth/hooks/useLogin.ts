import { useState } from 'react';
import { authService, type AuthService } from '../services/auth.service.ts';

export type LoginRequestValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function useLogin(service: AuthService = authService) {
  const [values, setValues] = useState<LoginRequestValues>({
    email: 'admin@tudominio.com',
    password: 'abcd1234*',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null); // antes de intentar login
    try {
      const result = await service.login(values);
      console.log('result', result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setValues,
    showPassword,
    setShowPassword,
    loading,
    submit,
    error,
  };
}
