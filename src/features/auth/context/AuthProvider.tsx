import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { LoginResponse } from '../types.ts';
import {
  clearAuthData as clearStoredAuthData,
  getAuthData,
  setAuthData as setStoredAuthData,
} from '../lib/authSession.ts';
import { AuthContext } from './AuthContext.ts';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [authData, setAuthDataState] = useState<LoginResponse | null>(() => getAuthData());

  const setAuthData = useCallback(
    (data: LoginResponse) => {
      setAuthDataState(data);
      setStoredAuthData(data);
    },
    [],
  );

  const clearAuthData = useCallback(() => {
    setAuthDataState(null);
    clearStoredAuthData();
  }, []);

  const value = useMemo(
    () => ({
      authData,
      user: authData?.user ?? null,
      setAuthData,
      clearAuthData,
    }),
    [authData, clearAuthData, setAuthData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
