import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../context/ReducedMotionContext';

/**
 * Drives a pointer-tracked spotlight by writing CSS custom properties directly
 * on the element, bypassing React state so pointer movement never triggers a
 * re-render. Values are applied inside a single rAF and are read by CSS as
 * `--spot-x` / `--spot-y` / `--spot-active`.
 *
 * Motion is disabled when the user prefers reduced motion, and the listener is
 * only attached for fine pointers (no hover-capable touch devices), so phones
 * and tablets do no work at all.
 *
 * @param {React.RefObject<HTMLElement>} ref - element that receives the vars
 * @param {{enabled?: boolean, radius?: number}} [options]
 */
export default function usePointerSpotlight(ref, { enabled = true, radius } = {}) {
  const reducedMotion = useReducedMotion();
  const stateRef = useRef({ x: 0, y: 0, active: false, raf: 0 });

  const radiusVar = radius ? { '--spot-radius': `${radius}px` } : undefined;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    if (reducedMotion) return undefined;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    // A coarse pointer reports hover:none, so skip entirely rather than
    // listening for moves that can never happen.
    if (!fine.matches) return undefined;

    const s = stateRef.current;

    const apply = () => {
      s.raf = 0;
      el.style.setProperty('--spot-x', `${s.x}px`);
      el.style.setProperty('--spot-y', `${s.y}px`);
      el.style.setProperty('--spot-active', s.active ? '1' : '0');
    };
    const schedule = () => {
      if (!s.raf) s.raf = requestAnimationFrame(apply);
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      s.x = e.clientX - r.left;
      s.y = e.clientY - r.top;
      s.active = true;
      schedule();
    };
    // Fade out on leave instead of snapping, so leaving the hero feels soft.
    const onLeave = () => {
      s.active = false;
      schedule();
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [ref, enabled, reducedMotion]);

  return radiusVar;
}
