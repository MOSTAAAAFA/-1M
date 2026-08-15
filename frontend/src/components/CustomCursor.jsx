import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const glowRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const magnetRef = useRef(null); // { el, rect } cached to avoid layout reads per move
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Check touch device
    if (window.matchMedia('(hover: none)').matches) return;

    // Add class to body to hide default cursor
    document.body.classList.add('custom-cursor');

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setHidden(false);
      startLoop();

      const isHoverable = e.target.closest('a, button, [data-hover], input, select, textarea, label, .car-card');
      setHovered(!!isHoverable);

      // Skip magnetic pull on/inside car cards: they have their own 3D tilt
      // animation (Card3DTilt) and writing transform here would fight it.
      const insideCard = e.target.closest('.car-card');

      // Skip magnetic pull on elements that opt out via [data-no-magnetic].
      // Used on adjacent CTA buttons where the pull would push them toward
      // each other and collapse the gap between them.
      const noMagnet = isHoverable && isHoverable.closest('[data-no-magnetic]');

      // ELITE Premium Magnetic effect - Weighted physics
      if (isHoverable && !insideCard && !noMagnet) {
        // Cache rect per element so we don't force layout on every mousemove
        let cached = magnetRef.current;
        if (!cached || cached.el !== isHoverable) {
          cached = { el: isHoverable, rect: isHoverable.getBoundingClientRect() };
          magnetRef.current = cached;
        }

        const centerX = cached.rect.left + cached.rect.width / 2;
        const centerY = cached.rect.top + cached.rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 140) {
          const strength = 0.2; // Premium magnetic pull
          const x = distX * strength;
          const y = distY * strength;
          isHoverable.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
          isHoverable.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'; // Premium easing
        } else {
          isHoverable.style.transform = '';
          isHoverable.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      } else {
        // Reset any previously magnetized element so it springs back
        if (magnetRef.current?.el) magnetRef.current.el.style.transform = '';
        magnetRef.current = null;
      }
    };

    const onDown  = () => setClicked(true);
    const onUp    = () => setClicked(false);
    const onLeave = () => {
      setHidden(true);
      stopLoop();
      if (magnetRef.current?.el) magnetRef.current.el.style.transform = '';
      magnetRef.current = null;
    };
    const onEnter = () => {
      setHidden(false);
      startLoop();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    // RAF smooth follow with spring physics - PREMIUM
    // Loop only runs while the cursor is visible (mouse on the page)
    const stopLoop = () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const startLoop = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      const step = () => {
        if (!runningRef.current) return;
        const dx = pos.current.x - outerPos.current.x;
        const dy = pos.current.y - outerPos.current.y;
        outerPos.current.x += dx * 0.18; // Premium spring damping
        outerPos.current.y += dy * 0.18;

        if (outerRef.current) {
          outerRef.current.style.transform = `translate(${outerPos.current.x - 25}px, ${outerPos.current.y - 25}px)`;
        }
        if (innerRef.current) {
          innerRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
        }
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${outerPos.current.x - 40}px, ${outerPos.current.y - 40}px)`;
        }

        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };
    startLoop();

    return () => {
      // Remove class from body on cleanup
      document.body.classList.remove('custom-cursor');

      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      stopLoop();
      if (magnetRef.current?.el) magnetRef.current.el.style.transform = '';
    };
  }, []);

  const outerSize = hovered ? 50 : clicked ? 30 : 50;
  const innerSize = hovered ? 8 : clicked ? 2 : 8;
  const glowSize = hovered ? 100 : 80;

  const base = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 99999,
    borderRadius: '50%',
    transition: 'opacity 0.2s, width 0.2s cubic-bezier(0.33, 1, 0.68, 1), height 0.2s cubic-bezier(0.33, 1, 0.68, 1)',
    opacity: hidden ? 0 : 1,
    top: 0, left: 0,
    willChange: 'transform',
  };

  return (
    <>
      {/* Glow background */}
      <div ref={glowRef} style={{
        ...base,
        width: glowSize,
        height: glowSize,
        background: hovered
          ? 'radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.1) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 40%, transparent 70%)',
        filter: 'blur(15px)',
        opacity: hidden ? 0 : (hovered ? 0.8 : 0.4),
      }}/>

      {/* Outer ring */}
      <div ref={outerRef} style={{
        ...base,
        width: outerSize,
        height: outerSize,
        border: hovered
          ? '2px solid rgba(201,168,76,0.9)'
          : clicked
          ? '2px solid rgba(201,168,76,0.6)'
          : '1.5px solid rgba(201,168,76,0.5)',
        background: hovered ? 'rgba(201,168,76,0.1)' : 'transparent',
        boxShadow: hovered
          ? '0 0 20px rgba(201,168,76,0.4), inset 0 0 10px rgba(201,168,76,0.2)'
          : '0 0 10px rgba(201,168,76,0.2)',
      }}/>

      {/* Inner dot */}
      <div ref={innerRef} style={{
        ...base,
        width: innerSize,
        height: innerSize,
        background: 'linear-gradient(135deg, #F4D03F, #C9A84C)',
        boxShadow: hovered
          ? '0 0 15px rgba(201,168,76,0.9), 0 0 30px rgba(201,168,76,0.5)'
          : '0 0 8px rgba(201,168,76,0.6)',
      }}/>
    </>
  );
}