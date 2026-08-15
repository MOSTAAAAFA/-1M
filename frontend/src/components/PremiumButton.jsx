import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Interactive Button
 * Magnetic pull, weighted hover, gold glow
 */

export function PremiumButton({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  magnetic = true,
  icon = null,
  ...props
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!magnetic || disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;

      setMagneticOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setMagneticOffset({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [magnetic, disabled]);

  const variants = {
    primary: {
      bg: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #C9A84C 100%)',
      color: '#000000',
      border: 'none',
      shadow: '0 8px 32px rgba(201, 168, 76, 0.4)',
      hoverShadow: '0 12px 48px rgba(201, 168, 76, 0.6)',
    },
    secondary: {
      bg: 'transparent',
      color: '#C9A84C',
      border: '2px solid #C9A84C',
      shadow: '0 4px 16px rgba(201, 168, 76, 0.2)',
      hoverShadow: '0 8px 32px rgba(201, 168, 76, 0.4)',
    },
    ghost: {
      bg: 'rgba(201, 168, 76, 0.08)',
      color: '#F0EDE8',
      border: '1px solid rgba(201, 168, 76, 0.3)',
      shadow: 'none',
      hoverShadow: '0 8px 32px rgba(201, 168, 76, 0.2)',
    },
  };

  const sizes = {
    small: { padding: '12px 28px', fontSize: '11px', gap: '8px' },
    medium: { padding: '16px 40px', fontSize: '13px', gap: '12px' },
    large: { padding: '20px 56px', fontSize: '14px', gap: '16px' },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <motion.button
      ref={buttonRef}
      className={`premium-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-magnetic
      data-hover
      animate={{
        x: magneticOffset.x,
        y: magneticOffset.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: currentVariant.color,
        background: currentVariant.bg,
        border: currentVariant.border,
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'none',
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        boxShadow: isHovered ? currentVariant.hoverShadow : currentVariant.shadow,
        transition: 'box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
        ...props.style,
      }}
      {...props}
    >
      {/* Shimmer overlay */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '200%' : '-100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            variant === 'primary'
              ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>

      {/* Glow effect on hover */}
      {isHovered && variant === 'primary' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: -4,
            background: 'radial-gradient(circle, rgba(201,168,76,0.6) 0%, transparent 70%)',
            borderRadius: '8px',
            filter: 'blur(12px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
    </motion.button>
  );
}

export function IconButton({ icon, onClick, size = 40, className = '', ...props }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`icon-button ${className}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-hover
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        padding: 0,
        background: 'rgba(201, 168, 76, 0.08)',
        border: '1px solid rgba(201, 168, 76, 0.3)',
        borderRadius: '50%',
        cursor: 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...props.style,
      }}
      {...props}
    >
      {icon}

      {/* Glow on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.4, scale: 1.5 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: -8,
            background: 'radial-gradient(circle, rgba(201,168,76,0.6) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(12px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
    </motion.button>
  );
}

export default PremiumButton;
