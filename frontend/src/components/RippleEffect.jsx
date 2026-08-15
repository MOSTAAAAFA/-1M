import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RippleEffect({ children, color = 'rgba(201,168,76,0.5)', duration = 0.6, className, style = {} }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = useCallback((event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, duration * 1000);
  }, [duration]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      onMouseDown={addRipple}
    >
      {children}

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              borderRadius: '50%',
              background: color,
              pointerEvents: 'none',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function RippleButton({ children, onClick, color, className, style = {}, ...props }) {
  return (
    <RippleEffect color={color} className={className} style={style}>
      <button onClick={onClick} {...props} style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
        {children}
      </button>
    </RippleEffect>
  );
}
