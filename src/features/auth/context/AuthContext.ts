import { createContext } from 'react';
import type { LoginResponse } from '../types.ts';

type SetAuthDataOptions = {
  rememberSession?: boolean;
};

export type AuthContextValue = {
  authData: LoginResponse | null;
  user: LoginResponse['user'] | null;
  setAuthData: (data: LoginResponse, options?: SetAuthDataOptions) => void;
  clearAuthData: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
