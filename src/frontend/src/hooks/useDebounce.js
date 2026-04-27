/**
 * Debounce Hook - Delays function execution until user stops calling it
 * Useful for search, filters, resize events
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Debounce Function - Traditional debounce utility
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Throttle Function - Limits function calls to once per interval
 * Good for scroll, resize, mousemove events
 */
export const throttle = (func, limit = 1000) => {
  let inThrottle;
  return function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * useThrottle Hook - Throttle values updates
 */
export const useThrottle = (value, limit = 1000) => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRanRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastRanRef.current + limit) {
      lastRanRef.current = now;
      setThrottledValue(value);
    } else {
      const handler = setTimeout(() => {
        lastRanRef.current = Date.now();
        setThrottledValue(value);
      }, limit);

      return () => clearTimeout(handler);
    }
  }, [value, limit]);

  return throttledValue;
};

/**
 * useAsync Hook - Handle async operations with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle');
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
};

/**
 * useLocalStorage Hook - Sync state with localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('useLocalStorage error:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('useLocalStorage error:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

export default {
  useDebounce,
  debounce,
  throttle,
  useThrottle,
  useAsync,
  useLocalStorage,
};
