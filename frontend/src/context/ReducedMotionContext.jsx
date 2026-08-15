import React, { createContext, useContext, useState, useEffect } from 'react';

const ReducedMotionContext = createContext(false);

/**
 * ReducedMotionProvider - Accessibility context for animation preferences
 * Detects and respects user's prefers-reduced-motion setting
 */
export const ReducedMotionProvider = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('[Motion] preference changed:', e.matches ? 'REDUCED' : 'NORMAL');
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return (
    <ReducedMotionContext.Provider value={prefersReducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
};

/**
 * Hook to access reduced motion preference
 * @returns {boolean} - True if user prefers reduced motion
 */
export const useReducedMotion = () => {
  return useContext(ReducedMotionContext);
};

export default ReducedMotionContext;
