import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CompareSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
  style = {},
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...styles.container,
        ...style,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMove}
    >
      {/* After Image (Full) */}
      <img
        src={afterImage}
        alt={afterLabel}
        style={styles.image}
        draggable={false}
      />

      {/* Before Image (Clipped) */}
      <div
        style={{
          ...styles.beforeContainer,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          style={styles.image}
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <motion.div
        style={{
          ...styles.sliderLine,
          left: `${sliderPosition}%`,
        }}
        animate={{
          boxShadow: isDragging
            ? '0 0 20px rgba(201, 168, 76, 0.8)'
            : '0 0 10px rgba(201, 168, 76, 0.5)',
        }}
      >
        {/* Handle */}
        <motion.div
          style={styles.handle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={styles.arrow}>◀</span>
          <span style={styles.arrow}>▶</span>
        </motion.div>
      </motion.div>

      {/* Labels */}
      <div style={{ ...styles.label, ...styles.labelBefore }}>
        {beforeLabel}
      </div>
      <div style={{ ...styles.label, ...styles.labelAfter }}>
        {afterLabel}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    cursor: 'ew-resize',
    userSelect: 'none',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
  },
  beforeContainer: {
    position: 'absolute',
    inset: 0,
  },
  sliderLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'linear-gradient(180deg, #C9A84C 0%, #E0C06A 50%, #C9A84C 100%)',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
  handle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
    border: '3px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
    cursor: 'grab',
  },
  arrow: {
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  label: {
    position: 'absolute',
    top: '16px',
    padding: '8px 16px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    borderRadius: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    pointerEvents: 'none',
  },
  labelBefore: {
    left: '16px',
  },
  labelAfter: {
    right: '16px',
  },
};
