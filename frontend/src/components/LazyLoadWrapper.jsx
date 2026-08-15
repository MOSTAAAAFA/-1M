import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

/**
 * LazyLoadWrapper - Wrapper for lazy-loaded components
 * Provides a loading fallback with skeleton UI
 */
const LoadingFallback = ({ message = 'Loading...' }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--black)',
      color: 'var(--gold)',
    }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: '3px solid rgba(201,168,76,0.2)',
          borderTop: '3px solid var(--gold)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 24px',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.8)',
        }}
      >
        {message}
      </div>
    </motion.div>

    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function LazyLoadWrapper({ children, fallbackMessage }) {
  return (
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      {children}
    </Suspense>
  );
}
