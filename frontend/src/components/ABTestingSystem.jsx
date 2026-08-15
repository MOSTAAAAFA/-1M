import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ABTestingSystem = () => {
  const [activeTests] = useState([
    {
      id: 1,
      name: 'CTA Button Color',
      variants: { A: 'Gold', B: 'Blue' },
      conversions: { A: 23.5, B: 28.3 },
      status: 'running'
    },
    {
      id: 2,
      name: 'Homepage Layout',
      variants: { A: 'Grid', B: 'List' },
      conversions: { A: 19.2, B: 17.8 },
      status: 'running'
    }
  ]);

  return (
    <div style={{ padding: '32px', background: 'rgba(20,20,20,0.95)', borderRadius: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 3H5a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h2a2 2 0 0 0 2 2" transform="translate(2 2)" />
          <path d="M9 3h10" />
          <path d="M9 9h10" />
          <path d="M9 15h10" />
          <line x1="17" y1="3" x2="17" y2="7" />
          <line x1="13" y1="7" x2="13" y2="11" />
          <line x1="17" y1="11" x2="17" y2="15" />
        </svg>
        A/B Testing Dashboard
      </h2>
      {activeTests.map(test => (
        <div key={test.id} style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(201,168,76,0.2)',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
            {test.name}
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {Object.entries(test.variants).map(([key, value]) => (
              <div key={key} style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.6)', marginBottom: '4px' }}>
                  Variant {key}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gold)' }}>
                  {test.conversions[key]}%
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ABTestingSystem;
