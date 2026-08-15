import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RocketIcon } from './icons';

const VRShowroom = () => {
  const [isVRActive, setIsVRActive] = useState(false);

  const startVR = () => {
    if ('xr' in navigator) {
      alert('VR Mode: Requires VR headset (Oculus, HTC Vive, etc.)');
      setIsVRActive(true);
    } else {
      alert('WebXR not supported. VR requires compatible browser and headset.');
    }
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)',
      border: '2px solid rgba(201,168,76,0.3)',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5z" />
          <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
          <path d="M8 21c0-3 1-4 4-4s4 1 4 4" />
        </svg>
      </div>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
        VR Virtual Showroom
      </h2>
      <p style={{ fontSize: '16px', color: 'rgba(240,237,232,0.7)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
        Step into a fully immersive virtual showroom. Explore every detail of our luxury vehicles in virtual reality.
      </p>

      <motion.button
        onClick={startVR}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '20px 40px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
          border: 'none',
          color: '#000',
          fontSize: '18px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        <RocketIcon size={18} /> Launch VR Experience
      </motion.button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px' }}>
        {[
          { icon: 'headset', text: 'VR Headset Required' },
          { icon: 'rotate', text: 'Full 360° View' },
          { icon: 'gamepad', text: 'Interactive Controls' }
        ].map((item, idx) => (
          <div key={idx} style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,168,76,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: 'var(--gold)' }}><VRIcon name={item.icon} /></div>
            <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.7)' }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VRShowroom;

function VRIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (name === 'headset') return (
    <svg {...common}>
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
    </svg>
  );
  if (name === 'rotate') return (
    <svg {...common}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v5h-5" />
    </svg>
  );
  if (name === 'gamepad') return (
    <svg {...common}>
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  );
  return null;
}
