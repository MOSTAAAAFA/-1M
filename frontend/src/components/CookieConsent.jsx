import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(17,17,23,0.98) 0%, rgba(25,25,33,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            borderTop: '2px solid rgba(201,168,76,0.3)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            {/* Content */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-9-9c.5 0 1 .1 1.4.3.2.1.4.2.5.4.1.2.2.4.2.6 0 .4-.2.8-.4 1-.3.3-.7.5-1.2.7-.5.2-1 .5-1.4.8-.4.4-.6.9-.6 1.5 0 .6.2 1.1.6 1.5.4.4.9.6 1.5.6.7 0 1.2-.3 1.7-.8.4-.5 1-1 1.6-1.2 1.7-.5 3.3-.4 4.7.3.6.4 1 .9 1.2 1.5.2.6.3 1.2.3 1.8z" />
                  <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none" />
                  <circle cx="14" cy="7" r="1" fill="currentColor" stroke="none" />
                </svg>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  margin: 0,
                }}>
                  Cookie Notice
                </h3>
              </div>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
                color: 'rgba(240,237,232,0.8)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                By clicking "Accept All", you consent to our use of cookies. Read our{' '}
                <a href="/privacy-policy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Privacy Policy</a>.
              </p>
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <motion.button
                onClick={handleDecline}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid rgba(201,168,76,0.3)',
                  background: 'transparent',
                  color: 'rgba(240,237,232,0.7)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
                  e.currentTarget.style.color = 'rgba(240,237,232,1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                  e.currentTarget.style.color = 'rgba(240,237,232,0.7)';
                }}
              >
                Decline
              </motion.button>

              <motion.button
                onClick={handleAccept}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
                  color: '#000',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'none',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(201,168,76,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.4)';
                }}
              >
                Accept All
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
