import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={styles.hero}>
      {/* Background Image with parallax effect */}
      <motion.div
        style={styles.bg}
        initial={{ scale: 1.1 }}
        animate={{ scale: loaded ? 1 : 1.1 }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
      />

      {/* Gradient Overlays - Dark × Gold */}
      <div style={styles.overlayGradient} />
      <div style={styles.overlayBottom} />

      {/* Decorative gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: loaded ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
        style={styles.goldLine}
      />

      {/* Content */}
      <div style={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <p style={styles.eyebrow}>LUXURY • PERFORMANCE • EXCELLENCE</p>

          <motion.h1
            style={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            DRIVE THE
            <br />
            <span style={styles.goldText}>EXTRAORDINARY</span>
          </motion.h1>

          <motion.p
            style={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            Experience automotive perfection where engineering becomes art
          </motion.p>

          <motion.div
            style={styles.buttonGroup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
          >
            <button
              className="btn btn-gold"
              style={styles.btnPrimary}
              onClick={() => navigate('/cars')}
              data-hover
            >
              Explore Collection
            </button>
            <button
              className="btn btn-ghost"
              style={styles.btnSecondary}
              onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
              data-hover
            >
              Discover More
            </button>
          </motion.div>
        </motion.div>

        {/* Stats - Animated counters */}
        <motion.div
          style={styles.stats}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
        >
          {[
            { value: '36+', label: 'Luxury Vehicles' },
            { value: '100%', label: 'Satisfaction' },
            { value: '24/7', label: 'Concierge' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              style={styles.statItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.9 }}
              transition={{ duration: 0.6, delay: 1.4 + i * 0.1, ease: [0.19, 1, 0.22, 1] }}
            >
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span style={styles.scrollText}>SCROLL</span>
          <motion.div
            style={styles.scrollLine}
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div style={styles.decorCircle1} />
      <div style={styles.decorCircle2} />
    </section>
  );
}

const styles = {
  hero: {
    position: 'relative',
    height: '100vh',
    minHeight: '700px',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--black)',
  },

  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url("https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1920&q=90")',
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
    zIndex: 0,
    willChange: 'transform',
  },

  overlayGradient: {
    position: 'absolute',
    inset: 0,
    background: `
      linear-gradient(
        135deg,
        rgba(5, 5, 7, 0.95) 0%,
        rgba(5, 5, 7, 0.85) 25%,
        rgba(17, 17, 23, 0.75) 50%,
        rgba(5, 5, 7, 0.65) 75%,
        rgba(5, 5, 7, 0.40) 100%
      )
    `,
    zIndex: 1,
  },

  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(to top, rgba(5,5,7,1) 0%, transparent 100%)',
    zIndex: 2,
  },

  goldLine: {
    position: 'absolute',
    top: 'var(--nav-h)',
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)',
    boxShadow: '0 0 20px rgba(201,168,76,0.6)',
    zIndex: 3,
    transformOrigin: 'center',
  },

  content: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    maxWidth: '900px',
    padding: '0 48px',
    paddingTop: 'var(--nav-h)',
  },

  eyebrow: {
    fontFamily: 'var(--font-ui)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '5px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '32px',
    display: 'inline-block',
    padding: '8px 24px',
    background: 'var(--gold-dim)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(201,168,76,0.35)',
    boxShadow: '0 2px 12px rgba(201,168,76,0.15)',
  },

  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(56px, 8vw, 96px)',
    fontWeight: 300,
    lineHeight: 1.1,
    color: 'var(--white)',
    marginBottom: '28px',
    letterSpacing: '2px',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },

  goldText: {
    fontStyle: 'italic',
    fontWeight: 600,
    background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'shimmer 3s ease-in-out infinite',
    filter: 'drop-shadow(0 2px 8px rgba(201,168,76,0.5))',
  },

  subtitle: {
    fontSize: '18px',
    lineHeight: '1.7',
    color: 'var(--white-70)',
    marginBottom: '48px',
    maxWidth: '580px',
    margin: '0 auto 48px',
    fontWeight: 400,
    letterSpacing: '0.3px',
  },

  buttonGroup: {
    display: 'flex',
    gap: '18px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  btnPrimary: {
    padding: '16px 40px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '3px',
  },

  btnSecondary: {
    padding: '16px 40px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '3px',
  },

  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '64px',
    marginTop: '80px',
    flexWrap: 'wrap',
  },

  statItem: {
    textAlign: 'center',
    padding: '20px 28px',
    background: 'rgba(17,17,23,0.80)',
    backdropFilter: 'blur(24px)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    transition: 'all 0.4s var(--ease-out)',
    cursor: 'none',
  },

  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '42px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
    marginBottom: '8px',
  },

  statLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--white-40)',
  },

  scrollIndicator: {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'none',
    opacity: 0.6,
    transition: 'opacity 0.3s',
  },

  scrollText: {
    fontFamily: 'var(--font-ui)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '4px',
    color: 'var(--white-40)',
  },

  scrollLine: {
    width: '2px',
    height: '50px',
    background: 'linear-gradient(to bottom, var(--gold), transparent)',
    borderRadius: '2px',
    transformOrigin: 'top',
  },

  decorCircle1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    zIndex: 1,
    animation: 'float 8s ease-in-out infinite',
  },

  decorCircle2: {
    position: 'absolute',
    bottom: '20%',
    left: '5%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    zIndex: 1,
    animation: 'float 10s ease-in-out infinite reverse',
  },
};
