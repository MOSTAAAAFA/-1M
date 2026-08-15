/**
 * GSAP + Lenis Smooth Scroll Setup Hook
 * Initializes premium smooth scrolling with GSAP ScrollTrigger integration
 */

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initialize smooth scrolling and GSAP ScrollTrigger
 * @param {boolean} enabled - Whether to enable smooth scroll (disable for reduced motion)
 * @returns {Object} - Lenis instance and GSAP utilities
 */
export function useSmoothScrollSetup(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      // Clean up any existing smooth scroll
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Disable on touch for better mobile performance
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Debug mode (optional - remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Scroll] Smooth scroll initialized');
    }

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      if (process.env.NODE_ENV === 'development') {
        console.log('[Scroll] Smooth scroll destroyed');
      }
    };
  }, [enabled]);

  return { gsap, ScrollTrigger };
}

/**
 * Scroll to element utility
 * @param {string} selector - CSS selector or element
 * @param {Object} options - Scroll options
 */
export function scrollToElement(selector, options = {}) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) return;

  const defaultOptions = {
    offset: 0,
    duration: 1.2,
    ...options,
  };

  // Use Lenis if available, fallback to native smooth scroll
  if (window.lenis) {
    window.lenis.scrollTo(element, defaultOptions);
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export default useSmoothScrollSetup;

