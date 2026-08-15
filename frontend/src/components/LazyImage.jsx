import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  style = {},
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
}) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imgRef.current && imageSrc === placeholder) {
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
                setImageSrc(src);
                observer.unobserve(imgRef.current);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '100px',
          }
        );
        observer.observe(imgRef.current);
      } else {
        // Fallback for older browsers
        setImageSrc(src);
      }
    }

    return () => {
      didCancel = true;
      if (observer && observer.unobserve && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, imageSrc, placeholder]);

  return (
    <motion.div
      ref={imgRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0a0a',
        ...style
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: imageLoaded ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setImageLoaded(true)}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
          opacity: imageLoaded ? 1 : 0,
        }}
        loading="lazy"
        decoding="async"
      />
      {!imageLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(201,168,76,0.2)',
              borderTop: '3px solid var(--gold)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
