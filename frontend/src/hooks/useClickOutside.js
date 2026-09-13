import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect clicks/touches outside an element or Escape key presses.
 * @param {Function} handler Callback when user clicks/taps outside or presses Escape
 * @param {boolean} [active=true] Whether the listener is currently active
 * @returns {React.RefObject} ref to attach to the container element
 */
export function useClickOutside(handler, active = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    // Listen on both mousedown and touchstart to instantly close across desktop and mobile
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler, active]);

  return ref;
}

export default useClickOutside;
