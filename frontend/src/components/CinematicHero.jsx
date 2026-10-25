import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../context/ReducedMotionContext';

/**
 * CinematicHero - Premium full-screen hero section
 * Centered content + bottom stats bar + video background
 */

const CONFIG = {
  eyebrow: '',
  headline: '',
  subline: '',
  buttons: [],
  stats: [
    { label: '60+ Vehicles', value: '60+' },
    { label: '12 Brands', value: '12' },
    { label: 'Since 2012', value: '2012' }
  ]
};

export default function CinematicHero() {
  const prefersReducedMotion = useReducedMotion();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [prefersReducedMotion]);

  // Parallax scroll effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const scrollY = window.scrollY;
      const sectionHeight = section.offsetHeight;
      const scrollProgress = Math.min(scrollY / sectionHeight, 1);

      // Video parallax (slower)
      const video = videoRef.current;
      if (video) {
        video.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.4}px)`;
      }

      // Content fade + move up
      const content = section.querySelector('.hero-content');
      if (content) {
        content.style.opacity = 1 - scrollProgress;
        content.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
      aria-label="Hero section"
    >
      {/* Video Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundColor: '#050507',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/poster.jpg"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            animation: prefersReducedMotion ? 'none' : 'heroVideoScale 12s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        >
          <source
            src="/videos/Porsche GT3RS 991.2 Mountain Road Cinematic 4K_2160p.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark radial vignette + bottom fade */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,7,0.4) 60%, rgba(5,5,7,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(5,5,7,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Centered Content */}
      <div
        className="hero-content"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '900px',
          padding: '0 24px',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, var(--color-gold-500))',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-500)',
              fontWeight: 600,
            }}
          >
            {CONFIG.eyebrow}
          </span>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(to left, transparent, var(--color-gold-500))',
            }}
          />
        </motion.div>

        {/* Headline (h1) - Line by line reveal */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 7vw, 120px)',
            fontWeight: 500,
            lineHeight: 1.02,
            color: 'var(--white)',
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          {CONFIG.headline.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.7 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ display: 'inline-block', marginRight: i < CONFIG.headline.split(' ').length - 1 ? '0.3em' : 0 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '17px',
            color: 'rgba(240,237,232,0.75)',
            maxWidth: '90ch',
            margin: '0 auto 48px',
            lineHeight: 1.6,
          }}
        >
          {CONFIG.subline}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {CONFIG.buttons.map((btn, i) => (
            <Link
              key={i}
              to={btn.href}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 700,
                height: '48px',
                padding: '0 32px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                ...(btn.primary
                  ? {
                      background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-300))',
                      color: '#000',
                      border: 'none',
                    }
                  : {
                      background: 'transparent',
                      color: 'var(--color-gold-500)',
                      border: '1px solid var(--color-gold-500)',
                    }),
              }}
              onMouseEnter={(e) => {
                if (btn.primary) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.4)';
                } else {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-gold-300)';
                }
                const arrow = e.currentTarget.querySelector('.arrow');
                if (arrow) arrow.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                if (!btn.primary) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--color-gold-500)';
                }
                const arrow = e.currentTarget.querySelector('.arrow');
                if (arrow) arrow.style.transform = 'translateX(0)';
              }}
            >
              {btn.label}
              {btn.primary && (
                <svg
                  className="arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: 'transform 0.3s ease' }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Bottom Stats Bar */}
      <StatsBar stats={CONFIG.stats} />

      <style>{`
        @keyframes heroVideoScale {
          from { transform: translate(-50%, -50%) scale(1.08); }
          to { transform: translate(-50%, -50%) scale(1.0); }
        }

        @media (max-width: 768px) {
          .hero-content {
            top: auto !important;
            bottom: 140px !important;
            transform: translateX(-50%) !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes heroVideoScale {
            from { transform: translate(-50%, -50%) scale(1.0); }
            to { transform: translate(-50%, -50%) scale(1.0); }
          }
        }
      `}</style>
    </section>
  );
}

/* Stats Bar Component */
function StatsBar({ stats }) {
  const [ref, inView] = useIntersectionObserver({ threshold: 0.3, triggerOnce: true });
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    if (!inView) return;

    stats.forEach((stat, index) => {
      if (!stat.value.match(/^\d+$/)) return; // Skip non-numeric values

      const target = parseInt(stat.value);
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          clearInterval(timer);
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = target;
            return newCounts;
          });
        } else {
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(current);
            return newCounts;
          });
        }
      }, duration / steps);
    });
  }, [inView, stats]);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        padding: '32px 48px',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        zIndex: 2,
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            textAlign: 'center',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 600,
              color: 'var(--color-gold-500)',
              marginBottom: '8px',
            }}
          >
            {stat.value.match(/^\d+$/) ? counts[i] : stat.value}
            {stat.value.includes('+') && '+'}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.6)',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}

      {/* Scroll Indicator */}
      <div
        style={{
          position: 'absolute',
          right: '48px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '32px',
            background: 'linear-gradient(to bottom, transparent, var(--color-gold-500))',
            animation: 'scrollLineLoop 2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.7)',
          }}
        >
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollLineLoop {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(8px); }
        }

        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes scrollLineLoop {
            0%, 100% { opacity: 0.7; transform: translateY(0); }
          }
        }
      `}</style>
    </div>
  );
}

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options.triggerOnce) {
            observer.unobserve(ref);
          }
        } else if (!options.triggerOnce) {
          setInView(false);
        }
      },
      { threshold: options.threshold || 0.1 }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options.threshold, options.triggerOnce]);

  return [setRef, inView];
}
