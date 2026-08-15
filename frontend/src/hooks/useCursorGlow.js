/**
 * useCursorGlow Hook
 * Creates a dynamic glow effect that follows the cursor over an element
 * Perfect for premium card interactions
 */

import { useState, useRef, useEffect } from 'react';

/**
 * Track cursor position relative to element and create glow effect
 * @param {Object} options - Configuration options
 * @returns {Object} - Ref, mouse position, and glow styles
 */
export function useCursorGlow(options = {}) {
  const {
    glowColor = 'rgba(201, 168, 76, 0.15)',
    glowSize = 300,
    intensity = 600,
    enabled = true,
  } = options;

  const elementRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  // Generate radial gradient glow style
  const glowStyle = isHovering && enabled ? {
    background: `radial-gradient(${glowSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    opacity: intensity,
    transition: 'opacity 0.3s ease-out',
    zIndex: 1,
  } : {
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.3s ease-out',
  };

  return {
    elementRef,
    mousePos,
    isHovering,
    glowStyle,
  };
}

/**
 * Simplified version that returns just the glow overlay element
 * Usage: Place the returned element as first child of your card
 */
export function CursorGlowOverlay({ glowColor, glowSize, intensity, enabled = true }) {
  const { elementRef, glowStyle } = useCursorGlow({
    glowColor,
    glowSize,
    intensity,
    enabled,
  });

  return (
    <>
      <div ref={elementRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div style={glowStyle} />
    </>
  );
}

export default useCursorGlow;
