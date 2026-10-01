import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cars } from '../data/cars';
import { useInView } from 'react-intersection-observer';
import { compactPrice } from '../utils/finance';
import { SearchIcon } from '../components/icons';

const SPEC_LABELS = {
  engine: 'Engine',
  horsepower: 'Horsepower',
  torque: 'Torque',
  topSpeed: 'Top Speed',
  acceleration: '0-60 mph',
  transmission: 'Transmission',
  drivetrain: 'Drivetrain',
};

const MAX_COMPARE = 3;

// Numeric specs where we highlight the best
const NUMERIC_KEYS = {
  horsepower: 'high',
  topSpeed: 'high',
  acceleration: 'low', // lower is better for 0-60
};

function parseNumeric(val) {
  if (typeof val === 'number') return val;
  const match = String(val).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function getBest(selected, key) {
  const vals = selected
    .map((c) => parseNumeric(c.specs?.[key]))
    .filter((v) => v !== null && !isNaN(v));
  if (!vals.length) return null;
  return NUMERIC_KEYS[key] === 'high' ? Math.max(...vals) : Math.min(...vals);
}

function CarCard({ car, isSelected, onToggle, disabled }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => !disabled && onToggle(car)}
      style={{
        position: 'relative',
        background: 'rgba(17,17,23,0.75)',
        backdropFilter: 'blur(24px)',
        border: isSelected ? '2px solid #C9A84C' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      whileHover={
        !disabled
          ? {
              y: -8,
              boxShadow: isSelected
                ? '0 20px 60px rgba(201,168,76,0.35), 0 0 40px rgba(201,168,76,0.15)'
                : '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.12), 0 0 0 1px rgba(201,168,76,0.15)',
            }
          : {}
      }
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
        <img
          src={car.image}
          alt={car.name}
          onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/111117/C9A84C?text=${encodeURIComponent(car.brand + ' ' + car.name)}`; }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onMouseEnter={(e) => !disabled && (e.target.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => !disabled && (e.target.style.transform = 'scale(1)')}
          onTouchStart={(e) => !disabled && (e.target.style.transform = 'scale(1.08)')}
          onTouchEnd={(e) => !disabled && setTimeout(() => e.target.style.transform = 'scale(1)', 300)}
        />
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(201,168,76,0.25)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            ✓ SELECTED
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '6px',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          {car.brand}
        </div>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#F0EDE8',
            marginBottom: '12px',
            fontFamily: 'Cormorant Garamond, serif',
            lineHeight: 1.2,
          }}
        >
          {car.name}
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            margin: 'auto -20px -20px',
            background: 'linear-gradient(to top, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.02) 100%)',
            borderTop: '1px solid rgba(201,168,76,0.28)',
          }}
        >
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '22px',
              fontWeight: 700,
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #C9A84C, #E0C06A 60%, #F4D03F)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {compactPrice(car.price)}
          </span>
          <span style={{ color: 'rgba(240,237,232,0.5)', fontSize: '13px', fontWeight: 600 }}>
            {car.specs?.horsepower || 'N/A'}
          </span>
        </div>
      </div>

      {/* Select indicator */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#050507',
            fontWeight: 900,
            fontSize: '16px',
            boxShadow: '0 4px 16px rgba(201,168,76,0.5)',
          }}
        >
          ✓
        </div>
      )}
    </motion.div>
  );
}

export default function Compare() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [comparing, setComparing] = useState(false);

  const filtered = cars.filter(
    (c) =>
      `${c.brand} ${c.name} ${c.year}`.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find((s) => s.id === c.id)
  );

  const toggle = (car) => {
    if (selected.find((s) => s.id === car.id)) {
      setSelected(selected.filter((s) => s.id !== car.id));
    } else if (selected.length < MAX_COMPARE) {
      setSelected([...selected, car]);
    }
  };

  const remove = (id) => setSelected(selected.filter((s) => s.id !== id));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050507',
        paddingTop: '72px',
        position: 'relative',
      }}
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '80px 48px 40px',
          background: 'linear-gradient(180deg, rgba(10,10,14,0.8) 0%, rgba(5,5,7,0) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '12px',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            SIDE BY SIDE
          </div>
          <h1
            style={{
              fontSize: 'clamp(42px, 5vw, 64px)',
              fontWeight: 700,
              color: '#F0EDE8',
              margin: '0 0 16px',
              fontFamily: 'Cormorant Garamond, serif',
              letterSpacing: '-0.02em',
            }}
          >
            Compare Vehicles
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(240,237,232,0.7)',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Select up to {MAX_COMPARE} vehicles to compare side-by-side specifications and find your
            perfect match.
          </p>
        </div>
      </motion.div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 80px' }}>
        {/* Search Bar */}
        {!comparing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ margin: '40px 0' }}
          >
            <div style={{ position: 'relative', maxWidth: '600px' }}>
              <input
                type="text"
                placeholder="Search by brand, model, or year..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 24px 18px 56px',
                  background: 'rgba(17,17,23,0.75)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px',
                  color: '#F0EDE8',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C9A84C';
                  e.target.style.boxShadow = '0 0 30px rgba(201,168,76,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(240,237,232,0.4)',
                  fontSize: '18px',
                }}
              >
                <SearchIcon size={18} color="rgba(240,237,232,0.4)" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected Cars Bar (Sticky) */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'sticky',
                top: '88px',
                zIndex: 100,
                background: 'rgba(10,10,14,0.95)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '40px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                  {selected.map((car) => (
                    <div
                      key={car.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(17,17,23,0.8)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: '50px',
                        padding: '6px 16px 6px 6px',
                      }}
                    >
                      <img
                        src={car.image}
                        alt={car.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#F0EDE8',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        {car.brand} {car.name}
                      </span>
                      <button
                        onClick={() => remove(car.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(240,237,232,0.4)',
                          cursor: 'pointer',
                          fontSize: '14px',
                          minWidth: '32px',
                          minHeight: '32px',
                          padding: '4px',
                          borderRadius: '50%',
                          transition: 'color 0.2s, background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#EF4444';
                          e.target.style.background = 'rgba(239,68,68,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = 'rgba(240,237,232,0.4)';
                          e.target.style.background = 'none';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {selected.length < MAX_COMPARE && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px 20px',
                        background: 'rgba(17,17,23,0.5)',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '50px',
                        fontSize: '13px',
                        color: 'rgba(240,237,232,0.4)',
                      }}
                    >
                      + {MAX_COMPARE - selected.length} more
                    </div>
                  )}
                </div>

                {selected.length >= 2 && (
                  <button
                    onClick={() => setComparing(!comparing)}
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                      color: '#050507',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px 32px',
                      fontWeight: 700,
                      fontSize: '13px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif',
                      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                      boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 32px rgba(201,168,76,0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 24px rgba(201,168,76,0.3)';
                    }}
                  >
                    {comparing ? '← Back to Selection' : `Compare ${selected.length} Vehicles →`}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison View */}
        {comparing ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflowX: 'auto', paddingBottom: '40px' }}
          >
            {/* Car Header Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: selected.length > 2 ? 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' : `repeat(${selected.length}, 1fr)`,
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              {selected.map((car, carIdx) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: carIdx * 0.1 }}
                  style={{
                    background: 'rgba(17,17,23,0.75)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Car Image */}
                  <div
                    style={{
                      position: 'relative',
                      height: '220px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '120px',
                        background:
                          'linear-gradient(to top, rgba(5,5,7,0.95) 0%, rgba(5,5,7,0.7) 50%, transparent 100%)',
                      }}
                    />
                    {/* Car Number Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '18px',
                        color: '#050507',
                        fontFamily: 'Space Grotesk, sans-serif',
                        boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
                      }}
                    >
                      {carIdx + 1}
                    </div>
                  </div>

                  {/* Car Info */}
                  <div style={{ padding: '24px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: '#C9A84C',
                        marginBottom: '8px',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {car.brand}
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#F0EDE8',
                        marginBottom: '6px',
                        fontFamily: 'Cormorant Garamond, serif',
                        lineHeight: 1.2,
                      }}
                    >
                      {car.name}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(240,237,232,0.5)',
                        marginBottom: '16px',
                      }}
                    >
                      {car.year}
                    </div>

                    {/* Price with icon */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '26px',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        {compactPrice(car.price)}
                      </div>
                      <button
                        onClick={() => remove(car.id)}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: '#EF4444',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                          transition: 'all 0.3s',
                          fontFamily: 'Space Grotesk, sans-serif',
                          letterSpacing: '1px',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(239,68,68,0.2)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(239,68,68,0.1)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Specs Comparison Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                background: 'rgba(17,17,23,0.75)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  padding: '24px 32px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(10,10,14,0.6)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#F0EDE8',
                    margin: 0,
                    fontFamily: 'Cormorant Garamond, serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      width: '4px',
                      height: '24px',
                      background: 'linear-gradient(180deg, #C9A84C, #E0C06A)',
                      borderRadius: '4px',
                    }}
                  />
                  Technical Specifications
                </h3>
              </div>

              {/* Spec Rows */}
              <div style={{ padding: '0' }}>
                {Object.entries(SPEC_LABELS).map(([key, label], idx) => {
                  const best = NUMERIC_KEYS[key] ? getBest(selected, key) : null;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + idx * 0.05 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth > 768 ? `280px repeat(${selected.length}, 1fr)` : '1fr',
                        borderBottom:
                          idx < Object.keys(SPEC_LABELS).length - 1
                            ? '1px solid rgba(255,255,255,0.04)'
                            : 'none',
                        transition: 'background 0.3s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      {/* Label Cell */}
                      <div
                        style={{
                          padding: '24px 32px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderRight: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'rgba(201,168,76,0.3)',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            color: 'rgba(240,237,232,0.6)',
                            fontFamily: 'Space Grotesk, sans-serif',
                          }}
                        >
                          {label}
                        </span>
                      </div>

                      {/* Value Cells */}
                      {selected.map((car) => {
                        const val = car.specs?.[key] || 'N/A';
                        const numVal = parseNumeric(val);
                        const isWinner = best !== null && numVal === best;

                        return (
                          <div
                            key={`${car.id}-${key}`}
                            style={{
                              padding: '24px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              gap: '8px',
                              textAlign: 'center',
                              position: 'relative',
                            }}
                          >
                            {isWinner && (
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background:
                                    'linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)',
                                  pointerEvents: 'none',
                                }}
                              />
                            )}
                            <span
                              style={{
                                fontSize: '16px',
                                fontWeight: isWinner ? 700 : 500,
                                color: isWinner ? '#C9A84C' : '#F0EDE8',
                                position: 'relative',
                                zIndex: 1,
                              }}
                            >
                              {val}
                            </span>
                            {isWinner && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 + idx * 0.05, duration: 0.4 }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 10px',
                                  background: 'rgba(201,168,76,0.15)',
                                  border: '1px solid rgba(201,168,76,0.3)',
                                  borderRadius: '20px',
                                  fontSize: '10px',
                                  letterSpacing: '1.5px',
                                  color: '#C9A84C',
                                  fontWeight: 700,
                                  fontFamily: 'Space Grotesk, sans-serif',
                                  textTransform: 'uppercase',
                                  position: 'relative',
                                  zIndex: 1,
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>★</span>
                                BEST
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Car Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '24px',
            }}
          >
            {filtered.map((car) => {
              const isSelected = !!selected.find((s) => s.id === car.id);
              const disabled = !isSelected && selected.length >= MAX_COMPARE;
              return (
                <CarCard
                  key={car.id}
                  car={car}
                  isSelected={isSelected}
                  onToggle={toggle}
                  disabled={disabled}
                />
              );
            })}
            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '80px 20px',
                  color: 'rgba(240,237,232,0.3)',
                  fontSize: '16px',
                }}
              >
                No vehicles found matching "{search}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
