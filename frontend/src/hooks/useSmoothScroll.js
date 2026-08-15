import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/animations';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * useSmoothScroll Hook
 * Integrates Lenis smooth scrolling with GSAP ScrollTrigger
 * Provides buttery-smooth, premium scrolling experience
 */
export const useSmoothScroll = (options = {}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Don't apply smooth scrolling if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,           // Smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',   // Scroll direction
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,      // Disable on touch devices (can feel sluggish)
      touchMultiplier: 2,
      infinite: false,
      ...options
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Expose lenis instance globally for programmatic scrolling
    window.lenis = lenis;

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      delete window.lenis;
    };
  }, [options]);

  return lenisRef.current;
};

/**
 * Programmatic scroll helper
 * @param {string|number} target - Element selector or scroll position
 * @param {object} options - Scroll options
 */
export const scrollTo = (target, options = {}) => {
  if (window.lenis) {
    window.lenis.scrollTo(target, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options
    });
  } else {
    // Fallback for browsers without smooth scroll
    const element = typeof target === 'string' ? document.querySelector(target) : null;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', ...options });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }
};

/**
 * Stop scrolling
 */
export const stopScroll = () => {
  if (window.lenis) {
    window.lenis.stop();
  }
};

/**
 * Resume scrolling
 */
export const startScroll = () => {
  if (window.lenis) {
    window.lenis.start();
  }
};

export default useSmoothScroll;
