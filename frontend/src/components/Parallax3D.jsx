import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Parallax3D = ({ children, speed = 0.5, depth = 100, className, style }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring animation
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Y movement with spring
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [depth * speed, -depth * speed]),
    springConfig
  );

  // 3D rotation effect
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]),
    springConfig
  );

  const rotateY = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]),
    springConfig
  );

  // Scale effect
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
    springConfig
  );

  // Opacity fade
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        rotateX,
        rotateY,
        scale,
        opacity,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

// Parallax Layer Component for multiple depth layers
export const ParallaxLayer = ({ children, depth = 0, speed = 1 }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        transform: `translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};

// 3D Card with Tilt Effect on Mouse Move
export const Parallax3DCard = ({ children, className, style }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        ...style,
      }}
    >
      <div style={{
        transform: 'translateZ(50px)',
        transformStyle: 'preserve-3d',
      }}>
        {children}
      </div>

      {/* 3D Shadow */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
            transform: 'translateZ(-20px)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
};

// Floating 3D Element
export const Float3D = ({ children, duration = 3 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotateX: [0, 5, 0],
        rotateY: [0, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};

// Depth Layers Container
export const ParallaxContainer = ({ children }) => {
  return (
    <div
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default Parallax3D;
