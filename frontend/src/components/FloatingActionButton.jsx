import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingActionButton({ actions = [], position = 'bottom-right' }) {
  const [isOpen, setIsOpen] = useState(false);

  const positionStyles = {
    'bottom-right': { bottom: '32px', right: '32px' },
    'bottom-left': { bottom: '32px', left: '32px' },
    'top-right': { top: '32px', right: '32px' },
    'top-left': { top: '32px', left: '32px' },
  };

  // Determine action position based on FAB position
  const isLeft = position.includes('left');
  const isTop = position.includes('top');

  return (
    <div style={{ ...styles.container, ...positionStyles[position] }}>
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && actions.map((action, index) => (
          <motion.button
            key={index}
            style={{
              ...styles.actionItem,
              left: isLeft ? 0 : 'auto',
              right: isLeft ? 'auto' : 0,
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: 1,
              x: 0,
              y: isTop ? (60 * (index + 1)) : -(60 * (index + 1)),
            }}
            exit={{ scale: 0, x: 0, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: index * 0.05,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              setIsOpen(false);
            }}
            title={action.label}
          >
            <span style={styles.actionIcon}>{action.icon}</span>
            <span style={{
              ...styles.actionLabel,
              left: isLeft ? '70px' : 'auto',
              right: isLeft ? 'auto' : '70px',
            }}>{action.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        style={styles.mainButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.span
          style={styles.mainIcon}
          animate={{ rotate: isOpen ? 90 : 0 }}
        >
          +
        </motion.span>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    zIndex: 9999,
  },
  mainButton: {
    position: 'relative',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
    color: '#000',
    fontSize: '32px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(201, 168, 76, 0.4), 0 0 20px rgba(201, 168, 76, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
  },
  mainIcon: {
    display: 'block',
    lineHeight: 1,
  },
  actionItem: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(17, 17, 23, 1)',
    color: '#C9A84C',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(201, 168, 76, 0.3)',
    flexDirection: 'column',
  },
  actionIcon: {
    fontSize: '20px',
  },
  actionLabel: {
    position: 'absolute',
    right: '70px',
    padding: '8px 16px',
    background: 'rgba(0, 0, 0, 0.9)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9998,
  },
};
