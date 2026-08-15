import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BuyNowPayLater = ({ amount }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'tabby',
      name: 'Tabby',
      logo: 'tabby',
      splits: 4,
      fee: 0,
      description: 'Split into 4 payments, no interest'
    },
    {
      id: 'tamara',
      name: 'Tamara',
      logo: 'tamara',
      splits: 3,
      fee: 0,
      description: 'Pay in 3 installments, interest-free'
    }
  ];

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'rgba(20,20,20,0.95)',
      border: '1px solid rgba(201,168,76,0.2)'
    }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        Buy Now, Pay Later
      </h3>

      <div style={{ display: 'grid', gap: '16px' }}>
        {plans.map(plan => (
          <motion.div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '24px',
              borderRadius: '16px',
              background: selectedPlan === plan.id
                ? 'rgba(201,168,76,0.2)'
                : 'rgba(255,255,255,0.03)',
              border: selectedPlan === plan.id
                ? '2px solid var(--gold)'
                : '1px solid rgba(201,168,76,0.2)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)' }}><PlanLogo name={plan.logo} /></div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{plan.name}</div>
                <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.6)' }}>{plan.description}</div>
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gold)' }}>
              ${(amount / plan.splits).toLocaleString()} × {plan.splits}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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
          Continue with {plans.find(p => p.id === selectedPlan)?.name}
        </motion.button>
      )}
    </div>
  );
};

export default BuyNowPayLater;

function PlanLogo({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (name === 'tabby') return (
    <svg {...common}>
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M1 14h6" />
      <path d="M9 8h6" />
      <path d="M17 16h6" />
    </svg>
  );
  if (name === 'tamara') return (
    <svg {...common}>
      <path d="M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0" />
      <path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
    </svg>
  );
  return null;
}
