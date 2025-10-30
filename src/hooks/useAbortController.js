import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage AbortController for fetch requests
 * Automatically aborts previous requests when a new one is made
 * Cleans up on component unmount
 * 
 * @returns {{ getSignal: Function, abort: Function }}
 * 
 * @example
 * const { getSignal, abort } = useAbortController();
 * 
 * const fetchData = async (searchTerm) => {
 *   try {
 *     // getSignal() automatically aborts previous request and returns new signal
 *     const signal = getSignal();
 *     const response = await fetch(`/api/search?q=${searchTerm}`, { signal });
 *     const data = await response.json();
 *     return data;
 *   } catch (error) {
 *     if (error.name === 'AbortError') {
 *       console.log('Request was cancelled');
 *     }
 *   }
 * };
 */
export function useAbortController() {
  const controllerRef = useRef(null);

  // Get a signal for a new request
  // Automatically aborts any previous pending request
  const getSignal = () => {
    // Abort previous request if it exists and hasn't been used yet
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (e) {
        // Ignore if already aborted
      }
    }
    
    // Create and store new controller
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  };

  // Manual abort (rarely needed since getSignal auto-aborts)
  const abort = () => {
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (e) {
        // Ignore if already aborted
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        try {
          controllerRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  return {
    getSignal,
    abort,
  };
}

