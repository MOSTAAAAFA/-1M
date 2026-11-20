import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  getFallbackImage,
  logImagePerformance,
  ImageLoadState
} from '../utils/imageOptimization';
import { durations, easings } from '../utils/animations';

/**
 * OptimizedImage - image component with smooth fade-in and error fallback.
 * Uses native browser lazy loading/decoding for faster delivery.
 */
const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  objectFit = 'cover',
  placeholder = null,
  fallback = null,
  onLoad,
  onError,
  eager = false, // Load immediately without lazy loading
  aspectRatio = null, // e.g., "16/9" or 1.778
  fetchPriority,
  ...props
}) => {
  const [loadState, setLoadState] = useState(ImageLoadState.LOADING);
  const [currentSrc, setCurrentSrc] = useState(src);
  const startTimeRef = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    setCurrentSrc(src);
    setLoadState(ImageLoadState.LOADING);
    startTimeRef.current = typeof performance !== 'undefined' ? performance.now() : 0;
  }, [src]);

  const handleLoad = (e) => {
    setLoadState(ImageLoadState.LOADED);
    if (startTimeRef.current) {
      logImagePerformance(src, startTimeRef.current);
    }
    if (onLoad) onLoad(e.target);
  };

  const handleError = () => {
    setCurrentSrc(fallback || getFallbackImage(width || 800, height || 600, 'Image unavailable'));
    setLoadState(ImageLoadState.ERROR);
    if (onError) onError();
  };

  // Calculate aspect ratio padding if needed
  const aspectRatioStyle = aspectRatio
    ? {
        paddingBottom: typeof aspectRatio === 'string'
          ? `calc(100% / (${aspectRatio}))`
          : `${(1 / aspectRatio) * 100}%`
      }
    : {};

  return (
    <div
      className={`optimized-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        ...aspectRatioStyle,
        ...(width && !aspectRatio && { width }),
        ...(height && !aspectRatio && { height })
      }}
      {...props}
    >
      <motion.img
        src={currentSrc}
        alt={alt}
        initial={{ opacity: 0.01 }}
        animate={{ opacity: loadState === ImageLoadState.ERROR ? 0.75 : 1 }}
        transition={{
          duration: durations.fast,
          ease: easings.luxury
        }}
        style={{
          position: aspectRatio ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit,
          ...(placeholder && loadState === ImageLoadState.LOADING
            ? {
                backgroundImage: `url("${placeholder}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }
            : null)
        }}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={fetchPriority || (eager ? 'high' : undefined)}
        draggable={false}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;
