import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        top: '120px',
        right: '24px',
        zIndex: 9999,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.3)',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: theme === 'dark'
          ? '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(201,168,76,0.2)'
          : '0 8px 32px rgba(0,0,0,0.1), 0 0 20px rgba(201,168,76,0.2)',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gold)' }}>
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.3"/>
              <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gold)' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.3"/>
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
