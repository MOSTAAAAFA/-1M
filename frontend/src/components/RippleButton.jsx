import React, { useState } from 'react';

export default function RippleButton({ children, onClick, className, style, ...props }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s ease-out',
            pointerEvents: 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
