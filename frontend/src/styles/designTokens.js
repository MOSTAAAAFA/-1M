/**
 * 1M MOTORS DESIGN SYSTEM
 *
 * Centralized design tokens for consistent styling across the application.
 * Based on automotive precision, luxury materials, and studio lighting.
 *
 * Now using Three-Layer Design Token Architecture:
 * Primitive → Semantic → Component
 */

// ═══════════════════════════════════════════════════════════════
// PRIMITIVE TOKENS (Raw Values)
// ═══════════════════════════════════════════════════════════════

export const primitive = {
  color: {
    gold: {
      50: '#FFF8E1',
      100: '#FDE68A',
      200: '#F4D03F',
      300: '#E0C06A',
      400: '#D4B85C',
      500: '#C9A84C',
      600: '#B5923C',
      700: '#A38934',
      800: '#8B7428',
      900: '#6B5A1E',
    },
    black: {
      50: '#27272f',
      100: '#1f1f28',
      200: '#18181f',
      300: '#111117',
      400: '#0f0f15',
      500: '#0a0a0e',
      600: '#050507',
      700: '#030305',
      800: '#020203',
      900: '#010102',
    },
    white: {
      50: '#FFFFFF',
      100: '#F7F6F3',
      200: '#F0EDE8',
      300: 'rgba(240,237,232,0.85)',
      400: 'rgba(240,237,232,0.70)',
      500: 'rgba(240,237,232,0.62)',
      600: 'rgba(240,237,232,0.48)',
      700: 'rgba(240,237,232,0.40)',
      800: 'rgba(240,237,232,0.32)',
      900: 'rgba(240,237,232,0.20)',
    },
    success: '#4ADE80',
    error: '#EF4444',
    warning: '#FBBF24',
    info: '#60A5FA',
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '100px',
  },
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
    '8xl': '120px',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  lineHeight: {
    none: '1',
    tight: '1.1',
    snug: '1.2',
    normal: '1.5',
    relaxed: '1.65',
    loose: '1.8',
  },
  letterSpacing: {
    tighter: '-1px',
    tight: '-0.5px',
    normal: '0',
    wide: '0.2px',
    wider: '0.5px',
    widest: '2px',
    ultra: '4px',
    extreme: '7px',
  },
  radius: {
    none: '0',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '20px',
    '2xl': '32px',
    full: '9999px',
  },
  shadow: {
    none: 'none',
    sm: '0 4px 16px rgba(0,0,0,0.4)',
    md: '0 8px 40px rgba(0,0,0,0.55)',
    lg: '0 20px 80px rgba(0,0,0,0.7)',
    'gold-sm': '0 4px 16px rgba(201,168,76,0.20)',
    'gold-md': '0 8px 32px rgba(201,168,76,0.30)',
    'gold-lg': '0 0 80px rgba(201,168,76,0.30)',
  },
  duration: {
    fast: '150ms',
    normal: '250ms',
    default: '350ms',
    slow: '500ms',
    slower: '700ms',
  },
  easing: {
    default: 'cubic-bezier(0.22, 1, 0.36, 1)',
    inOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

// ═══════════════════════════════════════════════════════════════
// SEMANTIC TOKENS (Purpose Aliases)
// ═══════════════════════════════════════════════════════════════

export const semantic = {
  color: {
    background: primitive.color.black[600],
    'background-alt': primitive.color.black[500],
    'background-elevated': primitive.color.black[300],
    foreground: primitive.color.white[200],
    'foreground-muted': primitive.color.white[500],
    'foreground-subtle': primitive.color.white[600],
    primary: primitive.color.gold[500],
    'primary-hover': primitive.color.gold[300],
    'primary-active': primitive.color.gold[600],
    'primary-foreground': primitive.color.black[600],
    secondary: primitive.color.black[300],
    'secondary-foreground': primitive.color.white[200],
    muted: primitive.color.black[200],
    'muted-foreground': primitive.color.white[500],
    accent: primitive.color.gold[400],
    'accent-foreground': primitive.color.black[600],
    destructive: primitive.color.error,
    'destructive-foreground': primitive.color.white[50],
    border: 'rgba(255,255,255,0.06)',
    'border-strong': 'rgba(255,255,255,0.16)',
    'border-gold': 'rgba(201,168,76,0.30)',
    ring: primitive.color.gold[500],
    success: primitive.color.success,
    warning: primitive.color.warning,
    error: primitive.color.error,
    info: primitive.color.info,
  },
  spacing: {
    'component-xs': primitive.spacing[1],
    'component-sm': primitive.spacing[2],
    'component-md': primitive.spacing[3],
    'component-lg': primitive.spacing[4],
    'section-sm': primitive.spacing[12],
    'section-md': primitive.spacing[16],
    'section-lg': primitive.spacing[20],
    'section-xl': primitive.spacing[24],
  },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT TOKENS
// ═══════════════════════════════════════════════════════════════

export const component = {
  button: {
    'padding-x': primitive.spacing[8],
    'padding-y': primitive.spacing[3],
    radius: primitive.radius.sm,
    'font-size': primitive.fontSize.sm,
    'font-weight': primitive.fontWeight.bold,
    'letter-spacing': primitive.letterSpacing.ultra,
    'min-height': '44px',
    transition: `${primitive.duration.default} ${primitive.easing.default}`,
  },
  card: {
    padding: primitive.spacing[8],
    radius: primitive.radius.xl,
    background: semantic.color['background-elevated'],
    border: `1px solid ${semantic.color.border}`,
    shadow: primitive.shadow.md,
  },
  input: {
    'padding-x': primitive.spacing[4],
    'padding-y': primitive.spacing[3],
    radius: primitive.radius.xl,
    'font-size': primitive.fontSize.base,
    border: `1px solid ${semantic.color.border}`,
    'min-height': '44px',
  },
  nav: {
    height: '72px',
    background: 'rgba(5,5,7,0.85)',
    'backdrop-filter': 'blur(24px)',
    'border-bottom': `1px solid ${semantic.color.border}`,
  },
};

// ═══════════════════════════════════════════════════════════════
// COLOR PALETTE (Legacy - Backward Compatibility)
// ═══════════════════════════════════════════════════════════════

export const colors = {
  // Primary Brand Colors
  black: primitive.color.black[600],
  black2: primitive.color.black[500],
  black3: primitive.color.black[400],

  gold: primitive.color.gold[500],
  goldLight: primitive.color.gold[300],
  goldDim: 'rgba(201,168,76,0.15)',
  goldGlow: 'rgba(201,168,76,0.25)',

  white: primitive.color.white[200],

  // Surface Layers
  surface: primitive.color.black[300],
  surface2: primitive.color.black[200],
  surface3: primitive.color.black[100],

  // Borders
  border: 'rgba(255,255,255,0.06)',
  border2: 'rgba(255,255,255,0.10)',
  border3: 'rgba(255,255,255,0.16)',

  // Opacity Variants
  white70: primitive.color.white[400],
  white60: primitive.color.white[500],
  white40: primitive.color.white[700],
  white20: primitive.color.white[900],
  white10: 'rgba(240,237,232,0.10)',

  // Semantic text roles
  textPrimary: primitive.color.white[200],
  textSecondary: primitive.color.white[500],
  textMuted: primitive.color.white[600],
  textDisabled: primitive.color.white[800],
  goldText: primitive.color.gold[500],
  goldTextDim: primitive.color.gold[600],

  // Accent Colors
  green: primitive.color.success,
  red: primitive.color.error,
};

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY (Legacy - Backward Compatibility)
// ═══════════════════════════════════════════════════════════════

export const typography = {
  fontDisplay: "'Cormorant Garamond', Georgia, serif",
  fontUI: "'Space Grotesk', sans-serif",
  fontBody: "'Inter', sans-serif",

  fontSize: primitive.fontSize,
  fontWeight: primitive.fontWeight,
  lineHeight: primitive.lineHeight,
  letterSpacing: primitive.letterSpacing,
};

// ═══════════════════════════════════════════════════════════════
// SPACING (Legacy - Backward Compatibility)
// ═══════════════════════════════════════════════════════════════

export const spacing = {
  xs: primitive.spacing[1],
  sm: primitive.spacing[2],
  md: primitive.spacing[3],
  lg: primitive.spacing[4],
  xl: primitive.spacing[5],
  '2xl': primitive.spacing[6],
  '3xl': primitive.spacing[8],
  '4xl': primitive.spacing[10],
  '5xl': primitive.spacing[12],
  '6xl': primitive.spacing[16],
  '7xl': primitive.spacing[20],
  '8xl': primitive.spacing[24],
};

// ═══════════════════════════════════════════════════════════════
// RADIUS (Legacy - Backward Compatibility)
// ═══════════════════════════════════════════════════════════════

export const radius = {
  sm: primitive.radius.sm,
  md: primitive.radius.lg,
  lg: primitive.radius.xl,
  xl: primitive.radius['2xl'],
  full: primitive.radius.full,
};

// ═══════════════════════════════════════════════════════════════
// SHADOWS (Legacy - Backward Compatibility)
// ═══════════════════════════════════════════════════════════════

export const shadows = {
  sm: primitive.shadow.sm,
  md: primitive.shadow.md,
  lg: primitive.shadow.lg,
  gold: primitive.shadow['gold-md'],
  goldLg: primitive.shadow['gold-lg'],
};

// ═══════════════════════════════════════════════════════════════
// TRANSITIONS (Legacy - Backward Compatibility)
// ═══════════════════════════════════════════════════════════════

export const transitions = {
  easeOut: primitive.easing.default,
  easeInOut: primitive.easing.inOut,
  duration: primitive.duration,
  default: `${primitive.duration.default} ${primitive.easing.default}`,
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
// LAYOUT (8pt Grid)
// ═══════════════════════════════════════════════════════════════

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
// EXPORT ALL TOKENS
// ═══════════════════════════════════════════════════════════════

export const designTokens = {
  primitive,
  semantic,
  component,
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
