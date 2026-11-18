import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
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
 * ScrollToTop - Resets scroll position to the top on forward navigation,
 * and restores the previous scroll position on back/forward (POP) navigation.
 * Uses Lenis when active, native otherwise.
 */
export function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positionsRef = useRef(new Map());

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const key = location.key || `${location.pathname}${location.search}${location.hash}`;
    const routeKey = `${location.pathname}${location.search}${location.hash}`;
    const savePosition = () => {
      const y = window.lenis ? window.lenis.scroll : window.scrollY;
      positionsRef.current.set(key, y);
      positionsRef.current.set(routeKey, y);
    };

    window.addEventListener('scroll', savePosition, { passive: true });
    return () => {
      savePosition();
      window.removeEventListener('scroll', savePosition);
    };
  }, [location.key, location.pathname, location.search, location.hash]);

  useEffect(() => {
    const key = location.key || `${location.pathname}${location.search}${location.hash}`;
    const routeKey = `${location.pathname}${location.search}${location.hash}`;
    const isPop = navigationType === 'POP';
    const savedY = positionsRef.current.has(key)
      ? positionsRef.current.get(key)
      : positionsRef.current.get(routeKey);

    const scrollToY = (y, immediate = true) => {
      if (window.lenis) {
        window.lenis.scrollTo(y, { immediate });
      } else {
        window.scrollTo({ top: y, left: 0, behavior: immediate ? 'instant' : 'auto' });
      }
    };

    if (isPop && typeof savedY === 'number') {
      // Restore after route content renders/layout settles (content height may grow as images/cards mount)
      let attempts = 0;
      const maxAttempts = 12;
      const tryRestore = () => {
        const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const targetY = Math.min(savedY, maxY);
        scrollToY(targetY, true);
        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(tryRestore, attempts <= 4 ? 60 : 120);
        }
      };
      requestAnimationFrame(() => {
        requestAnimationFrame(tryRestore);
      });
    } else {
      scrollToY(0, true);
    }
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

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
          inset: '-5%',
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
          10% { transform: translate(-1%, -2%); }
          20% { transform: translate(-3%, 1%); }
          30% { transform: translate(2%, -2%); }
          40% { transform: translate(-1%, 2%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(2%, 0); }
          70% { transform: translate(-1%, 2%); }
          80% { transform: translate(1%, -1%); }
          90% { transform: translate(-2%, -1%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </>
  );
}
