import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { useReducedMotion } from '../context/ReducedMotionContext';
import { getOptimizedAnimationConfig } from '../utils/performanceOptimization';

/**
 * LenisSmoothScroll - Premium buttery scrolling (global).
 * Respects prefers-reduced-motion and skips on mobile/low-end devices.
 */
export function LenisSmoothScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const config = getOptimizedAnimationConfig();
    if (!config.enableSmoothScroll) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    window.lenis = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, [reducedMotion]);

  return null;
}

/**
 * ScrollToTop - Resets scroll position to the top on every route change.
 * Uses Lenis when active (instant, no visible jump), native otherwise.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return null;
}

const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * FilmGrain - Subtle animated cinematic noise overlay.
 * Disabled entirely for prefers-reduced-motion users.
 */
export function FilmGrain() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="film-grain"
        style={{
          position: 'fixed',
          inset: '-100%',
          zIndex: 99997,
          pointerEvents: 'none',
          opacity: 0.06,
          willChange: 'transform',
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: 'repeat',
          animation: 'grainShift 1.2s steps(6) infinite',
        }}
      />
      <style>{`
        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-3%, -6%); }
          20% { transform: translate(-10%, 3%); }
          30% { transform: translate(6%, -8%); }
          40% { transform: translate(-4%, 9%); }
          50% { transform: translate(-9%, 2%); }
          60% { transform: translate(8%, 0); }
          70% { transform: translate(-1%, 7%); }
          80% { transform: translate(4%, -4%); }
          90% { transform: translate(-7%, -2%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </>
  );
}
