import React from 'react';
import { motion } from 'framer-motion';

const VideoSoundToggle = ({ isMuted, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        top: '180px',
        right: '24px',
        zIndex: 9999,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.3)',
        background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(201,168,76,0.2)',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      aria-label={isMuted ? "Unmute video" : "Mute video"}
    >
      {isMuted ? (
        // Muted Icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gold)' }}>
          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.3"/>
          <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        // Unmuted Icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gold)' }}>
          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.3"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </motion.button>
  );
};

export default VideoSoundToggle;
