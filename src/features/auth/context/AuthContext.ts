import { createContext } from 'react';
import type { LoginResponse } from '../types.ts';

export type AuthContextValue = {
  authData: LoginResponse | null;
  user: LoginResponse['user'] | null;
  setAuthData: (data: LoginResponse) => void;
  clearAuthData: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
