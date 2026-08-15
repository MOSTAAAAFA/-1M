import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, strength = 0.5, className, style, onClick }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2)
      );

      const maxDistance = 150;

      if (distance < maxDistance) {
        const pull = 1 - distance / maxDistance;
        const x = (e.clientX - buttonCenterX) * pull * strength;
        const y = (e.clientY - buttonCenterY) * pull * strength;
        setPosition({ x, y });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      style={{
        cursor: 'none',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
