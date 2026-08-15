import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const AdvancedCarConfigurator = () => {
  const [config, setConfig] = useState({
    color: 'black',
    wheels: 'sport',
    interior: 'leather',
    extras: []
  });

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#DC143C' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Silver', hex: '#C0C0C0' }
  ];

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="13.5" cy="6.5" r=".5" />
          <circle cx="17.5" cy="10.5" r=".5" />
          <circle cx="8.5" cy="7.5" r=".5" />
          <circle cx="6.5" cy="12.5" r=".5" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
        Advanced Car Configurator
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* 3D Preview */}
        <div style={{
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(201,168,76,0.2)',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ color: 'var(--gold)' }}
          >
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
              <path d="M3 11h18v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H8v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z" />
              <circle cx="7.5" cy="15.5" r="1.5" />
              <circle cx="16.5" cy="15.5" r="1.5" />
            </svg>
          </motion.div>
        </div>

        {/* Options */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
              Exterior Color
            </h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              {colors.map(color => (
                <motion.div
                  key={color.name}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setConfig({...config, color: color.name})}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: color.hex,
                    border: config.color === color.name ? '3px solid var(--gold)' : '2px solid rgba(201,168,76,0.2)',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
              Wheels
            </h4>
            <select
              value={config.wheels}
              onChange={(e) => setConfig({...config, wheels: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#fff',
                fontSize: '14px'
              }}
            >
              <option value="standard">Standard 18"</option>
              <option value="sport">Sport 20"</option>
              <option value="premium">Premium 22"</option>
            </select>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            marginTop: '24px'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(240,237,232,0.7)', marginBottom: '8px' }}>
              Total Price
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)' }}>
              $185,000
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
              border: 'none',
              color: '#000',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Configuration
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCarConfigurator;
