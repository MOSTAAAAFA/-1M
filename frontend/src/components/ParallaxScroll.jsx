import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export function ParallaxSection({ children, speed = 0.5, direction = 'vertical', className, style = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const y = useTransform(smoothProgress, [0, 1], [0, direction === 'vertical' ? speed * 200 : 0]);
  const x = useTransform(smoothProgress, [0, 1], [0, direction === 'horizontal' ? speed * 200 : 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        y: direction === 'vertical' ? y : 0,
        x: direction === 'horizontal' ? x : 0,
      }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxImage({ src, alt, speed = 0.3, className, style = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.img
        src={src}
        alt={alt}
        style={{
          y,
          scale,
          width: '100%',
          height: '120%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

export function useParallaxScroll(speed = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const delta = scrollY - lastScrollY;
        lastScrollY = scrollY;

        setOffset(prev => prev + (delta * speed));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return offset;
}

export default ParallaxSection;
