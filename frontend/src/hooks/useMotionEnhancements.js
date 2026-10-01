// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS — MOTION ENHANCEMENTS HOOK
// GSAP-powered animations based on UI UX Pro Max recommendations
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll Reveal Animation (Standard Intensity)
 * Duration: 400-600ms | Easing: power2.out
 *
 * @param {Object} options - Animation options
 * @param {number} options.stagger - Stagger delay between children (default: 0.08s)
 * @param {string} options.start - ScrollTrigger start position (default: 'top 85%')
 * @param {number} options.y - Y offset (default: 24px)
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const {
    stagger = 0.08,
    start = 'top 85%',
    y = 24,
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Render final state immediately
      gsap.set(ref.current.children, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(ref.current.children, {
        opacity: 0,
        y: y,
        duration: 0.5,
        stagger: stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: start,
          toggleActions: 'play none none none',
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, start, y]);

  return ref;
}

/**
 * Hover Micro-interaction (Standard)
 * Duration: 200-300ms | Easing: power2.out
 *
 * @param {Object} options - Hover options
 * @param {number} options.y - Y offset on hover (default: -4px)
 * @param {number} options.scale - Scale on hover (default: 1.02)
 */
export function useHoverLift(options = {}) {
  const ref = useRef(null);
  const { y = -4, scale = 1.02 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const element = ref.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        y: y,
        scale: scale,
        boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
        duration: 0.25,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        y: 0,
        scale: 1,
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: 0.25,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [y, scale]);

  return ref;
}

/**
 * Stagger Animation for Lists
 * Animates children with a stagger effect
 *
 * @param {Object} options - Stagger options
 * @param {number} options.stagger - Delay between items (default: 0.08s)
 * @param {number} options.y - Y offset (default: 24px)
 */
export function useStagger(options = {}) {
  const ref = useRef(null);
  const { stagger = 0.08, y = 24 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(ref.current.children, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(ref.current.children, {
        opacity: 0,
        y: y,
        duration: 0.5,
        stagger: stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, y]);

  return ref;
}

/**
 * Parallax Scroll Effect
 * Creates depth by moving elements at different speeds
 *
 * @param {Object} options - Parallax options
 * @param {number} options.speed - Movement speed (default: 0.5)
 * @param {string} options.direction - Direction: 'y' or 'x' (default: 'y')
 */
export function useParallax(options = {}) {
  const ref = useRef(null);
  const { speed = 0.5, direction = 'y' } = options;

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        [direction]: direction === 'y' ? `${speed * 100}%` : `${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [speed, direction]);

  return ref;
}

/**
 * Fade In Animation
 * Simple fade in with optional slide
 *
 * @param {Object} options - Fade options
 * @param {number} options.delay - Animation delay (default: 0)
 * @param {number} options.y - Y offset (default: 0)
 */
export function useFadeIn(options = {}) {
  const ref = useRef(null);
  const { delay = 0, y = 0 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: y,
        duration: 0.6,
        delay: delay,
        ease: 'power2.out'
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, y]);

  return ref;
}
