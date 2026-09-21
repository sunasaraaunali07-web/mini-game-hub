import { useState, useEffect } from 'react';

/**
 * Custom React hook for storing and synchronizing state with browser localStorage.
 * 
 * Why this is useful for beginners:
 * - It works just like `useState`, but saves data across browser refreshes!
 * - It safely handles situations where localStorage might not be supported or full.
 * 
 * @param key The unique key used in localStorage
 * @param initialValue The fallback default value if nothing is saved yet
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 1. Read stored value or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Save to localStorage whenever storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
