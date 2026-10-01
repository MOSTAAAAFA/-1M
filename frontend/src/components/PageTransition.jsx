// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS — ROUTE TRANSITION SHELL
//
// This is the SINGLE definition of page-to-page motion. App.js mounts <RouteShell>
// around <Routes> with the pathname as its AnimatePresence key, which is what
// makes exit animations actually fire. Previously <AnimatePresence> wrapped a
// plain <main> whose only child was an unkeyed <Routes>, so it was structurally
// inert and 21 of 23 routes had no transition at all.
//
// Motion budget: opacity + transform only (GPU-composited), no blur/filter on
// the page root. Durations are deliberately asymmetric — exit is faster than
// enter so navigation feels responsive rather than waiting on an outro.
// MotionConfig reducedMotion="user" in App.js neutralises all of it.
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';

export const routeVariants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1], // --ease-cinematic
      // Let the incoming page paint before its children reveal, so skeletons and
      // real content don't cross-fade against each other.
      staggerChildren: 0.04,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 1.002,
    transition: {
      duration: 0.18,
      ease: [0.45, 0, 0.55, 1], // --ease-in-out
    },
  },
};

/**
 * Keyed page container. Must be rendered as the direct AnimatePresence child,
 * keyed by location.pathname, or the exit variant never plays.
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={routeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

/**
 * The route frame: a column that pins the footer to the bottom of short pages
 * while letting long pages scroll naturally. Kept separate from <RouteShell> so
 * the footer sits OUTSIDE the transitioning region and never fades with a page.
 */
export function SiteFrame({ children, footer }) {
  return (
    <div className="site-frame">
      {children}
      {footer}
    </div>
  );
}