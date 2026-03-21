import { useState } from 'react';
import { authService, type AuthService } from '../services/auth.service.ts';
import type { ChangePasswordFormValues } from '../../../components/organisms/ChangePasswordForm';

export type ChangePasswordRequestValues = ChangePasswordFormValues;

const initialValues: ChangePasswordFormValues = {
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
};

export function useChangePassword(service: AuthService = authService) {
  const [values, setValues] = useState<ChangePasswordFormValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      if (values.new_password !== values.new_password_confirmation) {
        setError('La confirmación de la contraseña no coincide');
        return null;
      }

      const result = await service.changePassword(id, values);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar la contraseña');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setValues,
    loading,
    submit,
    error,
    setError,
    resetValues: () => setValues(initialValues),
  };
}
