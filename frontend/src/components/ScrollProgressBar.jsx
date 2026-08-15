// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS - SCROLL PROGRESS BAR
// Premium gold progress indicator
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
        transformOrigin: '0%',
        scaleX,
        zIndex: 9999,
        boxShadow: '0 0 20px rgba(201, 168, 76, 0.6)'
      }}
    />
  );
}
