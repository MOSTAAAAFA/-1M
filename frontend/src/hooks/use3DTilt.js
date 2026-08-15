/**
 * use3DTilt Hook
 * Creates smooth 3D tilt effect on mouse movement
 * Premium card interaction for luxury feel
 */

import { useRef, useEffect, useState } from 'react';

/**
 * 3D tilt effect on hover
 * @param {Object} options - Configuration options
 * @returns {Object} - Element ref and transform styles
 */
export function use3DTilt(options = {}) {
  const {
    maxTilt = 8,           // Maximum tilt angle in degrees
    perspective = 1000,    // Perspective distance
    scale = 1.02,          // Scale on hover
    speed = 400,           // Transition speed in ms
    glare = false,         // Enable glare effect
    glareMaxOpacity = 0.3, // Max glare opacity
    enabled = true,
  } = options;

  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate tilt angles
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * maxTilt;
      const tiltY = ((x - centerX) / centerX) * -maxTilt;

      setTilt({ x: tiltX, y: tiltY });

      // Calculate glare position
      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlarePos({ x: glareX, y: glareY });
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setTilt({ x: 0, y: 0 });
      setGlarePos({ x: 50, y: 50 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, maxTilt, glare]);

  const transformStyle = {
    transform: isHovering
      ? `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale})`
      : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  };

  const glareStyle = glare ? {
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${isHovering ? glareMaxOpacity : 0}) 0%, transparent 50%)`,
    pointerEvents: 'none',
    transition: `opacity ${speed}ms ease-out`,
    zIndex: 2,
  } : null;

  return {
    ref,
    style: transformStyle,
    glareStyle,
    isHovering,
    tilt,
  };
}

/**
 * Magnetic button effect - button follows cursor slightly
 */
export function useMagneticButton(options = {}) {
  const {
    strength = 0.3,  // How much the button moves (0-1)
    speed = 300,     // Transition speed
    enabled = true,
  } = options;

  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const offsetX = (x - centerX) * strength;
      const offsetY = (y - centerY) * strength;

      setOffset({ x: offsetX, y: offsetY });
    };

    const handleMouseEnter = () => setIsHovering(true);

    const handleMouseLeave = () => {
      setIsHovering(false);
      setOffset({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, strength]);

  const magneticStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`,
  };

  return {
    ref,
    style: magneticStyle,
    isHovering,
  };
}

export default use3DTilt;
