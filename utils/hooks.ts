import { useState, useEffect } from 'react';

// Local Storage Hook
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Dark Mode Hook
export function useDarkMode() {
    const [enabled, setEnabled] = useLocalStorage('dark-mode', false);
  
    useEffect(() => {
      const className = 'dark';
      const bodyClass = window.document.body.classList;
      if (enabled) {
        bodyClass.add(className);
      } else {
        bodyClass.remove(className);
      }
    }, [enabled]);
  
    return [enabled, setEnabled] as const;
  }
