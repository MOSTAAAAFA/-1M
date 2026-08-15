// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS - PAGE TRANSITION WRAPPER
// Wraps pages with cinematic transitions
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}
