import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TradeInCalculator = () => {
  const [carDetails, setCarDetails] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    condition: 'good'
  });
  const [estimatedValue, setEstimatedValue] = useState(null);

  const calculate = () => {
    if (!carDetails.brand || !carDetails.model || !carDetails.year || !carDetails.mileage) {
      alert('Please fill all fields');
      return;
    }

    const baseValue = 50000;
    const yearFactor = (2026 - Number(carDetails.year)) * 0.05;
    const mileageFactor = (Number(carDetails.mileage) / 10000) * 0.02;
    const conditionMultiplier = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.6
    };

    const value = baseValue * (1 - yearFactor - mileageFactor) * conditionMultiplier[carDetails.condition];
    setEstimatedValue(Math.max(5000, Math.round(value)));
  };

  return (
    <div style={{
      padding: '32px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
      border: '1px solid rgba(201,168,76,0.2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', color: 'var(--gold)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
            <path d="M3 11h18v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H8v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z" />
            <circle cx="7.5" cy="15.5" r="1.5" />
            <circle cx="16.5" cy="15.5" r="1.5" />
          </svg>
        </div>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--gold)',
            marginBottom: '4px',
          }}>
            Trade-In Estimator
          </h3>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            color: 'rgba(240,237,232,0.6)',
          }}>
            Get instant value for your current car
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <input
          placeholder="Brand (e.g., BMW, Mercedes)"
          value={carDetails.brand}
          onChange={(e) => setCarDetails({...carDetails, brand: e.target.value})}
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,168,76,0.2)',
            color: 'var(--white)',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
        />

        <input
          placeholder="Model (e.g., M5, S-Class)"
          value={carDetails.model}
          onChange={(e) => setCarDetails({...carDetails, model: e.target.value})}
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,168,76,0.2)',
            color: 'var(--white)',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <input
            type="number"
            placeholder="Year"
            value={carDetails.year}
            onChange={(e) => setCarDetails({...carDetails, year: e.target.value})}
            min="1990"
            max="2026"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: 'var(--white)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
          />

          <input
            type="number"
            placeholder="Mileage (km)"
            value={carDetails.mileage}
            onChange={(e) => setCarDetails({...carDetails, mileage: e.target.value})}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: 'var(--white)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
          />
        </div>

        <select
          value={carDetails.condition}
          onChange={(e) => setCarDetails({...carDetails, condition: e.target.value})}
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,168,76,0.2)',
            color: 'var(--white)',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            outline: 'none',
            cursor: 'none',
          }}
        >
          <option value="excellent" style={{ background: 'var(--black)' }}>Excellent Condition</option>
          <option value="good" style={{ background: 'var(--black)' }}>Good Condition</option>
          <option value="fair" style={{ background: 'var(--black)' }}>Fair Condition</option>
          <option value="poor" style={{ background: 'var(--black)' }}>Poor Condition</option>
        </select>

        <motion.button
          onClick={calculate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
            border: 'none',
            color: '#000',
            fontFamily: 'var(--font-ui)',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'none',
            boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
          }}
        >
          Calculate Trade-In Value
        </motion.button>
      </div>

      {estimatedValue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(201,168,76,0.1)',
            border: '2px solid var(--gold)',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.6)',
            marginBottom: '12px',
          }}>
            Estimated Trade-In Value
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--gold)',
            marginBottom: '12px',
          }}>
            ${estimatedValue.toLocaleString()}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            color: 'rgba(240,237,232,0.6)',
            lineHeight: 1.6,
          }}>
            This is an estimate. Final value may vary based on actual condition and market demand.
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TradeInCalculator;
