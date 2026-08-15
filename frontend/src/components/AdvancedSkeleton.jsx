import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Skeleton for Card
export const SkeletonCard = ({ height = '400px' }) => (
  <div style={{
    width: '100%',
    height,
    borderRadius: '16px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
    overflow: 'hidden',
  }}>
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

// Skeleton for Text Line
export const SkeletonText = ({ width = '100%', height = '16px' }) => (
  <div style={{
    width,
    height,
    borderRadius: '4px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
  }} />
);

// Skeleton for Product Grid
export const SkeletonProductGrid = ({ count = 8 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <SkeletonCard height="300px" />
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkeletonText width="70%" height="20px" />
          <SkeletonText width="40%" height="16px" />
          <SkeletonText width="50%" height="24px" />
        </div>
      </div>
    ))}
  </div>
);

// Advanced Skeleton with Pulse
export const PulseSkeleton = ({ children, loading }) => {
  if (!loading) return children;

  return (
    <motion.div
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// Loading Screen with Progress
export const LoadingProgress = ({ progress = 0 }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'var(--black)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    zIndex: 99999,
  }}>
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        width: '80px',
        height: '80px',
        border: '4px solid rgba(201,168,76,0.2)',
        borderTop: '4px solid var(--gold)',
        borderRadius: '50%',
      }}
    />

    <div style={{
      width: '300px',
      height: '4px',
      background: 'rgba(201,168,76,0.2)',
      borderRadius: '2px',
      overflow: 'hidden',
    }}>
      <motion.div
        animate={{
          width: `${progress}%`,
        }}
        transition={{
          duration: 0.3,
        }}
        style={{
          height: '100%',
          background: 'linear-gradient(to right, var(--gold), #E0C06A)',
        }}
      />
    </div>

    <div style={{
      fontFamily: 'var(--font-ui)',
      fontSize: '16px',
      color: 'var(--gold)',
      fontWeight: 600,
    }}>
      Loading... {progress}%
    </div>
  </div>
);

export default SkeletonCard;
