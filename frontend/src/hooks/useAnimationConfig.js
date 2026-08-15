/**
 * useAnimationConfig Hook
 * Returns animation configuration that respects user's motion preferences
 */

import { useReducedMotion } from '../context/ReducedMotionContext';
import { respectMotionPreference, safeTransition } from '../utils/animationVariants';

/**
 * Hook to get animation-safe variants and transitions
 * Automatically respects prefers-reduced-motion setting
 *
 * @param {Object} variants - Original Framer Motion variants
 * @param {Object} transition - Original transition config
 * @returns {Object} - Safe variants and transition
 */
export function useAnimationConfig(variants, transition = null) {
  const prefersReducedMotion = useReducedMotion();

  return {
    variants: respectMotionPreference(variants, prefersReducedMotion),
    transition: transition ? safeTransition(transition, prefersReducedMotion) : undefined,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Hook to conditionally enable animations
 * @returns {boolean} - Whether animations should be enabled
 */
export function useShouldAnimate() {
  const prefersReducedMotion = useReducedMotion();
  return !prefersReducedMotion;
}

export default useAnimationConfig;
