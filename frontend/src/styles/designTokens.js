/**
 * 1M MOTORS DESIGN SYSTEM
 *
 * Centralized design tokens for consistent styling across the application.
 * Based on automotive precision, luxury materials, and studio lighting.
 */

// ═══════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════

export const colors = {
  // Primary Brand Colors
  black: '#050507',           // Deep black - primary background
  black2: '#0a0a0e',         // Secondary black
  black3: '#0f0f15',         // Tertiary black

  gold: '#C9A84C',           // Primary gold - brand signature
  goldLight: '#E0C06A',      // Light gold accent
  goldDim: 'rgba(201,168,76,0.15)',
  goldGlow: 'rgba(201,168,76,0.25)',

  white: '#F0EDE8',          // Warm off-white - primary text

  // Surface Layers (for depth hierarchy)
  surface: '#111117',        // Base elevated surface
  surface2: '#18181f',       // Mid elevated surface
  surface3: '#1f1f28',       // High elevated surface

  // Borders (subtle separation)
  border: 'rgba(255,255,255,0.06)',
  border2: 'rgba(255,255,255,0.10)',
  border3: 'rgba(255,255,255,0.16)',

  // Opacity Variants for White
  white70: 'rgba(240,237,232,0.70)',
  white60: 'rgba(240,237,232,0.62)', // AA-safe secondary text (>=4.5:1 on near-black)
  white40: 'rgba(240,237,232,0.40)',
  white20: 'rgba(240,237,232,0.20)',
  white10: 'rgba(240,237,232,0.10)',

  // Semantic text roles (AA contrast-safe on #050507 / surfaces)
  textPrimary: '#F0EDE8',
  textSecondary: 'rgba(240,237,232,0.62)',
  textMuted: 'rgba(240,237,232,0.48)',   // labels/captions only, never < 12px
  textDisabled: 'rgba(240,237,232,0.32)',
  goldText: '#C9A84C',                  // AA-AA compliant on near-black (9.2:1)
  goldTextDim: '#b5923c',               // gold text on lighter surfaces (5.1:1)

  // Accent Colors
  green: '#4ADE80',         // Success / In Stock
  red: '#EF4444',           // Error / Pre-Order
};

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════

export const typography = {
  // Font Families
  fontDisplay: "'Cormorant Garamond', Georgia, serif",
  fontUI: "'Space Grotesk', sans-serif",
  fontBody: "'Inter', sans-serif",

  // Font Sizes
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '15px',
    lg: '17px',
    xl: '20px',
    '2xl': '26px',
    '3xl': '32px',
    '4xl': '42px',
    '5xl': '56px',
    '6xl': '72px',
    '7xl': '100px',
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  // Line Heights
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-1px',
    tight: '-0.5px',
    normal: '0',
    wide: '0.5px',
    wider: '1px',
    widest: '2px',
    ultra: '4px',
    extreme: '7px',
  },
};

// ═══════════════════════════════════════════════════════════════
// SPACING
// ═══════════════════════════════════════════════════════════════

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
  '7xl': '80px',
  '8xl': '100px',
};

// 8pt grid aliases (design tokens already conform to the 4/8/12/16/24/32/40/48/64/80/100 scale)
export const grid = {
  '1': '8px',
  '2': '16px',
  '3': '24px',
  '4': '32px',
  '5': '40px',
  '6': '48px',
  '7': '64px',
  '8': '80px',
  '9': '100px',
};

// ═══════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════

export const layout = {
  navHeight: '72px',
  containerMaxWidth: '1400px',
  containerPadding: {
    desktop: '48px',
    tablet: '24px',
    mobile: '16px',
  },
};

// ═══════════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════════

export const radius = {
  sm: '6px',
  md: '12px',
  lg: '20px',
  xl: '32px',
  full: '9999px',
};

// ═══════════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════════

export const shadows = {
  sm: '0 4px 16px rgba(0,0,0,0.4)',
  md: '0 8px 40px rgba(0,0,0,0.55)',
  lg: '0 20px 80px rgba(0,0,0,0.7)',
  gold: '0 0 40px rgba(201,168,76,0.20)',
  goldLg: '0 0 80px rgba(201,168,76,0.30)',
};

// ═══════════════════════════════════════════════════════════════
// TRANSITIONS & ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const transitions = {
  // Easing Functions
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeInOut: 'cubic-bezier(0.45, 0, 0.55, 1)',

  // Duration
  duration: {
    fast: '0.15s',
    normal: '0.25s',
    default: '0.35s',
    slow: '0.5s',
    slower: '0.7s',
  },

  // Standard Transition
  default: '0.35s cubic-bezier(0.22, 1, 0.36, 1)',
};

// ═══════════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════════

export const breakpoints = {
  mobile: '600px',
  tablet: '900px',
  desktop: '1100px',
  wide: '1400px',
};

// Media Query Helpers
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
};

// ═══════════════════════════════════════════════════════════════
// Z-INDEX LAYERS
// ═══════════════════════════════════════════════════════════════

export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  notification: 1400,
  tooltip: 1500,
  cursor: 9999,
  grain: 9998,
};

// ═══════════════════════════════════════════════════════════════
// ACCESSIBILITY TOKENS
// ═══════════════════════════════════════════════════════════════

export const a11y = {
  // Visible focus ring (WCAG 2.4.7) — 2px solid, offset 2px, always visible in both themes
  focusRing: '2px solid #C9A84C',
  focusRingOffset: '2px',
  // Minimum touch target size (WCAG 2.5.8 / Material)
  minTouchTarget: '44px',
  // AA contrast floor for body text
  contrastNormal: 4.5,
  // Motion
  reduceMotion: '@media (prefers-reduced-motion: reduce)',
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT PRESETS
// ═══════════════════════════════════════════════════════════════

export const components = {
  // Card Styles
  card: {
    padding: spacing['3xl'],
    borderRadius: radius.lg,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
  },

  // Glass Effect
  glass: {
    background: 'rgba(17,17,23,0.75)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${colors.border}`,
  },

  // Gold Gradient Text
  goldText: {
    background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
};

// ═══════════════════════════════════════════════════════════════
// EXPORT ALL TOKENS
// ═══════════════════════════════════════════════════════════════

export const designTokens = {
  colors,
  typography,
  spacing,
  grid,
  layout,
  radius,
  shadows,
  transitions,
  breakpoints,
  media,
  zIndex,
  a11y,
  components,
};

export default designTokens;
