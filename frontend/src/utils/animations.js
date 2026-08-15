/**
 * Centralized Animation System
 * Premium easing curves and Framer Motion variants for consistent, luxury feel
 */

// ═══════════════════════════════════════════════════════════════════════════
// EASING CURVES - Custom bezier curves for premium feel
// ═══════════════════════════════════════════════════════════════════════════

export const easings = {
  // Luxury smooth (primary for most interactions)
  luxury: [0.19, 1, 0.22, 1],           // ease-out-expo - sophisticated, confident

  // Power (for bold, impactful moments)
  power: [0.76, 0, 0.24, 1],            // ease-in-out-quart - powerful, dramatic

  // Smooth (subtle, refined transitions)
  smooth: [0.33, 1, 0.68, 1],           // ease-out-cubic - gentle, natural

  // Anticipation (micro-interactions)
  anticipation: [0.68, -0.55, 0.265, 1.55], // back-out - playful spring

  // Linear (for continuous animations like loading)
  linear: [0, 0, 1, 1],

  // Elastic (for playful elements like notifications)
  elastic: [0.68, -0.3, 0.32, 1.3],
};

// ═══════════════════════════════════════════════════════════════════════════
// DURATION CONSTANTS - Consistent timing hierarchy
// ═══════════════════════════════════════════════════════════════════════════

export const durations = {
  instant:  0.15,   // 150ms  - instant feedback (hover, focus)
  fast:     0.3,    // 300ms  - quick transitions (tooltips, dropdowns)
  base:     0.5,    // 500ms  - standard transitions (modals, slides)
  moderate: 0.7,    // 700ms  - deliberate transitions (page sections)
  slow:     1.0,    // 1000ms - dramatic reveals (hero, major sections)
  epic:     1.5,    // 1500ms - cinematic moments (splash, major animations)
};

// ═══════════════════════════════════════════════════════════════════════════
// FRAMER MOTION VARIANTS - Reusable animation presets
// ═══════════════════════════════════════════════════════════════════════════

// Fade animations
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easings.luxury }
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.smooth }
  }
};

// Fade + slide up (cards, sections)
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.moderate, ease: easings.luxury }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: durations.fast, ease: easings.smooth }
  }
};

// Fade + slide down (dropdowns, menus)
export const fadeDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.fast, ease: easings.luxury }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast, ease: easings.smooth }
  }
};

// Scale animations (modals, overlays)
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.base, ease: easings.luxury }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: durations.fast, ease: easings.smooth }
  }
};

// Slide from side (sidebars, drawers)
export const slideVariants = {
  left: {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: durations.moderate, ease: easings.luxury } },
    exit: { x: '-100%', opacity: 0, transition: { duration: durations.fast, ease: easings.smooth } }
  },
  right: {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: durations.moderate, ease: easings.luxury } },
    exit: { x: '100%', opacity: 0, transition: { duration: durations.fast, ease: easings.smooth } }
  },
  up: {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: durations.moderate, ease: easings.luxury } },
    exit: { y: '100%', opacity: 0, transition: { duration: durations.fast, ease: easings.smooth } }
  },
  down: {
    hidden: { y: '-100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: durations.moderate, ease: easings.luxury } },
    exit: { y: '-100%', opacity: 0, transition: { duration: durations.fast, ease: easings.smooth } }
  }
};

// Stagger container (for lists, grids)
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 80ms delay between children
      delayChildren: 0.1,    // 100ms before first child
    }
  }
};

// Stagger item (child of container)
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.moderate, ease: easings.luxury }
  }
};

// Page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.moderate, ease: easings.luxury }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: durations.fast, ease: easings.smooth }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HOVER ANIMATIONS - Consistent hover states
// ═══════════════════════════════════════════════════════════════════════════

export const hoverEffects = {
  // Lift + shadow (cards)
  lift: {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: durations.fast, ease: easings.luxury }
    },
    tap: { scale: 0.98 }
  },

  // Subtle scale (buttons)
  scale: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: durations.instant, ease: easings.anticipation }
    },
    tap: { scale: 0.95 }
  },

  // Glow effect (CTAs)
  glow: {
    rest: { filter: 'brightness(1) drop-shadow(0 0 0px rgba(201, 168, 76, 0))' },
    hover: {
      filter: 'brightness(1.1) drop-shadow(0 0 12px rgba(201, 168, 76, 0.6))',
      transition: { duration: durations.fast, ease: easings.luxury }
    }
  },

  // Magnetic effect (premium buttons)
  magnetic: {
    // Applied via custom hook with useMotionValue
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preference
 * @param {number} duration - Original duration in seconds
 * @returns {number} - Duration (0 if reduced motion, original otherwise)
 */
export const getAnimationDuration = (duration) => {
  return prefersReducedMotion() ? 0 : duration;
};

/**
 * Get animation variant that respects reduced motion
 * @param {object} variants - Framer Motion variants object
 * @returns {object} - Variants (instant if reduced motion, original otherwise)
 */
export const getAccessibleVariants = (variants) => {
  if (prefersReducedMotion()) {
    return {
      hidden: variants.hidden,
      visible: { ...variants.visible, transition: { duration: 0 } },
      exit: { ...variants.exit, transition: { duration: 0 } }
    };
  }
  return variants;
};

/**
 * Create stagger configuration
 * @param {number} staggerDelay - Delay between items in seconds
 * @param {number} initialDelay - Delay before first item in seconds
 * @returns {object} - Stagger configuration
 */
export const createStagger = (staggerDelay = 0.08, initialDelay = 0.1) => ({
  staggerChildren: getAnimationDuration(staggerDelay),
  delayChildren: getAnimationDuration(initialDelay)
});

// ═══════════════════════════════════════════════════════════════════════════
// CSS ANIMATION CLASSES - For non-React animations
// ═══════════════════════════════════════════════════════════════════════════

export const cssAnimations = {
  fadeIn: 'animate-fade-in',
  fadeUp: 'animate-fade-up',
  scaleIn: 'animate-scale-in',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATION CONFIGS - For GSAP ScrollTrigger
// ═══════════════════════════════════════════════════════════════════════════

export const scrollAnimationDefaults = {
  // Fade in on scroll
  fadeIn: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    trigger: { start: 'top 85%', toggleActions: 'play none none reverse' }
  },

  // Parallax effect
  parallax: {
    speed: 0.5, // Multiplier for parallax speed
  },

  // Pin section
  pin: {
    pin: true,
    scrub: 1,
    start: 'top top',
    end: 'bottom top'
  }
};

const animations = {
  easings,
  durations,
  fadeVariants,
  fadeUpVariants,
  fadeDownVariants,
  scaleVariants,
  slideVariants,
  staggerContainerVariants,
  staggerItemVariants,
  pageVariants,
  hoverEffects,
  prefersReducedMotion,
  getAnimationDuration,
  getAccessibleVariants,
  createStagger,
  cssAnimations,
  scrollAnimationDefaults
};

export default animations;
