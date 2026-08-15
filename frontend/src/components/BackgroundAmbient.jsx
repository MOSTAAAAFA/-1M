import React, { useEffect, useRef } from 'react';

export default function BackgroundAmbient({ variant = 'gradient' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (variant === 'gradient') {
      animateGradient(ctx, canvas);
    } else if (variant === 'particles') {
      animateParticles(ctx, canvas);
    } else if (variant === 'noise') {
      animateNoise(ctx, canvas);
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4,
      }}
    />
  );
}

function animateGradient(ctx, canvas) {
  let hue = 0;

  const animate = () => {
    hue = (hue + 0.2) % 360;

    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );

    gradient.addColorStop(0, `hsla(${hue + 40}, 50%, 30%, 0.1)`);
    gradient.addColorStop(0.5, `hsla(${hue}, 60%, 20%, 0.05)`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
  };

  animate();
}

function animateParticles(ctx, canvas) {
  const particles = [];
  const particleCount = 200;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  };

  animate();
}

function animateNoise(ctx, canvas) {
  const animate = () => {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value * 0.78; // R (gold tint)
      data[i + 1] = value * 0.66; // G
      data[i + 2] = value * 0.30; // B
      data[i + 3] = 5; // Alpha (very subtle)
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(animate);
  };

  animate();
}
