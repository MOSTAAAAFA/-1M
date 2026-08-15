import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const TwoFactorAuth = ({ onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      if (code === '123456') {
        onVerify?.(true);
      } else {
        setError('Invalid code. Try again.');
        setIsVerifying(false);
      }
    }, 1500);
  };

  const handleResend = () => {
    alert('New code sent! (Demo: 123456)');
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'rgba(20,20,20,0.95)',
      border: '1px solid rgba(201,168,76,0.2)',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Two-Factor Authentication
        </h3>
        <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)' }}>
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={{
              width: '50px',
              height: '60px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: error ? '2px solid #FF4B4B' : '1px solid rgba(201,168,76,0.3)',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 700,
              textAlign: 'center',
              outline: 'none'
            }}
          />
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(255,75,75,0.1)',
            border: '1px solid rgba(255,75,75,0.3)',
            color: '#FF4B4B',
            fontSize: '13px',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          {error}
        </motion.div>
      )}

      <motion.button
        onClick={handleVerify}
        disabled={isVerifying || otp.join('').length !== 6}
        whileHover={{ scale: otp.join('').length === 6 ? 1.02 : 1 }}
        whileTap={{ scale: otp.join('').length === 6 ? 0.98 : 1 }}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: otp.join('').length === 6 && !isVerifying
            ? 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)'
            : 'rgba(255,255,255,0.1)',
          border: 'none',
          color: otp.join('').length === 6 && !isVerifying ? '#000' : 'rgba(240,237,232,0.5)',
          fontSize: '16px',
          fontWeight: 600,
          cursor: otp.join('').length === 6 && !isVerifying ? 'pointer' : 'not-allowed',
          marginBottom: '16px'
        }}
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </motion.button>

      <button
        onClick={handleResend}
        style={{
          width: '100%',
          padding: '12px',
          background: 'transparent',
          border: 'none',
          color: 'var(--gold)',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        Didn't receive code? Resend
      </button>
    </div>
  );
};

export default TwoFactorAuth;
