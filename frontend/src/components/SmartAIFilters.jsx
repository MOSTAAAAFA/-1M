import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TargetIcon } from './icons';

const SmartAIFilters = () => {
  const [filters, setFilters] = useState({
    budget: [50000, 500000],
    purpose: '',
    experience: ''
  });

  const [recommendations, setRecommendations] = useState([]);

  const handleAIRecommend = () => {
    // Simulate AI recommendation
    const results = [
      { name: 'Porsche 911', match: 95, reason: 'Perfect for sports enthusiasts' },
      { name: 'BMW M5', match: 88, reason: 'Great balance of luxury and performance' }
    ];
    setRecommendations(results);
  };

  return (
    <div style={{ padding: '32px', borderRadius: '24px', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(201,168,76,0.2)' }}>
      <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M12 8V4a1 1 0 0 1 1-1h3" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
        AI Smart Filters
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: '#fff', marginBottom: '8px' }}>
          What will you use the car for?
        </label>
        <select
          value={filters.purpose}
          onChange={(e) => setFilters({...filters, purpose: e.target.value})}
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
          <option value="">Select purpose</option>
          <option value="daily">Daily commute</option>
          <option value="sports">Sports driving</option>
          <option value="family">Family trips</option>
          <option value="luxury">Luxury experience</option>
        </select>
      </div>

      <motion.button
        onClick={handleAIRecommend}
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
          marginBottom: '24px'
        }}
      >
        <TargetIcon size={18} /> Get AI Recommendations
      </motion.button>

      {recommendations.length > 0 && (
        <div>
          {recommendations.map((rec, idx) => (
            <div key={idx} style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{rec.name}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold)' }}>{rec.match}% match</div>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.7)' }}>{rec.reason}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartAIFilters;
