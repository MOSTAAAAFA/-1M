import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Premium Custom Cursor with Magnetic Interactions
 * Cursor morphs on hover, magnetic pull to interactive elements
 */

const CURSOR_STATES = {
  default: { scale: 1, mixBlend: 'difference' },
  hover: { scale: 2.5, mixBlend: 'normal' },
  click: { scale: 0.8, mixBlend: 'difference' },
  magnetic: { scale: 1.5, mixBlend: 'normal' },
};

export default function PremiumCursor() {
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState('default');
  const [isVisible, setIsVisible] = useState(false);

  // Smooth cursor position with spring physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let magneticElement = null;

    const handleMouseMove = (e) => {
      setIsVisible(true);

      // Check for magnetic elements
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const magnetic = hoveredElement?.closest('[data-magnetic]');

      if (magnetic && magnetic !== magneticElement) {
        magneticElement = magnetic;
        const rect = magnetic.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Magnetic pull effect
        const pullStrength = 0.3;
        const deltaX = (centerX - e.clientX) * pullStrength;
        const deltaY = (centerY - e.clientY) * pullStrength;

        cursorX.set(e.clientX + deltaX);
        cursorY.set(e.clientY + deltaY);
        setCursorState('magnetic');
      } else if (!magnetic) {
        magneticElement = null;
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        // Check for hover state
        const hoverElement = hoveredElement?.closest('[data-hover], a, button');
        setCursorState(hoverElement ? 'hover' : 'default');
      }
    };

    const handleMouseDown = () => setCursorState('click');
    const handleMouseUp = () => setCursorState('default');
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Add custom cursor class to body
    document.body.classList.add('custom-cursor');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor');
    };
  }, [cursorX, cursorY]);

  const currentState = CURSOR_STATES[cursorState];

  return (
    <motion.div
      ref={cursorRef}
      className="premium-cursor"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorXSpring,
        y: cursorYSpring,
        width: 16,
        height: 16,
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
        mixBlendMode: currentState.mixBlend,
      }}
      animate={{
        scale: currentState.scale,
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
      }}
    >
      {/* Outer ring */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          border: '2px solid',
          borderColor: cursorState === 'hover' ? '#C9A84C' : '#F0EDE8',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          opacity: cursorState === 'click' ? 0.5 : 1,
        }}
      />

      {/* Inner dot */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 4,
          height: 4,
          backgroundColor: cursorState === 'hover' ? '#C9A84C' : '#F0EDE8',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: cursorState === 'click' ? 1.5 : 1,
        }}
      />

      {/* Glow effect on hover */}
      {cursorState === 'hover' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 2 }}
          exit={{ opacity: 0, scale: 0 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            backgroundColor: '#C9A84C',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(8px)',
          }}
        />
      )}
    </motion.div>
  );
}
