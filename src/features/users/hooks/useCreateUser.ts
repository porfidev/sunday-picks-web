import { useState } from 'react';
import { userService, type UserService } from '../services/user.service.ts';
import type { CreateUserFormValues } from '../../../components/organisms/UsersForm';

export type CreateUserRequestValues = {
  name: string;
  phone: string;
  email: string;
  password: string;
  is_admin: number;
};

export type UpdateUserRequestValues = {
  name: string;
  phone: string;
  email: string;
  is_admin: number;
  password?: string;
};

export function useCreateUser(service: UserService = userService) {
  const [values, setValues] = useState<CreateUserFormValues>({
    name: '',
    phone: '',
    email: '',
    password: '',
    is_admin: 'false',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.create({
        ...values,
        is_admin: values.is_admin === 'true' ? 1 : 0,
      });
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el usuario');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const payload: UpdateUserRequestValues = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        is_admin: values.is_admin === 'true' ? 1 : 0,
      };

      if (values.password.trim()) {
        payload.password = values.password;
      }

      const result = await service.update(id, payload);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar el usuario');
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
    update,
    error,
  };
}
