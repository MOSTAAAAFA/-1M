import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cars } from '../data/cars';
import { colors, spacing, radius, typography, shadows, transitions } from '../styles/designTokens';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const MAX_RESULTS = 6;

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q.length >= 2
    ? cars
        .filter(c =>
          `${c.brand} ${c.name} ${c.category} ${c.tagline || ''} ${c.year}`.toLowerCase().includes(q)
        )
        .slice(0, MAX_RESULTS)
    : [];

  const goToCar = (id) => {
    setOpen(false);
    setQuery('');
    navigate(`/car/${id}`);
  };

  const goToCollection = () => {
    setOpen(false);
    setQuery('');
    navigate(`/cars?q=${encodeURIComponent(query.trim())}`);
  };

  const width = compact ? 200 : 240;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${open ? 'rgba(201,168,76,0.5)' : colors.border2}`,
        borderRadius: radius.sm,
        padding: '0 12px',
        height: 40,
        width,
        transition: transitions.default,
        boxShadow: open ? `0 0 0 3px ${colors.goldDim}` : 'none',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.white40} strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (q.length >= 2) setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
            if (e.key === 'Enter' && q) goToCollection();
          }}
          placeholder="Search…"
          aria-label="Search vehicles"
          style={{
            flex: 1,
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: colors.white,
            fontFamily: typography.fontBody,
            fontSize: typography.fontSize.sm,
            padding: `0 0 0 ${spacing.sm}`,
          }}
        />
        {q && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            aria-label="Clear search"
            style={{
              background: 'none', border: 'none', cursor: 'none',
              color: colors.white40, fontSize: 14, padding: 4, lineHeight: 1,
            }}
          >✕</button>
        )}
      </div>

      {open && q.length >= 2 && (
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
          }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: 340,
            maxWidth: '80vw',
            background: 'rgba(13,13,18,0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${colors.goldDim}`,
            borderRadius: radius.md,
            boxShadow: shadows.lg,
            overflow: 'hidden',
            zIndex: 10,
          }}>
            {results.length === 0 ? (
              <div style={{ padding: spacing['2xl'], textAlign: 'center', color: colors.white40, fontSize: typography.fontSize.sm }}>
                No matches for “{query.trim()}”
              </div>
            ) : (
              <>
                {results.map(car => (
                  <button
                    key={car.id}
                    onClick={() => goToCar(car.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: `${spacing.md} ${spacing.lg}`,
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${colors.border}`,
                      cursor: 'none',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.goldDim}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <img
                      src={car.image}
                      alt=""
                      onError={e => { e.currentTarget.style.visibility = 'hidden'; }}
                      style={{ width: 52, height: 36, objectFit: 'cover', borderRadius: 4, flexShrink: 0, background: colors.white10 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: typography.fontUI, fontSize: 10, letterSpacing: typography.letterSpacing.wider, textTransform: 'uppercase', color: colors.gold, marginBottom: 2 }}>
                        {car.brand} · {car.year}
                      </p>
                      <p style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {car.name}
                      </p>
                    </div>
                    <span style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.sm, color: colors.white70, flexShrink: 0 }}>
                      {fmt(car.price)}
                    </span>
                  </button>
                ))}
                <button
                  onClick={goToCollection}
                  style={{
                    width: '100%',
                    padding: `${spacing.md} ${spacing.lg}`,
                    background: 'transparent',
                    border: 'none',
                    color: colors.gold,
                    fontFamily: typography.fontUI,
                    fontSize: 11,
                    fontWeight: typography.fontWeight.bold,
                    letterSpacing: typography.letterSpacing.widest,
                    textTransform: 'uppercase',
                    cursor: 'none',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.goldDim}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  View all results →
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
