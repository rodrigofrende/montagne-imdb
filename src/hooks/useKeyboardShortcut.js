import { useEffect } from 'react';

/**
 * Custom hook to handle keyboard shortcuts
 * 
 * @param {string} key - The key to listen for (e.g., '/', 'Escape')
 * @param {Function} callback - Function to call when key is pressed
 * @param {Object} options - Additional options
 * @param {boolean} options.ctrlKey - Require Ctrl key
 * @param {boolean} options.shiftKey - Require Shift key
 * @param {boolean} options.altKey - Require Alt key
 * @param {boolean} options.preventDefault - Prevent default behavior
 */
export function useKeyboardShortcut(key, callback, options = {}) {
  const {
    ctrlKey,
    shiftKey,
    altKey,
    preventDefault = true,
  } = options;

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the key matches
      const keyMatches = event.key === key;
      
      if (!keyMatches) return;

      // Only check modifiers if they were explicitly specified
      const ctrlMatch = ctrlKey !== undefined ? event.ctrlKey === ctrlKey : true;
      const shiftMatch = shiftKey !== undefined ? event.shiftKey === shiftKey : true;
      const altMatch = altKey !== undefined ? event.altKey === altKey : true;

      const modifiersMatch = ctrlMatch && shiftMatch && altMatch;

      if (modifiersMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, ctrlKey, shiftKey, altKey, preventDefault]);
}

