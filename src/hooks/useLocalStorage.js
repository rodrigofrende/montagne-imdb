import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to persist state in localStorage with robust error handling
 * Automatically syncs state with localStorage
 * Handles QuotaExceededError, JSON corruption, and private mode
 * 
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if key doesn't exist
 * @param {Object} options - Additional options
 * @param {number} options.maxItems - Maximum number of items (for arrays)
 * @param {boolean} options.dedupe - Remove duplicates (for arrays of strings)
 * @param {boolean} options.normalize - Normalize strings (lowercase + trim)
 * @returns {[*, Function, Object]} - [storedValue, setValue, { error, isAvailable }]
 */
export function useLocalStorage(key, initialValue, options = {}) {
  const { maxItems = Infinity, dedupe = false, normalize = false } = options;
  
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  // Check if localStorage is available
  const checkLocalStorageAvailability = useCallback(() => {
    try {
      const testKey = '__localStorage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      setIsAvailable(true);
      return true;
    } catch (e) {
      setIsAvailable(false);
      setError('localStorage is not available (private mode or disabled)');
      console.warn('localStorage is not available:', e);
      return false;
    }
  }, []);

  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (!checkLocalStorageAvailability()) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      const parsed = JSON.parse(item);
      
      // Apply constraints and normalization
      if (Array.isArray(parsed)) {
        let result = parsed;
        
        // Normalize strings in array
        if (normalize && result.every(item => typeof item === 'string')) {
          result = result.map(item => item.toLowerCase().trim());
        }
        
        // Deduplicate array
        if (dedupe) {
          result = [...new Set(result)];
        }
        
        // Limit array length
        if (maxItems < Infinity) {
          result = result.slice(0, maxItems);
        }
        
        return result;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setError(`Failed to read from localStorage: ${error.message}`);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (!isAvailable) {
      return;
    }

    try {
      let valueToStore = storedValue;
      
      // Apply constraints before saving
      if (Array.isArray(valueToStore)) {
        // Normalize strings in array
        if (normalize && valueToStore.every(item => typeof item === 'string')) {
          valueToStore = valueToStore.map(item => item.toLowerCase().trim());
        }
        
        // Deduplicate array
        if (dedupe) {
          valueToStore = [...new Set(valueToStore)];
        }
        
        // Limit array length
        if (maxItems < Infinity) {
          valueToStore = valueToStore.slice(0, maxItems);
        }
      }
      
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setError(null);
    } catch (error) {
      // Handle QuotaExceededError specifically
      if (error.name === 'QuotaExceededError') {
        console.error(`localStorage quota exceeded for key "${key}"`);
        setError('Storage quota exceeded. Try clearing some data.');
        
        // Attempt to clear old data and retry
        try {
          // If it's an array, try keeping only the most recent items
          if (Array.isArray(storedValue) && storedValue.length > 1) {
            const reducedValue = storedValue.slice(0, Math.floor(storedValue.length / 2));
            window.localStorage.setItem(key, JSON.stringify(reducedValue));
            setStoredValue(reducedValue);
            setError('Storage quota exceeded. Reduced stored items.');
          }
        } catch (retryError) {
          console.error('Failed to reduce storage:', retryError);
        }
      } else {
        console.error(`Error setting localStorage key "${key}":`, error);
        setError(`Failed to save to localStorage: ${error.message}`);
      }
    }
  }, [key, storedValue, isAvailable, maxItems, dedupe, normalize]);

  // Enhanced setValue with validation
  const setValue = useCallback((value) => {
    setStoredValue(prevValue => {
      const newValue = value instanceof Function ? value(prevValue) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue, { error, isAvailable }];
}

