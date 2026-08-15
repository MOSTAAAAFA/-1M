import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function ImageGallery({ images = [], initialIndex = 0, onClose, isOpen }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.1, 3));
    } else {
      setScale(prev => Math.max(prev - 0.1, 1));
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.overlay}
        onClick={onClose}
      >
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Image Container */}
        <motion.div
          style={styles.imageContainer}
          onClick={(e) => e.stopPropagation()}
          onWheel={handleWheel}
        >
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            style={{
              ...styles.image,
              scale,
              x: position.x,
              y: position.y,
            }}
            drag={scale > 1}
            dragElastic={0.1}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              style={{ ...styles.navBtn, left: '40px' }}
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              ←
            </button>
            <button
              style={{ ...styles.navBtn, right: '40px' }}
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              →
            </button>
          </>
        )}

        {/* Zoom Controls */}
        <div style={styles.zoomControls} onClick={(e) => e.stopPropagation()}>
          <button style={styles.zoomBtn} onClick={handleZoomOut}>
            −
          </button>
          <span style={styles.zoomLabel}>{Math.round(scale * 100)}%</span>
          <button style={styles.zoomBtn} onClick={handleZoomIn}>
            +
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div style={styles.thumbnails} onClick={(e) => e.stopPropagation()}>
            {images.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  ...styles.thumbnail,
                  border: idx === currentIndex ? '2px solid #C9A84C' : '2px solid transparent',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentIndex(idx);
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        <div style={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    cursor: 'zoom-out',
  },
  closeBtn: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    width: '48px',
    height: '48px',
    border: 'none',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10001,
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)',
  },
  imageContainer: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'zoom-in',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
    userSelect: 'none',
    cursor: 'grab',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '56px',
    height: '56px',
    border: 'none',
    borderRadius: '50%',
    background: 'rgba(201, 168, 76, 0.2)',
    backdropFilter: 'blur(10px)',
    color: '#C9A84C',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    zIndex: 10001,
  },
  zoomControls: {
    position: 'absolute',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    padding: '12px 20px',
    borderRadius: '50px',
    zIndex: 10001,
  },
  zoomBtn: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '50%',
    background: 'rgba(201, 168, 76, 0.2)',
    color: '#C9A84C',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  zoomLabel: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '50px',
    textAlign: 'center',
  },
  thumbnails: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    maxWidth: '90vw',
    overflowX: 'auto',
    zIndex: 10001,
  },
  thumbnail: {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  counter: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    padding: '8px 16px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: 10001,
  },
};
