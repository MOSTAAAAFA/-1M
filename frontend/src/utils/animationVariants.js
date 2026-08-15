/**
 * Unified Animation Variants Library
 * Framer Motion animation presets for consistent motion design
 */

// Premium easing curves
export const easings = {
  luxury: [0.19, 1, 0.22, 1],      // Smooth, sophisticated
  power: [0.76, 0, 0.24, 1],       // Fast acceleration
  smooth: [0.33, 1, 0.68, 1],      // Gentle, flowing
  bounce: [0.68, -0.55, 0.265, 1.55], // Playful bounce
};

// Durations
export const durations = {
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
  epic: 1.2,
};

// ═══════════════════════════════════════════════════════════════
// PAGE TRANSITIONS
// ═══════════════════════════════════════════════════════════════

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easings.luxury }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: easings.power }
  },
};

export const pageFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// ═══════════════════════════════════════════════════════════════
// REVEAL ANIMATIONS (Scroll-triggered)
// ═══════════════════════════════════════════════════════════════

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easings.luxury }
  },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easings.luxury }
  },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easings.luxury }
  },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easings.luxury }
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easings.smooth }
  },
};

export const scaleOut = {
  visible: { opacity: 1, scale: 1 },
  hidden: {
    opacity: 0,
    scale: 1.08,
    transition: { duration: 0.5, ease: easings.power }
  },
};

// ═══════════════════════════════════════════════════════════════
// STAGGER ANIMATIONS (For grids/lists)
// ═══════════════════════════════════════════════════════════════

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easings.luxury },
  },
};

// ═══════════════════════════════════════════════════════════════
// CARD ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: easings.smooth }
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.4, ease: easings.smooth }
  },
};

export const cardHoverStrong = {
  rest: {
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: easings.luxury }
  },
  hover: {
    scale: 1.03,
    y: -12,
    rotateX: 2,
    transition: { duration: 0.5, ease: easings.luxury }
  },
};

export const imageZoom = {
  rest: { scale: 1 },
  hover: {
    scale: 1.08,
    transition: { duration: 0.7, ease: easings.smooth }
  },
};

export const imageZoomSlow = {
  rest: { scale: 1 },
  hover: {
    scale: 1.12,
    transition: { duration: 1.2, ease: easings.smooth }
  },
};

// ═══════════════════════════════════════════════════════════════
// BUTTON ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const buttonHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.25, ease: easings.power }
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1 }
  },
};

export const buttonGlow = {
  rest: {
    boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
  },
  hover: {
    boxShadow: '0 8px 32px rgba(201,168,76,0.5)',
    transition: { duration: 0.3 }
  },
};

// ═══════════════════════════════════════════════════════════════
// MODAL/OVERLAY ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const modalOverlay = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const modalContent = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: easings.luxury }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.3, ease: easings.power }
  },
};

export const slideInRight = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easings.luxury }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.4, ease: easings.power }
  },
};

export const slideInLeft = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easings.luxury }
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.4, ease: easings.power }
  },
};

export const slideInUp = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easings.luxury }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.4, ease: easings.power }
  },
};

// ═══════════════════════════════════════════════════════════════
// SPECIAL EFFECTS
// ═══════════════════════════════════════════════════════════════

export const float = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const shimmer = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const rotateGlow = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// COUNTER ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const counterVariant = (from = 0, to = 100, duration = 1.5) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      opacity: { duration: 0.3 },
      default: { duration, ease: easings.smooth },
    },
  },
});

// ═══════════════════════════════════════════════════════════════
// ACCESSIBILITY HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Returns simplified variants when reduced motion is preferred
 * @param {Object} variants - Original animation variants
 * @param {boolean} prefersReducedMotion - User preference
 * @returns {Object} - Original or simplified variants
 */
export const respectMotionPreference = (variants, prefersReducedMotion) => {
  if (!prefersReducedMotion) return variants;

  // Return simplified version with no motion, only opacity
  const simplified = {};
  Object.keys(variants).forEach(key => {
    if (typeof variants[key] === 'object' && variants[key] !== null) {
      simplified[key] = {
        opacity: variants[key].opacity !== undefined ? variants[key].opacity : 1,
        transition: { duration: 0.2 },
      };
    }
  });
  return simplified;
};

/**
 * Creates a safe transition that respects motion preferences
 * @param {Object} config - Transition configuration
 * @param {boolean} prefersReducedMotion - User preference
 */
export const safeTransition = (config, prefersReducedMotion) => {
  if (prefersReducedMotion) {
    return { duration: 0.2 };
  }
  return config;
};
