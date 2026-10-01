// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS - SCROLL PROGRESS BAR
// Gold progress rail pinned to the top of the viewport.
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '../context/ReducedMotionContext.jsx';

export default function ScrollProgressBar() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const springed = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  // A spring lags the finger on fast flicks, which reads as the bar being
  // broken. Reduced-motion users get the raw progress for the same reason.
  const scaleX = reducedMotion ? scrollYProgress : springed;
  // Centre the nub on the progress point. At 0% it is pinned fully on-screen
  // rather than half-clipped by the viewport edge.
  const headX = useTransform(scaleX, (p) => `calc(${p * 100}% - ${p > 0 ? 5 : 0}px)`);

  return (
    <>
      {/* Rail: always visible, so the bar is legible as a bar even at 0%.
          The dark base keeps the gold readable over pale sections, and the
          1px inset highlight keeps it from disappearing into a white hero. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'rgba(10,8,6,0.55)',
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.06)',
          zIndex: 9998,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          // Bright core fading to a lit tip so the leading edge is the
          // brightest point — that is what makes the progress readable.
          background:
            'linear-gradient(90deg, #C9A84C 0%, #E0C06A 70%, #FFF3C4 100%)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 9999,
          // Two shadows do different jobs: a tight one defines the bar, a wide
          // one carries the gold glow onto whatever scrolls underneath it.
          boxShadow:
            '0 0 6px rgba(201,168,76,0.9), 0 0 18px rgba(201,168,76,0.55)',
        }}
      />

      {/* Head marker: a fixed-width cap at the end of the fill. Without it the
          bar's leading edge thins to nothing at low progress values. */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -3,
          left: 0,
          height: 10,
          width: 10,
          borderRadius: '50%',
          background: '#FFF3C4',
          // Position by percentage of the rail so the nub tracks the fill edge.
          x: headX,
          zIndex: 10000,
          boxShadow: '0 0 10px rgba(255,243,196,0.95), 0 0 22px rgba(201,168,76,0.7)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
