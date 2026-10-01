// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS — ULTRA PREMIUM 3D ANIMATED CAR CARD
// Full 3D tilt + mouse-tracked spotlight + gold shimmer border
// ═══════════════════════════════════════════════════════════════════════════

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const fmt = (n) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(n);

export default function AnimatedCard({ car, index = 0 }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const { addToCart, toggleFavorite, isFavorite } = useApp();

  // ── Lighter 3D Tilt for better performance ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150, damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150, damping: 20
  });
  const scale = useSpring(isHovered ? 1.02 : 1, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !isHovered) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    mouseX.set(cx);
    mouseY.set(cy);

    // Spotlight follows mouse
    const sx = ((e.clientX - rect.left) / rect.width)  * 100;
    const sy = ((e.clientY - rect.top)  / rect.height) * 100;
    setSpotlight({ x: sx, y: sy });
  }, [mouseX, mouseY, isHovered]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setSpotlight({ x: 50, y: 50 });
  };

  return (
    <div style={{ perspective: 1000, height: '100%' }}>
      {/* ── 3D Tilt wrapper ── */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 20,
          overflow: 'hidden',
          background: isHovered
            ? 'rgba(22,22,30,0.98)'
            : 'rgba(17,17,23,0.92)',
          border: isHovered
            ? '1px solid rgba(201,168,76,0.35)'
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: isHovered
            ? '0 32px 80px rgba(0,0,0,0.75), 0 0 60px rgba(201,168,76,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 8px 32px rgba(0,0,0,0.5)',
          cursor: 'none',
          position: 'relative',
          transition: 'border-color 0.35s, box-shadow 0.35s, background 0.35s',
        }}
      >
        {/* ── Mouse-tracked spotlight ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(ellipse 280px 220px at ${spotlight.x}% ${spotlight.y}%, rgba(201,168,76,0.13) 0%, rgba(244,208,63,0.06) 40%, transparent 70%)`,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* ── Top gold accent line ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 3,
          background: isHovered
            ? 'linear-gradient(to right, transparent 5%, #C9A84C 30%, #F4D03F 50%, #E0C06A 70%, transparent 95%)'
            : 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)',
          boxShadow: isHovered ? '0 0 24px rgba(201,168,76,0.8), 0 0 50px rgba(201,168,76,0.3)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: 'none',
        }}/>

        {/* ── Image area ── */}
        <div style={{ position: 'relative', height: 260, overflow: 'hidden', zIndex: 1 }}>
          <motion.img
            src={car.image}
            alt={car.name}
            onError={(e) => { e.currentTarget.src = `https://placehold.co/800x600/111117/C9A84C?text=${encodeURIComponent(car.brand + ' ' + car.name)}`; }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Deep gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: isHovered
              ? 'linear-gradient(to top, rgba(22,22,30,0.98) 0%, rgba(22,22,30,0.45) 45%, rgba(22,22,30,0.1) 75%)'
              : 'linear-gradient(to top, rgba(17,17,23,0.98) 0%, rgba(17,17,23,0.5) 50%, rgba(17,17,23,0.1) 80%)',
            transition: 'background 0.4s',
          }}/>

          {/* Category badge */}
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            style={{
              position: 'absolute', top: 16, left: 16,
              padding: '5px 12px',
              borderRadius: 6,
              fontFamily: 'var(--font-ui)', fontSize: 9,
              fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase',
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.45)',
              color: 'var(--gold)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 0 16px rgba(201,168,76,0.15)',
            }}
          >
            {car.category}
          </motion.span>

          {!car.inStock && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.4, type: 'spring', stiffness: 260 }}
              style={{
                position: 'absolute', top: 16, right: 16,
                padding: '5px 10px',
                borderRadius: 6,
                fontFamily: 'var(--font-ui)', fontSize: 9,
                fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                background: 'rgba(239,68,68,0.18)',
                border: '1px solid rgba(239,68,68,0.5)',
                color: 'var(--red)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              PRE-ORDER
            </motion.span>
          )}

          {/* Favorite button */}
          <motion.button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(car); }}
            aria-label={isFavorite(car.id) ? `Remove ${car.name} from favorites` : `Add ${car.name} to favorites`}
            aria-pressed={isFavorite(car.id)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            style={{
              position: 'absolute', bottom: 16, right: 16,
              width: 40, height: 40, borderRadius: '50%',
              background: isFavorite(car.id)
                ? 'rgba(201,168,76,0.25)'
                : 'rgba(5,5,7,0.75)',
              border: isFavorite(car.id)
                ? '1px solid rgba(201,168,76,0.7)'
                : '1px solid rgba(255,255,255,0.18)',
              color: isFavorite(car.id) ? 'var(--gold)' : 'var(--white-40)',
              fontSize: 16, cursor: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: isFavorite(car.id)
                ? '0 0 24px rgba(201,168,76,0.5)'
                : '0 4px 14px rgba(0,0,0,0.4)',
              zIndex: 10,
              transition: 'all 0.3s',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isFavorite(car.id) ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '24px 26px 26px', position: 'relative', zIndex: 1, flex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: 9,
            letterSpacing: '3px', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 8,
          }}>
            {car.brand} · {car.year}
          </p>

          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 28,
            fontWeight: 600, color: 'var(--white)',
            marginBottom: 10, lineHeight: 1.1,
          }}>
            {car.name}
          </h3>

          <p style={{
            fontSize: 13, color: 'var(--white-40)',
            fontStyle: 'italic', marginBottom: 20, lineHeight: 1.55,
          }}>
            {car.tagline}
          </p>

          {/* Mini specs — glass pill style */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 10, marginBottom: 22,
          }}>
            {[
              { l: 'Power', v: car.specs?.horsepower || car.specs?.horsepowerStr || '–' },
              { l: '0–60',  v: car.specs?.acceleration || car.specs?.accelStr     || '–' },
            ].map(({ l, v }) => (
              <div key={l} style={{
                padding: '11px 14px',
                borderRadius: 10,
                background: isHovered
                  ? 'rgba(201,168,76,0.05)'
                  : 'rgba(255,255,255,0.03)',
                border: isHovered
                  ? '1px solid rgba(201,168,76,0.18)'
                  : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.35s',
                backdropFilter: 'blur(4px)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: 9,
                  letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'var(--white-20)', marginBottom: 4,
                }}>{l}</p>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: 15,
                  fontWeight: 600, color: 'var(--white)',
                }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Price + CTA gold strip */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
            paddingTop: 18,
            borderTop: isHovered
              ? '1px solid rgba(201,168,76,0.25)'
              : '1px solid rgba(255,255,255,0.06)',
            transition: 'border-color 0.35s',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: 9,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--white-20)', marginBottom: 3,
              }}>From</p>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 22,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #C9A84C, #E0C06A 55%, #F4D03F)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1.1,
              }}>
                {fmt(car.price)}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Link
                to={`/car/${car.id}`}
                className="btn btn-ghost"
                data-hover
                style={{ padding: '9px 14px', fontSize: 10, letterSpacing: '1.5px', borderRadius: 999 }}
              >
                Details
              </Link>
              <motion.button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(car); }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-gold"
                data-hover
                style={{ padding: '9px 14px', fontSize: 10, letterSpacing: '1.5px', zIndex: 10, borderRadius: 999 }}
              >
                + Garage
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── 3D floating layer depth indicator ── */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 20,
          background: isHovered
            ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)'
            : 'none',
          pointerEvents: 'none',
          zIndex: 4,
          transition: 'background 0.4s',
        }}/>
      </motion.div>
    </div>
  );
}
