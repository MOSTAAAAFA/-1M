import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageZoom = ({ src, alt, className }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={className}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: isZoomed ? 'zoom-out' : 'zoom-in',
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        animate={{
          scale: isZoomed ? 2 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
      />
    </div>
  );
};

// 360 Degree Car Viewer
export const Car360Viewer = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const diff = e.clientX - startX;
    const sensitivity = 5;

    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? -1 : 1;
      const newIndex = (currentIndex + direction + images.length) % images.length;
      setCurrentIndex(newIndex);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          draggable={false}
        />
      </AnimatePresence>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '4px',
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)',
      }}>
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              width: index === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: index === currentIndex ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        color: 'var(--gold)',
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        fontWeight: 600,
      }}>
        360° • {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
};

export default ImageZoom;
