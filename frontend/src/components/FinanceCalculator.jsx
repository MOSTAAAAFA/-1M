import React, { useState } from 'react';
import { calcFinance, fmtCurrency } from '../utils/finance';
import { colors, radius, typography } from '../styles/designTokens';

const TERMS = [24, 36, 48, 60, 72];

export default function FinanceCalculator({ price }) {
  const [downPct, setDownPct] = useState(20);
  const [apr, setApr] = useState(5.9);
  const [months, setMonths] = useState(60);
  const [open, setOpen] = useState(false);

  const f = calcFinance(price, downPct, apr, months);

  const labelStyle = {
    fontFamily: typography.fontUI,
    fontSize: 10,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: colors.white40,
    marginBottom: 6,
    display: 'block',
  };

  return (
    <div style={{
      marginBottom: '24px',
      border: `1px solid ${open ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.02)',
      overflow: 'hidden',
      transition: 'border-color 0.3s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: colors.white,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', color: '#c9a84c' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </span>
          <span style={{ fontFamily: typography.fontUI, fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#c9a84c' }}>
            Financing Estimate
          </span>
        </span>
        <span style={{ fontFamily: typography.fontDisplay, fontSize: 16, fontWeight: 700, color: '#e0c06a' }}>
          {fmtCurrency(f.monthly)}<span style={{ fontSize: 11, color: colors.white40, fontWeight: 400 }}>/mo</span>
          <span style={{ display: 'inline-block', marginLeft: 10, transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none' }}>⌄</span>
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 18px', display: 'grid', gap: 14, animation: 'fadeUp 0.3s both' }}>
          {/* Down payment */}
          <div>
            <label style={labelStyle}>
              Down Payment — {downPct}%
            </label>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={downPct}
              onChange={e => setDownPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#C9A84C' }}
            />
            <div style={{ fontSize: 12, color: colors.white40, marginTop: 4 }}>
              {fmtCurrency(f.downPayment)}
            </div>
          </div>

          {/* Term */}
          <div>
            <label style={labelStyle}>Loan Term</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {TERMS.map(t => (
                <button
                  key={t}
                  onClick={() => setMonths(t)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: radius.sm,
                    background: months === t ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${months === t ? 'rgba(201,168,76,0.5)' : colors.border2}`,
                    color: months === t ? '#c9a84c' : colors.white70,
                    fontFamily: typography.fontUI,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {t}mo
                </button>
              ))}
            </div>
          </div>

          {/* APR */}
          <div>
            <label style={labelStyle}>APR — {apr}%</label>
            <input
              type="range"
              min={0}
              max={15}
              step={0.1}
              value={apr}
              onChange={e => setApr(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#C9A84C' }}
            />
          </div>

          {/* Breakdown */}
          <div style={{
            borderTop: `1px solid ${colors.border}`,
            paddingTop: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}>
            <Breakdown label="Loan Amount" value={fmtCurrency(f.loan)} />
            <Breakdown label="Total Interest" value={fmtCurrency(f.totalInterest)} />
            <Breakdown label="Total Paid" value={fmtCurrency(f.totalPaid)} />
            <Breakdown label="Monthly" value={fmtCurrency(f.monthly)} gold />
          </div>
        </div>
      )}
    </div>
  );
}

function Breakdown({ label, value, gold }) {
  return (
    <div>
      <div style={{ fontFamily: typography.fontUI, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: colors.white40, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        fontFamily: typography.fontDisplay,
        fontSize: 17,
        fontWeight: 700,
        color: gold ? '#e0c06a' : '#f0ede8',
      }}>
        {value}
      </div>
    </div>
  );
}
