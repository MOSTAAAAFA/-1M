import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        width: '80px',
        height: '40px',
        borderRadius: '20px',
        border: '1px solid rgba(201,168,76,0.3)',
        background: 'linear-gradient(135deg, rgba(17,17,23,0.9) 0%, rgba(25,25,33,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        cursor: 'none',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
      }}
      aria-label="Toggle language"
    >
      {/* Sliding background */}
      <motion.div
        animate={{
          x: language === 'en' ? 0 : 40,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          position: 'absolute',
          width: '36px',
          height: '32px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
          boxShadow: '0 2px 10px rgba(201,168,76,0.5)',
          left: '4px',
        }}
      />

      {/* EN Text */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        fontWeight: 600,
        color: language === 'en' ? '#000' : 'rgba(240,237,232,0.6)',
        transition: 'color 0.3s ease',
      }}>
        EN
      </div>

      {/* AR Text */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        fontWeight: 600,
        color: language === 'ar' ? '#000' : 'rgba(240,237,232,0.6)',
        transition: 'color 0.3s ease',
      }}>
        AR
      </div>
    </motion.button>
  );
};

export default LanguageSwitcher;
