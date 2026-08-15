// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS - ANIMATED CAR CARD
// Premium 3D tilt card with hover effects
// ═══════════════════════════════════════════════════════════════════════════

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
  const { addToCart, toggleFavorite, isFavorite } = useApp();

  // DISABLED 3D effect for better usability
  // const x = useMotionValue(0);
  // const y = useMotionValue(0);
  // const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
  //   stiffness: 300,
  //   damping: 30
  // });
  // const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
  //   stiffness: 300,
  //   damping: 30
  // });

  // const handleMouseMove = (e) => {
  //   if (!cardRef.current) return;
  //   const rect = cardRef.current.getBoundingClientRect();
  //   const centerX = rect.left + rect.width / 2;
  //   const centerY = rect.top + rect.height / 2;
  //   x.set((e.clientX - centerX) / (rect.width / 2));
  //   y.set((e.clientY - centerY) / (rect.height / 2));
  // };

  const handleMouseLeave = () => {
    // x.set(0);
    // y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          delay: index * 0.08,
          ease: [0.19, 1, 0.22, 1]
        }
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{
          y: -6,
          transition: { duration: 0.3 }
        }}
      >
        <motion.div
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: isHovered ? 'rgba(25,25,33,0.98)' : 'rgba(17,17,23,0.9)',
            border: isHovered ? '1px solid rgba(201,168,76,0.3)' : '1px solid var(--border)',
            transition: 'all 0.3s ease',
            boxShadow: isHovered
              ? '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.2)'
              : '0 4px 16px rgba(0,0,0,0.4)',
            cursor: 'none',
            position: 'relative',
          }}
        >
          {/* Image */}
          <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
            <motion.img
              src={car.image}
              alt={car.name}
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(17,17,23,0.95) 0%, rgba(17,17,23,0.1) 55%)'
            }}/>

            {/* Category badge */}
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                padding: '6px 14px',
                borderRadius: 6,
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                background: 'rgba(201,168,76,0.18)',
                border: '1px solid rgba(201,168,76,0.5)',
                color: 'var(--gold)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {car.category}
            </motion.span>

            {!car.inStock && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4, type: 'spring' }}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontFamily: 'var(--font-ui)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.5)',
                  color: 'var(--red)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                PRE-ORDER
              </motion.span>
            )}

            {/* Favorite button */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(car);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isFavorite(car.id)
                  ? 'rgba(201,168,76,0.3)'
                  : 'rgba(5,5,7,0.7)',
                border: isFavorite(car.id)
                  ? '1px solid rgba(201,168,76,0.6)'
                  : '1px solid rgba(255,255,255,0.15)',
                color: isFavorite(car.id) ? 'var(--gold)' : 'var(--white-40)',
                fontSize: 16,
                cursor: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(12px)',
                boxShadow: isFavorite(car.id)
                  ? '0 0 20px rgba(201,168,76,0.4)'
                  : 'none',
                zIndex: 10,
              }}
            >
              {isFavorite(car.id) ? '♥' : '♡'}
            </motion.button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px 26px 26px' }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 8
              }}
            >
              {car.brand} · {car.year}
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 600,
                color: 'var(--white)',
                marginBottom: 10,
                lineHeight: 1.1
              }}
            >
              {car.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              style={{
                fontSize: 13,
                color: 'var(--white-40)',
                fontStyle: 'italic',
                marginBottom: 20,
                lineHeight: 1.5
              }}
            >
              {car.tagline}
            </motion.p>

            {/* Mini specs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 22
              }}
            >
              {[
                { l: 'Power', v: car.specs.horsepower || '–' },
                { l: '0–60', v: car.specs.acceleration || '–' },
              ].map(({ l, v }) => (
                <div
                  key={l}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s'
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 9,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--white-20)',
                    marginBottom: 4
                  }}>
                    {l}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--white)'
                  }}>
                    {v}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Price + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 9,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--white-20)',
                  marginBottom: 3
                }}>
                  From
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {fmt(car.price)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  to={`/car/${car.id}`}
                  className="btn btn-ghost"
                  data-hover
                  style={{ padding: '10px 16px', fontSize: 11 }}
                >
                  Details
                </Link>
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(car);
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn btn-gold"
                  data-hover
                  style={{
                    padding: '10px 16px',
                    fontSize: 11,
                    zIndex: 10,
                  }}
                >
                  + Garage
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Removed shine effect for better performance */}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
