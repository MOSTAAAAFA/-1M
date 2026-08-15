import React, { useRef, useEffect } from 'react';

export default function Card3DTilt({ children, intensity = 15, shine = true, className, style = {} }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const mouse = useRef({ x: 0.5, y: 0.5, inside: false });

  // Tilt is applied straight to the DOM via rAF - no React re-renders on move,
  // which keeps the animation smooth and cheap. The loop only runs while the
  // cursor is inside the card and pauses when idle.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const reset = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      if (shineRef.current) shineRef.current.style.opacity = '0';
    };

    const stopLoop = () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const startLoop = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      const step = () => {
        if (!runningRef.current) return;
        const { x, y, inside } = mouse.current;

        if (inside) {
          const rotateX = (0.5 - y) * -intensity * 2;
          const rotateY = (x - 0.5) * intensity * 2;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

          if (shineRef.current) {
            shineRef.current.style.background =
              `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(201,168,76,0.25) 0%, transparent 60%)`;
            shineRef.current.style.opacity = '1';
          }
        }

        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
      mouse.current.inside = true;
      startLoop();
    };

    const handleMouseEnter = () => {
      mouse.current.inside = true;
      startLoop();
    };
    const handleMouseLeave = () => {
      mouse.current.inside = false;
      stopLoop();
      reset();
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      stopLoop();
      reset();
    };
  }, [intensity]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        position: 'relative',
        willChange: 'transform',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}

      {shine && (
        <div
          ref={shineRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.25) 0%, transparent 60%)',
            pointerEvents: 'none',
            borderRadius: 'inherit',
            mixBlendMode: 'soft-light',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
}
