import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton = ({ phoneNumber = '+201234567890', message = 'Hello! I am interested in 1M Motors' }) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9999,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(10,10,14,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(201,168,76,0.5)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.18)',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.4)';
        e.currentTarget.style.borderColor = 'rgba(224,192,106,0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.18)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
      }}
      aria-label="Chat on WhatsApp"
    >
      {/* WhatsApp Icon */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.35))' }}
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16c0 2.825.74 5.49 2.035 7.802L0 32l8.397-2.035A15.952 15.952 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.788 22.612c-.325.913-1.613 1.675-2.638 1.9-.7.15-1.612.269-4.688-.975-3.925-1.588-6.45-5.575-6.65-5.825-.188-.25-1.55-2.05-1.55-3.913 0-1.862.988-2.775 1.338-3.15.35-.375.762-.469 1.012-.469.25 0 .5.006.719.013.231.006.544-.088.85.65.313.75 1.063 2.6 1.156 2.788.094.188.156.406.031.656-.125.25-.188.406-.375.625-.188.219-.394.488-.563.656-.188.188-.381.394-.163.775.219.375.975 1.606 2.094 2.6 1.438 1.282 2.65 1.682 3.025 1.869.375.188.594.156.813-.094.219-.25.938-1.094 1.188-1.469.25-.375.5-.313.844-.188.344.125 2.188 1.031 2.563 1.219.375.188.625.281.719.438.094.156.094.9-.231 1.812z"
          fill="#E0C06A"
        />
      </svg>

      {/* Pulsing gold indicator */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '3px solid rgba(201,168,76,0.55)',
          pointerEvents: 'none',
        }}
      />
    </motion.button>
  );
};

export default WhatsAppButton;
