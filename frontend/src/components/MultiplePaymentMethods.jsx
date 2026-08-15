import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiplePaymentMethods = ({ amount, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoWallet, setCryptoWallet] = useState('');

  const paymentMethods = [
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: 'apple',
      description: 'Fast & secure payment',
      available: true
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      icon: 'google',
      description: 'One-tap checkout',
      available: true
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: 'crypto',
      description: 'BTC, ETH, USDT',
      available: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'card',
      description: 'Visa, Mastercard, Amex',
      available: true
    },
    {
      id: 'tabby',
      name: 'Tabby',
      icon: 'tabby',
      description: 'Split in 4 payments',
      available: true
    },
    {
      id: 'tamara',
      name: 'Tamara',
      icon: 'tamara',
      description: 'Buy now, pay later',
      available: true
    }
  ];

  const PaymentIcon = ({ id }) => {
    const common = { width: '36', height: '36', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
    switch (id) {
      case 'apple': return (
        <svg {...common}>
          <path d="M12 20.94c1.5 0 2.02-.96 3.78-.96 1.78 0 2.4 1.06 4.1 1.06 1.8 0 3.2-1.4 4.12-2.5a.6.6 0 0 0 0-.58c-1.3-.85-2.1-2.1-2.1-3.6 0-1.5.75-2.6 1.9-3.3a.6.6 0 0 0 0-.5c-1.1-1-2.6-1.6-4-1.6-1.8 0-2.9.9-3.8.9-.9 0-2-.9-3.3-.9-1.7 0-3.3.7-4.4 2-1.9 2.4-1.6 7 1 9.9 1.1 1.2 2.4 2 3.7 2z" transform="translate(-2.5 -1.5) scale(0.9)" />
          <path d="M16.5 2a4.5 4.5 0 0 1-1.2 3.5A4.2 4.2 0 0 1 12 6a3.9 3.9 0 0 1 1-3C13.8 1.8 15 1.4 16.5 2z" />
        </svg>
      );
      case 'google': return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.35 11.1H12v2.6h5.35c-.25 1.4-1 2.6-2.05 3.4v2.8h3.3c1.95-1.8 3.05-4.45 3.05-7.5 0-.45-.05-.9-.15-1.3z" />
          <path d="M12 22c2.7 0 5-.9 6.65-2.4l-3.3-2.8c-.9.6-2.1 1-3.35 1-2.6 0-4.8-1.75-5.6-4.1H2.9v2.85A10 10 0 0 0 12 22z" />
          <path d="M6.4 13.7c-.2-.55-.3-1.1-.3-1.7s.1-1.15.3-1.7V7.45H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.4l2.85-2.2.45-.5z" />
          <path d="M12 5.8c1.45 0 2.75.5 3.8 1.45l2.85-2.85A10 10 0 0 0 2 12l3.6 2.8c.8-2.35 3-4.1 5.6-4.1z" />
        </svg>
      );
      case 'crypto': return (
        <svg {...common}>
          <path d="M11.8 22.4C6 22.4 1.2 17.6 1.2 11.8S6 1.2 11.8 1.2 22.4 6 22.4 11.8 17.6 22.4 11.8 22.4z" />
          <path d="M15.5 9.6c-.4-1.5-1.6-2-3.2-2.1V4.7h-1.3v2.8H8.5V4.7H7.2v2.8H4.5v1.5h.9c.4 0 .6.2.6.6v4.8c0 .4-.2.6-.6.6h-.9v1.5h2.7v2.8h1.3v-2.8h2.5v2.8h1.3v-2.8c2.3-.1 3.9-.9 4.3-3.2.3-1.6-.3-2.7-1.6-3.2zM8.5 9.6h3.2c1.2 0 1.9.5 1.9 1.6s-.7 1.6-1.9 1.6H8.5zM12.2 14.4H8.5v-1h3.7c1.3 0 2 .5 2 1.6s-.7 1.6-2 1.6z" transform="translate(1.2 1.2) scale(0.8)" />
        </svg>
      );
      case 'card': return (
        <svg {...common}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
      case 'tabby': return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16a4 4 0 0 1-4-4c0-2 1.8-3 1.8-3s1.2 1 1.2 2c0 .4-.3.8-.3.8s.5 1 1.3 1 1.3-1 1.3-1c0 0-.3-.4-.3-.8 0-1 1.2-2 1.2-2s1.8 1 1.8 3a4 4 0 0 1-4 4z" transform="translate(-0.5 0)" />
        </svg>
      );
      case 'tamara': return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 8.5h5v2h-5zM9.5 13.5h3.5v2H9.5zM15 11.5h2v2h-2z" />
        </svg>
      );
      default: return null;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete?.({
        method: selectedMethod,
        amount,
        status: 'success',
        timestamp: new Date()
      });
    }, 2000);
  };

  const initiateApplePay = () => {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      // Apple Pay logic here
      alert('Apple Pay integration - requires Apple Pay API setup');
    } else {
      alert('Apple Pay is not available on this device');
    }
  };

  const initiateGooglePay = () => {
    // Google Pay logic here
    alert('Google Pay integration - requires Google Pay API setup');
  };

  const initiateCryptoPay = () => {
    if (!cryptoWallet) {
      alert('Please enter your wallet address');
      return;
    }
    alert(`Crypto payment initiated to wallet: ${cryptoWallet}`);
    handlePayment();
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'rgba(20,20,20,0.95)',
      border: '1px solid rgba(201,168,76,0.2)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '8px'
        }}>
          Choose Payment Method
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'rgba(240,237,232,0.6)'
        }}>
          Total: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
            ${amount?.toLocaleString()}
          </span>
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: selectedMethod === method.id
                ? 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: selectedMethod === method.id
                ? '2px solid var(--gold)'
                : '1px solid rgba(201,168,76,0.2)',
              cursor: method.available ? 'pointer' : 'not-allowed',
              opacity: method.available ? 1 : 0.5,
              transition: 'all 0.3s'
            }}
          >
            <div style={{
              marginBottom: '8px',
              textAlign: 'center',
              color: 'var(--gold)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <PaymentIcon id={method.icon} />
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              textAlign: 'center',
              marginBottom: '4px'
            }}>
              {method.name}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(240,237,232,0.6)',
              textAlign: 'center'
            }}>
              {method.description}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedMethod === 'crypto' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: '24px' }}
          >
            <label style={{
              display: 'block',
              fontSize: '13px',
              color: 'rgba(240,237,232,0.8)',
              marginBottom: '8px'
            }}>
              Wallet Address
            </label>
            <input
              type="text"
              value={cryptoWallet}
              onChange={(e) => setCryptoWallet(e.target.value)}
              placeholder="Enter your wallet address"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <div style={{
              marginTop: '12px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.7)' }}>
                Supported: Bitcoin (BTC), Ethereum (ETH), Tether (USDT)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          if (selectedMethod === 'apple-pay') initiateApplePay();
          else if (selectedMethod === 'google-pay') initiateGooglePay();
          else if (selectedMethod === 'crypto') initiateCryptoPay();
          else handlePayment();
        }}
        disabled={!selectedMethod || isProcessing}
        whileHover={{ scale: selectedMethod ? 1.02 : 1 }}
        whileTap={{ scale: selectedMethod ? 0.98 : 1 }}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: selectedMethod && !isProcessing
            ? 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)'
            : 'rgba(255,255,255,0.1)',
          border: 'none',
          color: selectedMethod && !isProcessing ? '#000' : 'rgba(240,237,232,0.5)',
          fontSize: '16px',
          fontWeight: 600,
          cursor: selectedMethod && !isProcessing ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {isProcessing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
            </motion.div>
            Processing...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pay ${amount?.toLocaleString()}
          </>
        )}
      </motion.button>

      <div style={{
        marginTop: '16px',
        padding: '16px',
        borderRadius: '12px',
        background: 'rgba(37,211,102,0.1)',
        border: '1px solid rgba(37,211,102,0.3)'
      }}>
        <div style={{
          fontSize: '12px',
          color: 'rgba(240,237,232,0.7)',
          lineHeight: '1.6'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          </span>
          All payments are secured with 256-bit SSL encryption<br />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          PCI DSS Level 1 compliant<br />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign: 'middle' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </span>
          Full refund within 30 days
        </div>
      </div>
    </div>
  );
};

export default MultiplePaymentMethods;
