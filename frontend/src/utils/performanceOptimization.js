/**
 * Performance Optimization Utilities
 * Device detection and conditional rendering for heavy animations
 */

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth < 768;
};

/**
 * Check if device is low-end
 * Based on hardware concurrency and device memory
 * @returns {boolean}
 */
export const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // Check device memory if available (in GB)
  const memory = navigator.deviceMemory || 4;

  // Consider low-end if <= 2 cores or <= 2GB RAM
  return cores <= 2 || memory <= 2;
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if device supports advanced graphics features
 * @returns {boolean}
 */
export const supportsAdvancedGraphics = () => {
  if (typeof window === 'undefined') return false;

  // Check for backdrop-filter support
  const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') ||
                                   CSS.supports('-webkit-backdrop-filter', 'blur(10px)');

  return supportsBackdropFilter && !isLowEndDevice();
};

/**
 * Determine if heavy animations should be enabled
 * @returns {boolean}
 */
export const shouldEnableHeavyAnimations = () => {
  return !isMobileDevice() &&
         !isLowEndDevice() &&
         !prefersReducedMotion();
};

/**
 * Determine if particles should be enabled
 * @returns {boolean}
 */
export const shouldEnableParticles = () => {
  return !isMobileDevice() &&
         !isLowEndDevice() &&
         !prefersReducedMotion();
};

/**
 * Determine if Ken Burns effect should be enabled
 * @returns {boolean}
 */
export const shouldEnableKenBurns = () => {
  return !isMobileDevice() &&
         !isLowEndDevice();
};

/**
 * Determine if blur effects should be enabled
 * @returns {boolean}
 */
export const shouldEnableBlur = () => {
  return supportsAdvancedGraphics() &&
         !isLowEndDevice();
};

/**
 * Get optimized animation config based on device
 * @returns {object}
 */
export const getOptimizedAnimationConfig = () => {
  const mobile = isMobileDevice();
  const lowEnd = isLowEndDevice();
  const reducedMotion = prefersReducedMotion();

  return {
    enableParticles: shouldEnableParticles(),
    enableKenBurns: shouldEnableKenBurns(),
    enableBlur: shouldEnableBlur(),
    enableHeavyAnimations: shouldEnableHeavyAnimations(),
    enableSmoothScroll: !mobile && !lowEnd && !reducedMotion,
    animationDuration: reducedMotion ? 0 : (mobile ? 0.3 : 0.6),
    transitionDuration: reducedMotion ? 0 : (mobile ? 0.2 : 0.4),
  };
};

/**
 * Log performance metrics (dev only)
 */
export const logPerformanceMetrics = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('[Performance] Optimization Settings');
  console.log('Mobile Device:', isMobileDevice());
  console.log('Low-End Device:', isLowEndDevice());
  console.log('Prefers Reduced Motion:', prefersReducedMotion());
  console.log('CPU Cores:', navigator.hardwareConcurrency || 'unknown');
  console.log('Device Memory:', navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'unknown');
  console.log('Optimized Config:', getOptimizedAnimationConfig());
  console.groupEnd();
};

const performanceOptimization = {
  isMobileDevice,
  isLowEndDevice,
  prefersReducedMotion,
  supportsAdvancedGraphics,
  shouldEnableHeavyAnimations,
  shouldEnableParticles,
  shouldEnableKenBurns,
  shouldEnableBlur,
  getOptimizedAnimationConfig,
  logPerformanceMetrics
};

export default performanceOptimization;
