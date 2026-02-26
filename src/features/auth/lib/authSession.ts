import type { LoginResponse } from '../types.ts';

const AUTH_STORAGE_KEY = 'auth_data';

type RefreshResponse = Partial<LoginResponse> & {
  access_token: string;
};

export function getAuthData(): LoginResponse | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as LoginResponse) : null;
}

export function setAuthData(data: LoginResponse) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAccessToken() {
  return getAuthData()?.access_token ?? null;
}

export function getRefreshToken() {
  return getAuthData()?.refresh_token ?? null;
}

export function mergeRefreshAuthData(data: RefreshResponse): LoginResponse | null {
  const current = getAuthData();

  if (!current) {
    return null;
  }

  const nextAuthData: LoginResponse = {
    ...current,
    ...data,
    user: data.user ?? current.user,
    refresh_token: data.refresh_token ?? current.refresh_token,
  };

  setAuthData(nextAuthData);

  return nextAuthData;
}

