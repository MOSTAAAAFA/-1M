// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS - OPTIMIZED ANIMATED CAR CARD
// Premium 3D tilt with performance optimizations - DARK THEME
// ═══════════════════════════════════════════════════════════════════════════

import React, { useRef, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BoltIcon, RocketIcon } from './icons';

const fmt = (n) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(n);

// Throttle helper for performance
const throttle = (func, delay) => {
  let timeoutId;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if ((Date.now() - lastRan) >= delay) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, delay - (Date.now() - lastRan));
    }
  };
};

const OptimizedAnimatedCard = memo(({ car, index = 0 }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const { addToCart, toggleFavorite, isFavorite } = useApp();

  // Throttled mouse move for better performance
  const handleMouseMove = useCallback(
    throttle((e) => {
      if (!cardRef.current || !isHovered) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      // Reduced tilt angles for better usability
      setTilt({
        rotateX: percentY * -3,
        rotateY: percentX * 3,
      });
    }, 16), // ~60fps
    [isHovered]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: index * 0.08,
          ease: [0.19, 1, 0.22, 1]
        }
      }}
      viewport={{ once: true, amount: 0.15 }}
      style={{
        perspective: '1200px',
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          y: isHovered ? -10 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        style={{
          transformStyle: 'preserve-3d',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: isHovered ? 'rgba(25,25,33,0.98)' : 'rgba(17,17,23,0.95)',
          border: isHovered ? '2px solid rgba(201,168,76,0.4)' : '2px solid var(--border)',
          boxShadow: isHovered
            ? '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.25)'
            : 'var(--shadow-sm)',
          cursor: 'none',
          position: 'relative',
          willChange: isHovered ? 'transform' : 'auto',
          transition: 'all 0.5s var(--ease-out)',
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          height: 280,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--black-2) 0%, var(--black-3) 100%)',
        }}>
          <motion.img
            src={car.image}
            alt={car.name}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: isHovered ? 'brightness(1.1) contrast(1.05)' : 'brightness(1)',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(17,17,23,0.95) 0%, rgba(17,17,23,0.2) 50%, transparent 80%)'
          }}/>

          {/* Gold shimmer on hover */}
          {isHovered && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Category Badge */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 + 0.3 }}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              background: 'var(--gold-dim)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: 'var(--gold)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 12px rgba(201,168,76,0.2)',
            }}
          >{car.category}</motion.span>

          {!car.inStock && (
            <span style={{
              position: 'absolute',
              top: 20,
              left: car.category ? 140 : 20,
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: 'var(--red)',
              backdropFilter: 'blur(16px)',
            }}>Pre-Order</span>
          )}

          {/* Favorite Button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(car);
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: isFavorite(car.id)
                ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
                : 'rgba(17,17,23,0.85)',
              border: isFavorite(car.id)
                ? '2px solid var(--gold-light)'
                : '2px solid rgba(255,255,255,0.1)',
              color: isFavorite(car.id) ? 'var(--black)' : 'var(--white-40)',
              fontSize: 18,
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(16px)',
              transition: 'all 0.3s var(--ease-out)',
              boxShadow: isFavorite(car.id)
                ? '0 4px 16px rgba(201,168,76,0.5)'
                : '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {isFavorite(car.id) ? '♥' : '♡'}
          </motion.button>

          {/* Rating Stars */}
          <div style={{
            position: 'absolute',
            bottom: 18,
            right: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'rgba(17,17,23,0.90)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--gold)' }}>
              {'★'.repeat(Math.round(car.rating || 5))}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--white-40)',
            }}>({car.reviewCount || 0})</span>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '28px', position: 'relative' }}>
          {/* Brand & Year */}
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '10px',
            fontWeight: 700,
          }}>{car.brand} · {car.year}</p>

          {/* Car Name */}
          <Link to={`/car/${car.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--white)',
              marginBottom: '12px',
              lineHeight: 1.2,
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--white)'}
            >{car.name}</h3>
          </Link>

          {/* Tagline */}
          <p style={{
            fontSize: '13px',
            color: 'var(--white-40)',
            fontStyle: 'italic',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}>{car.tagline}</p>

          {/* Specs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {[
              { label: 'Power', value: car.specs.horsepower || '–', icon: 'bolt' },
              { label: '0–60 mph', value: car.specs.acceleration || '–', icon: 'rocket' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: isHovered ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.4s var(--ease-out)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <SpecIcon name={icon} />
                  {label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--white)',
                }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Price & Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--white-20)',
                marginBottom: 4,
              }}>Starting at</p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}>{fmt(car.price)}</p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                to={`/car/${car.id}`}
                className="btn btn-ghost"
                data-hover
                style={{
                  padding: '10px 18px',
                  fontSize: '11px',
                  letterSpacing: '2px',
                }}
              >
                Details
              </Link>
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(car);
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-gold"
                data-hover
                style={{
                  padding: '10px 18px',
                  fontSize: '11px',
                  letterSpacing: '2px',
                }}
              >
                + Garage
              </motion.button>
            </div>
          </div>
        </div>

        {/* Decorative gold corner accent */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle at bottom right, rgba(201,168,76,0.12) 0%, transparent 70%)',
          borderRadius: '100% 0 0 0',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.5s',
          pointerEvents: 'none',
        }}/>
      </motion.div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  return prevProps.car.id === nextProps.car.id && prevProps.index === nextProps.index;
});

OptimizedAnimatedCard.displayName = 'OptimizedAnimatedCard';

function SpecIcon({ name }) {
  if (name === 'bolt') return <BoltIcon size={12} color="var(--gold)" />;
  if (name === 'rocket') return <RocketIcon size={12} color="var(--gold)" />;
  return null;
}

export default OptimizedAnimatedCard;
