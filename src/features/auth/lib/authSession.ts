import type { LoginResponse } from '../types.ts';

const AUTH_STORAGE_KEY = 'auth_data';
const REMEMBER_SESSION_STORAGE_KEY = 'remember_session';

type SetAuthDataOptions = {
  rememberSession?: boolean;
};

type RefreshResponse = Partial<LoginResponse> & {
  access_token: string;
};

export function getAuthData(): LoginResponse | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as LoginResponse) : null;
}

function getRememberSessionFlag() {
  return localStorage.getItem(REMEMBER_SESSION_STORAGE_KEY) === 'true';
}

export function setAuthData(data: LoginResponse, options: SetAuthDataOptions = {}) {
  const rememberSession = options.rememberSession ?? getRememberSessionFlag();
  const dataToStore: LoginResponse = rememberSession ? data : { ...data, refresh_token: '' };

  localStorage.setItem(REMEMBER_SESSION_STORAGE_KEY, rememberSession.toString());
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dataToStore));
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_SESSION_STORAGE_KEY);
}

export function getAccessToken() {
  return getAuthData()?.access_token ?? null;
}

export function getRefreshToken() {
  if (!getRememberSessionFlag()) {
    return null;
  }

  const refreshToken = getAuthData()?.refresh_token;
  return refreshToken || null;
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
