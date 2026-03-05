import { useCallback, useEffect, useState } from 'react';
import { userService, type UserService } from '../services/user.service.ts';
import type { GetUsersResponse } from '../types.ts';

export function useUsers(service: UserService = userService) {
  const [users, setUsers] = useState<GetUsersResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.getAll();
      setUsers(result.data.items);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener los usuarios');
      return null;
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
