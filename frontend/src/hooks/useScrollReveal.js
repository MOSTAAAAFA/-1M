/**
 * useScrollReveal Hook
 * GSAP ScrollTrigger-based reveal animations
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../context/ReducedMotionContext';

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveal element on scroll with GSAP
 * @param {Object} options - Animation options
 */
export function useScrollReveal(options = {}) {
  const {
    trigger = null,
    animation = 'fadeUp',
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    once = true,
    stagger = 0,
    delay = 0,
  } = options;

  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return;

    const element = ref.current;
    const triggerElement = trigger || element;

    // Animation presets
    const animations = {
      fadeUp: { y: 60, opacity: 0 },
      fadeDown: { y: -60, opacity: 0 },
      fadeLeft: { x: -60, opacity: 0 },
      fadeRight: { x: 60, opacity: 0 },
      scaleIn: { scale: 0.9, opacity: 0 },
      fade: { opacity: 0 },
    };

    const from = animations[animation] || animations.fadeUp;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start,
        end,
        scrub,
        markers: markers && process.env.NODE_ENV === 'development',
        once,
      },
    });

    // Handle stagger for multiple children
    if (stagger > 0 && element.children.length > 0) {
      tl.from(Array.from(element.children), {
        ...from,
        duration: 0.8,
        ease: 'power3.out',
        stagger,
        delay,
      });
    } else {
      tl.from(element, {
        ...from,
        duration: 0.8,
        ease: 'power3.out',
        delay,
      });
    }

    return () => {
      tl.kill();
    };
  }, [animation, start, end, scrub, markers, once, stagger, delay, trigger, prefersReducedMotion, options]);

  return ref;
}

/**
 * Parallax effect on scroll
 */
export function useScrollParallax(speed = 0.5, options = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return;

    const element = ref.current;
    const { start = 'top bottom', end = 'bottom top' } = options;

    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === element) t.kill();
      });
    };
  }, [speed, prefersReducedMotion, options]);

  return ref;
}

/**
 * Pin element while scrolling
 */
export function useScrollPin(options = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return;

    const element = ref.current;
    const { start = 'top top', end = '+=100%', pinSpacing = true } = options;

    ScrollTrigger.create({
      trigger: element,
      start,
      end,
      pin: true,
      pinSpacing,
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === element) t.kill();
      });
    };
  }, [prefersReducedMotion, options]);

  return ref;
}

export default useScrollReveal;
