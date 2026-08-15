import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CryptoPayment = ({ amount, onComplete }) => {
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const cryptos = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: 'btc', rate: 0.0000235 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'eth', rate: 0.000654 },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: 'usdt', rate: 1.00 }
  ];

  const handlePayment = () => {
    if (!selectedCrypto || !walletAddress) {
      alert('Please select crypto and enter wallet address');
      return;
    }
    alert(`Crypto payment initiated! Amount: ${(amount * selectedCrypto.rate).toFixed(6)} ${selectedCrypto.symbol}`);
    onComplete?.();
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'rgba(20,20,20,0.95)',
      border: '1px solid rgba(201,168,76,0.2)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', marginBottom: '16px' }}><CryptoCoinIcon name="btc" size={34} /></div>
        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Cryptocurrency Payment
        </h3>
        <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)' }}>
          Pay with Bitcoin, Ethereum, or USDT
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        {cryptos.map(crypto => (
          <motion.div
            key={crypto.id}
            onClick={() => setSelectedCrypto(crypto)}
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: selectedCrypto?.id === crypto.id
                ? 'rgba(201,168,76,0.2)'
                : 'rgba(255,255,255,0.03)',
              border: selectedCrypto?.id === crypto.id
                ? '2px solid var(--gold)'
                : '1px solid rgba(201,168,76,0.2)',
              marginBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--gold)' }}><CryptoCoinIcon name={crypto.icon} /></div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                  {crypto.name}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.6)' }}>
                  {crypto.symbol}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gold)' }}>
              {(amount * crypto.rate).toFixed(6)}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCrypto && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#fff', marginBottom: '8px' }}>
            Your {selectedCrypto.name} Wallet Address
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      )}

      <motion.button
        onClick={handlePayment}
        disabled={!selectedCrypto || !walletAddress}
        whileHover={{ scale: selectedCrypto && walletAddress ? 1.02 : 1 }}
        whileTap={{ scale: selectedCrypto && walletAddress ? 0.98 : 1 }}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: selectedCrypto && walletAddress
            ? 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)'
            : 'rgba(255,255,255,0.1)',
          border: 'none',
          color: selectedCrypto && walletAddress ? '#000' : 'rgba(240,237,232,0.5)',
          fontSize: '16px',
          fontWeight: 600,
          cursor: selectedCrypto && walletAddress ? 'pointer' : 'not-allowed'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 8, verticalAlign: '-2px' }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Pay with Crypto
      </motion.button>
    </div>
  );
};

export default CryptoPayment;

function CryptoCoinIcon({ name, size = 28 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (name === 'btc') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <path d="M14 7v10" />
      <path d="M10 7v10" />
      <path d="M15 9c-1-1-4-1-4 1s3 1 3 2.5S10.5 15 9.5 14" />
    </svg>
  );
  if (name === 'eth') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 4 6 12l6 3 6-3-6-8z" />
      <path d="m6 12 6 8 6-8" />
    </svg>
  );
  if (name === 'usdt') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 8h6" />
      <path d="M12 8v8" />
      <path d="M7 11h10" />
    </svg>
  );
  return null;
}
