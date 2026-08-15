import React, { useEffect, useRef } from 'react';

export default function MouseTrail({ color = '#C9A84C', trailLength = 20, size = 4 }) {
  const canvasRef = useRef(null);
  const points = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      points.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      if (points.current.length > trailLength) {
        points.current.shift();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      points.current = points.current.filter(p => now - p.timestamp < 1000);

      for (let i = 0; i < points.current.length; i++) {
        const point = points.current[i];
        const nextPoint = points.current[i + 1];

        const age = now - point.timestamp;
        const opacity = Math.max(0, 1 - age / 1000);
        const currentSize = size * opacity;

        // Gradient trail
        if (nextPoint) {
          const gradient = ctx.createLinearGradient(
            point.x, point.y,
            nextPoint.x, nextPoint.y
          );
          gradient.addColorStop(0, `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${color}${Math.round(opacity * 0.5 * 255).toString(16).padStart(2, '0')}`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = currentSize;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextPoint.x, nextPoint.y);
          ctx.stroke();
        }

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillStyle = `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [color, trailLength, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  );
}

export function ParticleTrail({ color = '#C9A84C', particleCount = 5 }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  const loopRunning = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const startLoop = () => {
      if (loopRunning.current) return;
      loopRunning.current = true;
      const step = () => {
        draw(ctx, canvas);
        if (particles.current.length > 0) {
          animationFrameId.current = requestAnimationFrame(step);
        } else {
          loopRunning.current = false;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
      animationFrameId.current = requestAnimationFrame(step);
    };

    const draw = (ctx, canvas) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.life > 0);

      particles.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.opacity = particle.life;
        particle.size *= 0.98;

        ctx.fillStyle = `${color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Create new particles
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 4 + 2,
          opacity: 1,
          life: 1,
        });
      }

      startLoop();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      loopRunning.current = false;
    };
  }, [color, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  );
}
