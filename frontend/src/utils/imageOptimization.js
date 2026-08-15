/**
 * Image Optimization Utilities
 * Handles lazy loading, blur placeholders, and responsive images
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE URL HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate blur placeholder data URL for smooth loading
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @returns {string} - Data URL for blur placeholder
 */
export const getBlurPlaceholder = (width = 40, height = 30) => {
  // Create a tiny SVG with gradient as placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Optimize image URL (convert to WebP if supported, add query params)
 * @param {string} url - Original image URL
 * @returns {string} - Optimized URL
 */
export const optimizeImageUrl = (url) => {
  // If it's already a data URL or blob, return as-is
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // For external URLs, we can't optimize without a proxy
  // In production, you'd use Cloudinary, Imgix, or similar
  // For now, return original URL
  // TODO: Implement image proxy/CDN in production

  return url;
};

/**
 * Generate srcset for responsive images
 * @param {string} url - Base image URL
 * @param {array} sizes - Array of widths [640, 768, 1024, 1280, 1920]
 * @returns {string} - srcset string
 */
export const generateSrcSet = (url, sizes = [640, 768, 1024, 1280, 1920]) => {
  return sizes
    .map(size => `${optimizeImageUrl(url, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Get optimal image size based on container width
 * @param {number} containerWidth - Container width in pixels
 * @returns {number} - Optimal image width
 */
export const getOptimalImageSize = (containerWidth) => {
  const sizes = [640, 768, 1024, 1280, 1920, 2560];
  const dpr = window.devicePixelRatio || 1;
  const targetWidth = containerWidth * dpr;

  // Find the smallest size that's larger than target
  return sizes.find(size => size >= targetWidth) || sizes[sizes.length - 1];
};

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE PRELOADING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Preload critical images
 * @param {array} urls - Array of image URLs to preload
 * @returns {Promise} - Resolves when all images loaded
 */
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    })
  );
};

/**
 * Preload image with callback
 * @param {string} url - Image URL
 * @param {function} onLoad - Callback when loaded
 * @param {function} onError - Callback on error
 */
export const preloadImage = (url, onLoad, onError) => {
  const img = new Image();
  if (onLoad) img.onload = () => onLoad(img);
  if (onError) img.onerror = onError;
  img.src = url;
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default intersection observer options for lazy loading
 */
export const lazyLoadObserverOptions = {
  root: null,
  rootMargin: '50px', // Start loading 50px before entering viewport
  threshold: 0.01
};

/**
 * Create intersection observer for lazy loading
 * @param {function} callback - Function to call when element intersects
 * @param {object} options - Intersection observer options
 * @returns {IntersectionObserver}
 */
export const createLazyLoadObserver = (callback, options = lazyLoadObserverOptions) => {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for older browsers - load immediately
    return {
      observe: (element) => callback(element),
      unobserve: () => {},
      disconnect: () => {}
    };
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, options);
};

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE LOADING STATES
// ═══════════════════════════════════════════════════════════════════════════

export const ImageLoadState = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

/**
 * Get image dimensions from URL
 * @param {string} url - Image URL
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// ASPECT RATIO HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate aspect ratio padding for responsive containers
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - Padding-bottom percentage
 */
export const getAspectRatioPadding = (width, height) => {
  return `${(height / width) * 100}%`;
};

/**
 * Common aspect ratios for car images
 */
export const aspectRatios = {
  landscape: 16 / 9,    // 1.778
  wide: 21 / 9,         // 2.333
  standard: 4 / 3,      // 1.333
  portrait: 3 / 4,      // 0.75
  square: 1 / 1,        // 1.0
  ultrawide: 32 / 9,    // 3.556
};

// ═══════════════════════════════════════════════════════════════════════════
// FALLBACK IMAGES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate fallback image for broken links
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display
 * @returns {string} - Data URL
 */
export const getFallbackImage = (width = 800, height = 600, text = 'Image unavailable') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text
        x="50%"
        y="50%"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="18"
        fill="#666"
        text-anchor="middle"
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Monitor image loading performance
 * @param {string} url - Image URL
 * @param {number} startTime - Start time (performance.now())
 */
export const logImagePerformance = (url, startTime) => {
  if (process.env.NODE_ENV === 'development') {
    const loadTime = performance.now() - startTime;
    const fileName = url.split('/').pop()?.substring(0, 50) || 'unknown';
    console.log(`[Image] loaded: ${fileName} (${loadTime.toFixed(0)}ms)`);

    if (loadTime > 1000) {
      console.warn(`[Image] slow load: ${fileName} took ${(loadTime/1000).toFixed(2)}s`);
    }
  }
};

const imageOptimization = {
  getBlurPlaceholder,
  optimizeImageUrl,
  generateSrcSet,
  getOptimalImageSize,
  preloadImages,
  preloadImage,
  lazyLoadObserverOptions,
  createLazyLoadObserver,
  ImageLoadState,
  getImageDimensions,
  getAspectRatioPadding,
  aspectRatios,
  getFallbackImage,
  logImagePerformance
};

export default imageOptimization;
