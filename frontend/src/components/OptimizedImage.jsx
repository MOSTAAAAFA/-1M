import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  getBlurPlaceholder,
  getFallbackImage,
  logImagePerformance,
  ImageLoadState
} from '../utils/imageOptimization';
import { durations, easings } from '../utils/animations';

/**
 * OptimizedImage - Premium lazy-loading image component
 * Features:
 * - Blur-up placeholder while loading
 * - Intersection observer for lazy loading
 * - Error handling with fallback
 * - Smooth fade-in animation
 * - Performance monitoring
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
  ...props
}) => {
  const [loadState, setLoadState] = useState(ImageLoadState.IDLE);
  const [imageSrc, setImageSrc] = useState(eager ? src : placeholder || getBlurPlaceholder());
  const imageRef = useRef(null);
  const startTimeRef = useRef(null);

  const loadImage = useCallback(() => {
    setLoadState(ImageLoadState.LOADING);
    startTimeRef.current = performance.now();

    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setLoadState(ImageLoadState.LOADED);

      // Log performance in development
      if (startTimeRef.current) {
        logImagePerformance(src, startTimeRef.current);
      }

      // Call custom onLoad callback
      if (onLoad) onLoad(img);
    };

    img.onerror = () => {
      setImageSrc(fallback || getFallbackImage(width || 800, height || 600, 'Image unavailable'));
      setLoadState(ImageLoadState.ERROR);

      if (onError) onError();
    };

    img.src = src;
  }, [src, width, height, fallback, onLoad, onError]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eager) {
      loadImage();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && loadState === ImageLoadState.IDLE) {
            loadImage();
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0.01
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [src, eager, loadState, loadImage]);

  // Calculate aspect ratio padding if needed
  const aspectRatioStyle = aspectRatio
    ? { paddingBottom: typeof aspectRatio === 'string'
        ? `calc(100% / (${aspectRatio}))`
        : `${(1 / aspectRatio) * 100}%`
      }
    : {};

  return (
    <div
      ref={imageRef}
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
        src={imageSrc}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{
          opacity: loadState === ImageLoadState.LOADED ? 1 : 0.3,
          scale: loadState === ImageLoadState.LOADED ? 1 : 1.05
        }}
        transition={{
          duration: durations.moderate,
          ease: easings.luxury
        }}
        style={{
          position: aspectRatio ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit,
          filter: loadState === ImageLoadState.LOADING ? 'blur(10px)' : 'blur(0px)',
          transition: 'filter 0.3s ease-out',
          ...(loadState === ImageLoadState.ERROR && { opacity: 0.6 })
        }}
        loading={eager ? 'eager' : 'lazy'}
        draggable={false}
      />

      {/* Loading indicator */}
      {loadState === ImageLoadState.LOADING && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <div className="loading-spinner" />
        </motion.div>
      )}
    </div>
  );
};

export default OptimizedImage;
