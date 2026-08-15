import { useState, useEffect, useRef } from 'react';

export default function useMouseParallax(strength = 20) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      targetPos.current.x = (e.clientX / window.innerWidth - 0.5) * strength;
      targetPos.current.y = (e.clientY / window.innerHeight - 0.5) * strength;
    };

    // Smooth animation with RAF
    const animate = () => {
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      currentPos.current.x += dx * 0.1; // Smooth easing
      currentPos.current.y += dy * 0.1;

      setPosition({ x: currentPos.current.x, y: currentPos.current.y });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength]);

  return position;
}
