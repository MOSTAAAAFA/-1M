import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.19, 1, 0.22, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

// Fade In on Scroll
export function FadeInOnScroll({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Slide In from Side
export function SlideIn({ children, direction = 'left', delay = 0 }) {
  const x = direction === 'left' ? -60 : 60;

  return (
    <motion.div
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale In
export function ScaleIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Children
export function StaggerContainer({ children, staggerDelay = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.19, 1, 0.22, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
