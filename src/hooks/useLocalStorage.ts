import { useCallback } from 'react';

export function useLocalStorage<T>(key: string) {
  const setItem = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  const getItem = useCallback((): T | null => {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }, [key]);

  const removeItem = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return {
    getItem,
    removeItem,
    setItem,
  };
}
