import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EmailMarketingIntegration = () => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    newCars: true,
    promotions: true,
    events: false,
    newsletter: true
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }
    // Simulate API call to Mailchimp/SendGrid
    setTimeout(() => {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 500);
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%)',
      border: '1px solid rgba(201,168,76,0.2)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Stay Updated
        </h3>
        <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.7)' }}>
          Get exclusive deals and new arrivals in your inbox
        </p>
      </div>

      {!isSubscribed ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: '#fff',
              fontSize: '14px',
              marginBottom: '16px',
              outline: 'none'
            }}
          />

          <div style={{ marginBottom: '20px' }}>
            {Object.entries(preferences).map(([key, value]) => (
              <label key={key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => setPreferences({...preferences, [key]: !value})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: '#fff' }}>
                  {key === 'newCars' ? 'New Car Arrivals' :
                   key === 'promotions' ? 'Special Promotions' :
                   key === 'events' ? 'Events & Test Drives' :
                   'Weekly Newsletter'}
                </span>
              </label>
            ))}
          </div>

          <motion.button
            onClick={handleSubscribe}
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
              cursor: 'pointer'
            }}
          >
            Subscribe Now
          </motion.button>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(37,211,102,0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(37,211,102,0.3)'
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#25D366' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#25D366' }}>
            Successfully Subscribed!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EmailMarketingIntegration;
