import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus within a modal or dialog
 * Ensures keyboard users stay within the focusable elements
 * Returns focus to the triggering element when closed
 * 
 * @param {boolean} isActive - Whether the focus trap is active
 * @returns {Object} - { trapRef, returnFocusRef }
 * 
 * @example
 * const { trapRef, returnFocusRef } = useFocusTrap(isOpen);
 * 
 * <button ref={returnFocusRef} onClick={open}>Open Modal</button>
 * <div ref={trapRef}>
 *   <Modal />
 * </div>
 */
export function useFocusTrap(isActive) {
  const trapRef = useRef(null);
  const returnFocusRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the element that had focus before opening
    previousFocusRef.current = document.activeElement;

    const trapElement = trapRef.current;
    if (!trapElement) return;

    // Get all focusable elements
    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];

      return trapElement.querySelectorAll(focusableSelectors.join(','));
    };

    // Focus first element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        focusableElements[0]?.focus();
      }, 0);
    }

    // Handle Tab key to trap focus
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element -> go to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
      // Tab on last element -> go to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    trapElement.addEventListener('keydown', handleKeyDown);

    // Cleanup: return focus to previous element
    return () => {
      trapElement.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the element that triggered the modal
      if (returnFocusRef.current) {
        returnFocusRef.current.focus();
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return { trapRef, returnFocusRef };
}

