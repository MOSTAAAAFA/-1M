import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeadsetIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5z" />
    <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
    <path d="M8 21c0-3 1-4 4-4s4 1 4 4" />
  </svg>
);

const ARVirtualShowroom = ({ carModel }) => {
  const [isARActive, setIsARActive] = useState(false);
  const [isARSupported, setIsARSupported] = useState(true);
  const videoRef = useRef(null);

  const startAR = async () => {
    // Check WebXR support
    if ('xr' in navigator) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!supported) {
          alert('AR is not supported on this device. Please use a device with ARCore/ARKit support.');
          return;
        }
        setIsARActive(true);
      } catch (error) {
        alert('AR not available. Demo mode activated.');
        setIsARActive(true);
      }
    } else {
      alert('WebXR not supported. AR feature requires a compatible browser.');
    }
  };

  const stopAR = () => {
    setIsARActive(false);
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%)',
      border: '1px solid rgba(201,168,76,0.2)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}><HeadsetIcon /></div>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '12px'
        }}>
          AR Virtual Showroom
        </h3>
        <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.7)', maxWidth: '500px', margin: '0 auto' }}>
          Experience the car in your space with Augmented Reality. See how it looks in your garage before you buy!
        </p>
      </div>

      {!isARActive ? (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { icon: 'phone', title: 'Mobile AR', desc: 'Use your phone camera' },
              { icon: 'rotate', title: '360° View', desc: 'Rotate and zoom freely' },
              { icon: 'ruler', title: 'Real Scale', desc: 'See actual car dimensions' },
              { icon: 'palette', title: 'Customize', desc: 'Change colors in real-time' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', marginBottom: '8px' }}><ARFeatureIcon name={feature.icon} /></div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.6)' }}>
                  {feature.desc}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={startAR}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
              border: 'none',
              color: '#000',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5z" />
              <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
              <path d="M8 21c0-3 1-4 4-4s4 1 4 4" />
            </svg>
            Launch AR Experience
          </motion.button>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,168,76,0.2)'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.7)', lineHeight: '1.8' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              </span>
              <strong>Requirements:</strong> iOS 13+ (ARKit) or Android 8+ (ARCore)<br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </span>
              <strong>Browser:</strong> Safari, Chrome, or Firefox with WebXR support<br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z" /></svg>
              </span>
              <strong>Tip:</strong> Make sure you have good lighting and enough space
            </div>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#000'
            }}
          >
            {/* AR Viewer (Demo) */}
            <div style={{
              position: 'relative',
              paddingTop: '75%',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ marginBottom: '20px', color: 'var(--gold)' }}
                >
                  <CarPlaceholderIcon />
                </motion.div>
                <div style={{ fontSize: '18px', color: '#fff', fontWeight: 600, marginBottom: '8px' }}>
                  AR Mode Active (Demo)
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)' }}>
                  Move your device to place the car
                </div>
              </div>

              {/* AR Controls Overlay */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '13px',
                  color: '#fff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ display: 'flex' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                  </span>
                  <span>Tracking Active</span>
                </div>
                <motion.button
                  onClick={stopAR}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: 'rgba(255,59,48,0.9)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ✕ Exit AR
                </motion.button>
              </div>

              {/* AR Controls Bottom */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px'
              }}>
                {[
                  { icon: 'rotate', label: 'Rotate' },
                  { icon: 'palette', label: 'Color' },
                  { icon: 'ruler', label: 'Scale' },
                  { icon: 'camera', label: 'Photo' }
                ].map((control, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(201,168,76,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      color: '#000',
                      fontSize: '9px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px'
                    }}
                  >
                    <span style={{ display: 'flex' }}><ARFeatureIcon name={control.icon} size={18} /></span>
                    <span>{control.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ARVirtualShowroom;

function ARFeatureIcon({ name, size = 28 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  switch (name) {
    case 'phone': return (
      <svg {...common}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );
    case 'rotate': return (
      <svg {...common}>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 3v5h-5" />
      </svg>
    );
    case 'ruler': return (
      <svg {...common}>
        <path d="M21.3 8.7 15.3 2.7a1 1 0 0 0-1.4 0l-11.2 11.2a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0L21.3 10a1 1 0 0 0 0-1.3z" />
        <line x1="8" y1="8" x2="9" y2="9" />
        <line x1="11" y1="11" x2="12" y2="12" />
        <line x1="14" y1="14" x2="15" y2="15" />
        <line x1="5" y1="11" x2="6" y2="12" />
      </svg>
    );
    case 'palette': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <path d="M18.5 14a1.5 1.5 0 0 0-1.5 1.5 3 3 0 0 1-3 3 1.5 1.5 0 0 0 0 3" />
      </svg>
    );
    case 'camera': return (
      <svg {...common}>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    );
    default: return null;
  }
}

function CarPlaceholderIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3v-6l2-5h14l2 5v6h-2" />
      <path d="M3 17h18" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
      <path d="M9 6h6l1 5H8z" />
    </svg>
  );
}
