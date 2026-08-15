import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cars } from '../data/cars';
import { useApp } from '../context/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import Brand1M from '../components/Brand1M';
import ScrollReveal from '../components/ScrollReveal';
import { TextRevealByWord } from '../components/TextReveal';
import OptimizedImage from '../components/OptimizedImage';
import AnimatedCounter from '../components/AnimatedCounter';
import { shouldEnableKenBurns } from '../utils/performanceOptimization';
import { compactPrice } from '../utils/finance';
import { colors, spacing, radius, typography, transitions, components } from '../styles/designTokens';

const HERO_SLIDES = [
  { carId: 11, headline: 'Pure', accent: 'Racing DNA', sub: 'The race track distilled into a road car.' },
  { carId: 36, headline: 'Absolute', accent: 'Performance', sub: 'Eat the track.' },
  { carId: 39, headline: 'Ultimate', accent: 'M Power', sub: 'Precision engineered for pure driving emotion.' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const carsRef = useRef(null);
  const navigate = useNavigate();

  // Performance optimization flags
  const enableKenBurns = shouldEnableKenBurns();

  // Auto slide transition every 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevSlide(slide);
      setSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [slide]);

  const goToSlide = (i) => {
    if (i === slide) return;
    setPrevSlide(slide);
    setSlide(i);
  };

  const current = HERO_SLIDES[slide];
  const heroCar = cars.find(c => c.id === current.carId);

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', position: 'relative', zIndex: 0 }}>
      {/* ══ HERO ══ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        height: '100vh',
        minHeight: 700,
        overflow: 'hidden',
        paddingTop: 'var(--nav-h)', // Fix navbar overlap
      }}>

        {/* Background image with cinematic crossfade + zoom transition */}
        <HeroBackdrop slide={slide} prevSlide={prevSlide} enableKenBurns={enableKenBurns} />

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,5,7,0.92) 28%, rgba(5,5,7,0.5) 62%, rgba(5,5,7,0.15) 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #050507 0%, rgba(5,5,7,0.95) 16%, rgba(5,5,7,0.62) 38%, rgba(5,5,7,0.28) 60%, transparent 78%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 55% 60% at 22% 48%, rgba(201,168,76,0.07) 0%, transparent 60%)',
        }}/>

        {/* Cinematic vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}/>

        {/* Ambient gold glow (bottom) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 45% at 50% 115%, rgba(201,168,76,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* Classy-style textures: noise + light sweep */}
        <NoiseOverlay />
        <LightBeamSweep />

        {/* Floating gold dust */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', overflow: 'hidden' }}>
          {[
            { x: '12%', y: '22%', s: 3, d: 0, dur: 7 },
            { x: '28%', y: '68%', s: 2, d: 1.2, dur: 9 },
            { x: '45%', y: '34%', s: 4, d: 2.1, dur: 11 },
            { x: '60%', y: '75%', s: 2, d: 0.6, dur: 8 },
            { x: '72%', y: '28%', s: 3, d: 1.8, dur: 10 },
            { x: '85%', y: '58%', s: 2, d: 0.9, dur: 7.5 },
            { x: '20%', y: '45%', s: 2, d: 2.6, dur: 12 },
            { x: '52%', y: '15%', s: 2, d: 1.5, dur: 9.5 },
            { x: '90%', y: '20%', s: 3, d: 3, dur: 8.5 },
            { x: '35%', y: '85%', s: 2, d: 2.3, dur: 10.5 },
          ].map((p, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: p.x, top: p.y,
              width: p.s, height: p.s,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #F4D03F 0%, rgba(201,168,76,0.6) 50%, transparent 100%)',
              boxShadow: '0 0 12px rgba(201,168,76,0.9), 0 0 24px rgba(201,168,76,0.4)',
              opacity: 0,
              animation: `goldDustFloat ${p.dur}s ease-in-out ${p.d}s infinite`,
            }}/>
          ))}
        </div>

        {/* Bottom fade edge - hero (dissolves hard image edge) */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: '38%',
          background: 'linear-gradient(to top, #050507 0%, #050507 30%, rgba(5,5,7,0.55) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}/>

        {/* Grid decoration */}
        <DottedGrid />

        {/* Slide indicators */}
        <div
          role="tablist"
          aria-label="Hero carousel controls"
          style={{
          position: 'absolute', top: '50%', right: 48,
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 18, zIndex: 10,
        }}>
          {HERO_SLIDES.map((s, i) => {
            const c = cars.find(x => x.id === s.carId);
            const active = i === slide;
            return (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                role="tab"
                aria-label={`Go to slide ${i + 1} of ${HERO_SLIDES.length}: ${c?.name}`}
                aria-selected={active}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'none', border: 'none', padding: 0,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 10,
                  letterSpacing: '2px',
                  color: active ? '#C9A84C' : 'rgba(240,237,232,0.62)',
                  transform: active ? 'translateX(0)' : 'translateX(4px)',
                  transition: 'all 0.4s var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}>
                  {active ? c?.name : `0${i + 1}`}
                </span>
                <span style={{
                  width: active ? 44 : 20,
                  height: 1,
                  background: active
                    ? 'linear-gradient(to right, #E0C06A, #C9A84C)'
                    : 'rgba(255,255,255,0.25)',
                  boxShadow: active ? '0 0 12px rgba(201,168,76,0.7)' : 'none',
                  transition: 'all 0.4s var(--ease-out)',
                  transformOrigin: 'right',
                }}/>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="container" style={{
          height: '100%',
          maxWidth: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
          zIndex: 5,
          paddingTop: 'var(--nav-h)',
        }}>
          <div style={{ maxWidth: 720, textAlign: 'left', width: '100%' }}>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
              <div style={{
                marginBottom: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}>
                {/* Gold Circle Logo with 1M - Same as Navbar */}
                <div style={{
                  position: 'relative',
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.6)) drop-shadow(0 0 16px rgba(201,168,76,0.4))',
                  animation: 'shieldGlowPulse 1s ease-in-out infinite',
                }}>
                  {/* Main circle */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: 13,
                    fontWeight: 900,
                    color: 'var(--black)',
                    letterSpacing: '-0.3px',
                    boxShadow: '0 4px 20px rgba(201,168,76,0.6), 0 0 40px rgba(244,208,63,0.4), inset 0 2px 3px rgba(255,255,255,0.3)',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}>
                    <Brand1M style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)' }} />
                  </div>
                </div>

                {/* Vertical divider */}
                <div style={{
                  width: 1,
                  height: 28,
                  background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.6), transparent)',
                  flexShrink: 0,
                }}/>

                {/* Eyebrow text */}
                <div>
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '5px', textTransform: 'uppercase',
                    color: '#C9A84C',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    <Brand1M style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C' }} /> MOTORS
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
                    letterSpacing: '3px', textTransform: 'uppercase',
                    color: 'rgba(240,237,232,0.62)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    Luxury · Performance · Est. 2026
                  </p>
                </div>
              </div>

              <style>{`
              @keyframes shimmerSweep {
                0% {
                  background-position: 200% 0;
                }
                100% {
                  background-position: -200% 0;
                }
              }

              @keyframes shieldGlowPulse {
                  0%, 100% {
                    filter: drop-shadow(0 0 8px rgba(212,175,55,0.6)) drop-shadow(0 0 16px rgba(212,175,55,0.4));
                  }
                  50% {
                    filter: drop-shadow(0 0 12px rgba(212,175,55,0.85)) drop-shadow(0 0 24px rgba(212,175,55,0.6));
                  }
                }
              `}</style>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.9rem, 6.4vw, 6rem)',
                fontWeight: 300,
                lineHeight: 1.12,
                color: 'var(--white)',
                marginBottom: 22,
                letterSpacing: '-0.5px',
                wordBreak: 'keep-all',
                overflowWrap: 'normal',
                whiteSpace: 'normal',
              }}>
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(90deg, #F0EDE8 0%, #F0EDE8 36%, #F4D03F 48%, #E0C06A 52%, #C9A84C 56%, #F0EDE8 64%, #F0EDE8 100%)',
                  backgroundSize: '250% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmerSweep 4.5s linear infinite',
                }}>
                  {current.headline}
                </span>
                <br/>
                <em key={current.accent} style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #C9A84C, #E0C06A 50%, #F4D03F)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  textShadow: '0 0 60px rgba(201,168,76,0.25)',
                  display: 'inline-block',
                }}>
                  <LetterReveal text={current.accent} />
                </em>
              </h1>

              {/* Gold divider line */}
              <div style={{
                width: 72,
                height: 1,
                background: 'linear-gradient(to right, #C9A84C, #E0C06A, transparent)',
                boxShadow: '0 0 16px rgba(201,168,76,0.5)',
                marginBottom: 26,
              }}/>

              <p style={{
                fontSize: 18, fontWeight: 300,
                color: 'rgba(240,237,232,0.72)',
                lineHeight: 1.75, marginBottom: 44, maxWidth: 480,
                letterSpacing: '0.2px',
              }}>{current.sub}</p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <RippleButton
                  className="btn btn-gold"
                  onClick={() => navigate(`/car/${heroCar?.id}`)}
                  data-hover
                  data-no-magnetic
                >View Vehicle <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>→</span></RippleButton>
                <RippleButton
                  className="btn btn-ghost"
                  onClick={() => carsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  data-hover
                  data-no-magnetic
                >Explore Collection <span aria-hidden="true" style={{ fontSize: 12, lineHeight: 1 }}>↓</span></RippleButton>
              </div>
              </motion.div>
            </AnimatePresence>

            {/* Animations Keyframes */}
            <style>{`
              @keyframes slideInRight {
                from {
                  opacity: 0;
                  transform: translateX(60px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }

              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes borderGlow {
                0%, 100% {
                  opacity: 0.6;
                  box-shadow: 0 0 20px rgba(201,168,76,0.6);
                }
                50% {
                  opacity: 1;
                  box-shadow: 0 0 30px rgba(201,168,76,0.9);
                }
              }

              @keyframes shieldGlowPulse {
                0%, 100% {
                  filter: drop-shadow(0 0 8px rgba(212,175,55,0.6)) drop-shadow(0 0 16px rgba(212,175,55,0.4));
                }
                50% {
                  filter: drop-shadow(0 0 12px rgba(212,175,55,0.85)) drop-shadow(0 0 24px rgba(212,175,55,0.6));
                }
              }

              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes goldDustFloat {
                0%, 100% {
                  opacity: 0;
                  transform: translateY(12px) scale(0.8);
                }
                25% {
                  opacity: 0.9;
                }
                50% {
                  opacity: 0.4;
                }
                75% {
                  opacity: 0.8;
                }
              }

              @keyframes scrollWheel {
                0% {
                  opacity: 1;
                  transform: translateY(0);
                }
                60% {
                  opacity: 0.2;
                  transform: translateY(12px);
                }
                100% {
                  opacity: 0.2;
                  transform: translateY(12px);
                }
              }

              @keyframes heroLightSweep {
                0% { transform: translateX(0) rotate(14deg); opacity: 0; }
                12% { opacity: 1; }
                88% { opacity: 1; }
                100% { transform: translateX(420vw) rotate(14deg); opacity: 0; }
              }

              @media (max-width: 900px) {
                .container {
                  padding-right: 24px !important;
                  justify-content: flex-start !important;
                }
                /* Hide vertical slide counter on mobile */
                div[role="tablist"],
                .hero-slide-counter {
                  display: none !important;
                }
              }

              @media (max-width: 768px) {
                .container {
                  padding-right: 24px !important;
                  justify-content: center !important;
                }
                /* Compact specs strip on mobile */
                .hero-specs-cell {
                  padding: 0 14px !important;
                  border-left: 1px solid rgba(255,255,255,0.08) !important;
                }
              }

              @media (max-width: 640px) {
                .container {
                  padding: 0 20px !important;
                  text-align: center !important;
                }
              }
            `}</style>

            {/* Live specs strip */}
            <ScrollReveal animation="fadeUp">
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                borderTop: '1px solid rgba(201,168,76,0.18)',
                background: 'linear-gradient(to top, rgba(5,5,7,0.85) 0%, rgba(5,5,7,0.45) 60%, rgba(5,5,7,0) 100%)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                padding: '28px 0 30px',
              }}>
                <div className="container" style={{
                  display: 'flex', gap: 0, flexWrap: 'wrap', maxWidth: 'none',
                }}>
                  {[
                    { v: heroCar?.specs.horsepowerStr || '–', l: 'Power' },
                    { v: heroCar?.specs.accelStr || '–', l: '0–60 mph' },
                    { v: heroCar?.specs.topSpeedStr || '–', l: 'Top Speed' },
                    { v: heroCar?.specs.engine || '–', l: 'Powertrain' },
                  ].map(({ v, l }, i) => (
                    <div key={l} className="hero-specs-cell" style={{
                      display: 'flex', alignItems: 'center',
                      padding: '0 36px',
                      borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      minWidth: 0,
                    }}>
                      <div>
                        <div key={`${slide}-${l}`} style={{
                          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600,
                          background: 'linear-gradient(135deg, #C9A84C, #E0C06A 60%, #F4D03F)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 220,
                        }}>{v}</div>
                        <div style={{
                          fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: '2.5px',
                          fontWeight: 500, textTransform: 'uppercase',
                          color: 'rgba(240,237,232,0.4)',
                          marginTop: 4,
                        }}>{l}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

      </section>

      {/* ══ STATS BAR ══ */}
      <StatsBar />

      {/* ══ BRAND MARQUEE ══ */}
      <BrandMarquee />

      {/* ══ FEATURED SECTION ══ */}
      <FeaturedSection />

      {/* ══ BRANDS SECTION ══ */}
      <BrandsSection />

      {/* ══ COLLECTION PREVIEW ══ */}
      <div ref={carsRef} id="collection">
        <CollectionPreview />
      </div>

      {/* ══ PRIVATE ALLOCATION COUNTDOWN ══ */}
      <PrivateAllocationCountdown />

      {/* ══ CTA BANNER ══ */}
      <CTABanner />

      {/* ══ FOOTER ══ */}
      <Footer />
    </div>
  );
}

/* ── Hero Backdrop (isolated parallax: updates DOM directly, no page re-render) ── */
function HeroBackdrop({ slide, prevSlide, enableKenBurns }) {
  const parallaxLayers = useRef([]);
  const scrollY = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    const onMouse = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 15;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 15;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });

    const animate = () => {
      // Smooth easing (same feel as the original useMouseParallax hook)
      current.current.x += (target.current.x - current.current.x) * 0.1;
      current.current.y += (target.current.y - current.current.y) * 0.1;
      const ty = scrollY.current * 0.35 + current.current.y;
      const tx = current.current.x;

      parallaxLayers.current.forEach((el) => {
        if (el) el.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {HERO_SLIDES.map((s, i) => {
        const car = cars.find(c => c.id === s.carId);
        const isActive = i === slide;
        const isLeaving = i === prevSlide && !isActive;
        return (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: isActive ? 1 : 0,
            transition: 'opacity 1.1s cubic-bezier(0.4,0,0.2,1)',
            zIndex: isActive ? 2 : 1,
          }}>
            {/* Slow Ken Burns zoom layer (isolated so it never conflicts) */}
            <div style={{
              position: 'absolute', inset: 0,
              animation: (isActive && enableKenBurns) ? 'heroZoom 7s ease-in-out both' : 'none',
            }}>
              {/* Parallax layer - updated via rAF, no React re-render */}
              <div
                ref={el => { parallaxLayers.current[i] = el; }}
                style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
              >
                <img
                  src={car?.heroImage || car?.image}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    objectPosition: 'center 35%',
                    transform: `scale(${isActive ? 1 : isLeaving ? 1.06 : 1.16})`,
                    transition: 'transform 1.6s cubic-bezier(0.22,1,0.36,1), filter 1.1s ease',
                    filter: isActive
                      ? 'blur(0) saturate(1.05) brightness(1)'
                      : 'blur(10px) saturate(0.75) brightness(0.85)',
                    willChange: 'transform',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ── Stats Bar ── */
function StatsBar() {
  const [ref, visible] = useIntersectionObserver();

  return (
    <div ref={ref} style={{
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="container stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        padding: '60px 0',
        position: 'relative',
      }}>
        {[
          {
            metric: '48hrs',
            label: 'Private Delivery',
            detail: 'Direct to your doorstep, anywhere in the nation',
          },
          {
            metric: '5 Years',
            label: 'Manufacturer Warranty',
            detail: 'Full powertrain & factory coverage included',
          },
          {
            metric: '24/7',
            label: 'VIP Concierge',
            detail: 'Personal advisor for every need',
          },
          {
            metric: 'Exclusive',
            label: 'Private Test Drive',
            detail: 'Experience at your preferred location',
          },
        ].map(({ metric, label, detail }, i) => (
          <div
            key={label}
            className="premium-feature-card"
            style={{
              padding: '40px 28px',
              background: 'transparent',
              backdropFilter: 'blur(4px)',
              borderRadius: '16px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* 🔥 Border مضيء يلف حوالين الكارد */}
            <svg
              style={{
                position: 'absolute',
                inset: -1,
                width: 'calc(100% + 2px)',
                height: 'calc(100% + 2px)',
                pointerEvents: 'none',
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradient يتحرك حوالين الحواف */}
                <linearGradient id={`borderGradient${i}`} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(201,168,76,0)" />
                  <stop offset="25%" stopColor="rgba(201,168,76,0)" />
                  <stop offset="50%" stopColor="rgba(201,168,76,1)" />
                  <stop offset="75%" stopColor="rgba(201,168,76,0)" />
                  <stop offset="100%" stopColor="rgba(201,168,76,0)" />
                  <animate
                    attributeName="x1"
                    values="0%;100%;0%"
                    dur={`${4 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y1"
                    values="0%;100%;0%"
                    dur={`${4 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    values="100%;0%;100%"
                    dur={`${4 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y2"
                    values="100%;0%;100%"
                    dur={`${4 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="16"
                fill="none"
                stroke={`url(#borderGradient${i})`}
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.8))',
                }}
              />
            </svg>

            {/* Static border ناعم */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                border: '1px solid rgba(201,168,76,0.15)',
                pointerEvents: 'none',
              }}
            />

            {/* Content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              minHeight: '150px',
              padding: '24px',
              textAlign: 'center',
            }}>
              {/* Metric */}
              <div className="gold-shimmer" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(34px, 3.2vw, 46px)',
                fontWeight: 600,
                color: 'var(--white)',
                background: 'linear-gradient(135deg, #C9A84C, #E0C06A 50%, #F4D03F)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}>
                {metric}
              </div>

              {/* Label */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(16px, 1.3vw, 19px)',
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: 'var(--white)',
                lineHeight: 1.2,
              }}>
                {label}
              </div>

              {/* Detail */}
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(11.5px, 1vw, 13px)',
                fontWeight: 300,
                color: 'var(--white-40)',
                letterSpacing: '0.3px',
                lineHeight: 1.55,
                maxWidth: 220,
              }}>
                {detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Keyframe for border travel animation */}
      <style>{`
        @keyframes borderTravel {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -400;
          }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Brand Marquee ── */
const MARQUEE_BRANDS = ['PORSCHE', 'FERRARI', 'LAMBORGHINI', 'BUGATTI', 'MCLAREN', 'ASTON MARTIN', 'BMW M', 'MERCEDES-AMG', 'BENTLEY', 'AUDI', 'TESLA', 'CHEVROLET'];

function BrandMarquee() {
  const items = [...MARQUEE_BRANDS, ...MARQUEE_BRANDS];
  return (
    <div style={{
      position: 'relative',
      padding: '26px 0',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(10,10,14,0.6)',
      maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
    }}>
      <div className="marquee-track" style={{ display: 'flex', gap: '72px', whiteSpace: 'nowrap', width: 'max-content' }}>
        {items.map((brand, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            letterSpacing: '6px',
            color: i % 2 === 0 ? 'rgba(240,237,232,0.28)' : 'rgba(201,168,76,0.45)',
            textShadow: i % 2 === 0
              ? '0 0 10px rgba(240,237,232,0.18), 0 0 26px rgba(240,237,232,0.08)'
              : '0 0 10px rgba(201,168,76,0.5), 0 0 28px rgba(201,168,76,0.22)',
            transition: 'color 0.3s',
          }}>
            {brand}
            <span style={{ marginLeft: '72px', color: 'rgba(201,168,76,0.6)', textShadow: 'none' }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`
        .marquee-track {
          animation: marqueeScroll 42s linear infinite;
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ── Featured Section ── */
function FeaturedSection() {
  // BMW: M3 (36), M4 (39), M5 CS (58), M5 Competition (59), M8 (22)
  // Mercedes-AMG: GT 63 S (21), GT Black Series (37), EQS 53 (47)
  const featured = cars.filter(c => [36, 39, 58, 59, 22, 21, 37, 47].includes(c.id));
  const [ref, visible] = useIntersectionObserver();

  return (
    <section style={{ padding: 'clamp(96px, 10vw, 144px) 0' }} ref={ref}>
      <div className="container">
        <div style={{ marginBottom: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ width: 44, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)', boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}/>
              <p className="eyebrow" style={{ margin: 0 }}>Editor's Selection</p>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 58px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.1 }}>
              <TextRevealByWord delay={0} stagger={0.1}>
                Most Coveted
              </TextRevealByWord>
              <br/>
              <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#C9A84C,#E0C06A 55%,#F4D03F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                <TextRevealByWord delay={0.3} stagger={0.1}>
                  Machines
                </TextRevealByWord>
              </em>
            </h2>
          </div>
          <Link to="/cars" className="btn btn-ghost" data-hover>View All Collection →</Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 24
        }}>
          {featured.map((car, i) => (
            <FeaturedCard key={car.id} car={car} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ car, index, visible }) {
  const { addToCart, toggleFavorite, isFavorite } = useApp();

  return (
    <div className="hm-card">
    <motion.div
      className="car-card"
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5, // Faster
        delay: index * 0.08, // Reduced delay
        ease: [0.19, 1, 0.22, 1]
      }}
      style={{
        borderRadius: radius.lg,
        overflow: 'hidden',
        background: 'rgba(17,17,23,0.9)',
        border: `1px solid ${colors.border2}`,
        cursor: 'none',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top gold accent line on hover */}
      <div className="hm-card-line" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 3,
        background: 'linear-gradient(to right, transparent, #E0C06A, #F4D03F, #E0C06A, transparent)',
        boxShadow: '0 0 18px rgba(201,168,76,0.7)',
        pointerEvents: 'none',
      }}/>
      {/* Removed cursor glow for performance */}

      {/* Image */}
      <div style={{
        position: 'relative', height: 210, overflow: 'hidden', zIndex: 1,
        boxShadow: 'inset 0 0 55px rgba(5,5,7,0.9), inset 0 -12px 30px rgba(5,5,7,0.85)',
      }}>
        <OptimizedImage
          src={car.image}
          alt={car.name}
          objectFit="cover"
          className="hm-card-img"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Category badge */}
        <span style={{
          position: 'absolute', top: spacing.lg, left: spacing.lg,
          padding: `${spacing.xs} ${spacing.md}`, borderRadius: spacing.xs,
          fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold,
          letterSpacing: typography.letterSpacing.wider, textTransform: 'uppercase',
          background: colors.goldDim, border: `1px solid ${colors.goldDim}`,
          color: colors.gold,
        }}>{car.category}</span>

        {!car.inStock && (
          <span style={{
            position: 'absolute', top: spacing.lg, left: car.category ? 110 : spacing.lg,
            padding: `${spacing.xs} ${spacing.sm}`, borderRadius: spacing.xs,
            fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold,
            letterSpacing: typography.letterSpacing.tight, textTransform: 'uppercase',
            background: 'rgba(239,68,68,0.18)', border: `1px solid ${colors.red}`,
            color: colors.red,
          }}>Pre-Order</span>
        )}

        {/* Fav btn */}
        <motion.button
          onClick={(e) => { e.preventDefault(); toggleFavorite(car); }}
          aria-label={isFavorite(car.id) ? `Remove ${car.name} from favorites` : `Add ${car.name} to favorites`}
          aria-pressed={isFavorite(car.id)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 36, height: 36, borderRadius: radius.full,
            background: isFavorite(car.id) ? 'rgba(201,168,76,0.9)' : 'rgba(5,5,7,0.9)',
            border: isFavorite(car.id) ? `1px solid ${colors.goldGlow}` : `1px solid ${colors.border2}`,
            color: isFavorite(car.id) ? colors.gold : colors.white40,
            fontSize: typography.fontSize.sm, cursor: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: transitions.default,
          }}
        >
          {isFavorite(car.id) ? '♥' : '♡'}
        </motion.button>

        {/* Stars overlay */}
        <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={{ fontSize: 11, color: colors.gold }}>{'★'.repeat(Math.round(car.rating))}</span>
          <span style={{ fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, color: colors.white40 }}>({car.reviewCount})</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `${spacing['2xl']} ${spacing['2xl']} 0`, position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, letterSpacing: typography.letterSpacing.wide, textTransform: 'uppercase', color: colors.gold, marginBottom: spacing.sm }}>{car.brand} · {car.year}</p>

        {/* Car name with logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
          <h3 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.white, lineHeight: typography.lineHeight.tight, flex: 1, minHeight: '2.2em' }}>{car.name}</h3>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            background: colors.white10,
            border: `1px solid ${colors.border2}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.sm,
            flexShrink: 0,
          }}>
            <img
              src={car.logo}
              alt={car.brand}
              onError={(e) => { e.currentTarget.src = '/logos/1m-mark.svg'; }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px currentColor) brightness(1.3)',
              }}
            />
          </div>
        </div>

        <p style={{ fontSize: typography.fontSize.sm, color: colors.white40, fontStyle: 'italic', marginBottom: spacing.lg }}>{car.tagline}</p>

        {/* Mini specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing['3xl'] }}>
          {[
            { l: 'Power', v: car.specs.horsepowerStr },
            { l: '0–60', v: car.specs.accelStr },
          ].map(({ l, v }) => (
            <div key={l} style={{
              padding: `${spacing.sm} ${spacing.md}`, borderRadius: spacing.sm,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${colors.border}`,
            }}>
              <p style={{ fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, letterSpacing: typography.letterSpacing.widest, textTransform: 'uppercase', color: colors.white20, marginBottom: 3 }}>{l}</p>
              <p style={{ fontFamily: typography.fontUI, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.white }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Gold price strip */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md,
          padding: '14px 24px',
          margin: 'auto -24px 0',
          background: 'linear-gradient(to top, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.02) 100%)',
          borderTop: '1px solid rgba(201,168,76,0.28)',
        }}>
          <div style={{
            position: 'absolute',
            top: -1, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5) 25%, #E0C06A 50%, rgba(201,168,76,0.5) 75%, transparent)',
          }}/>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <p style={{ fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, letterSpacing: typography.letterSpacing.widest, textTransform: 'uppercase', color: colors.white40, marginBottom: 2 }}>From</p>
            <p style={{
              fontFamily: typography.fontDisplay, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, lineHeight: 1.1,
              ...components.goldText,
            }}>
              {compactPrice(car.price)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0, justifyContent: 'flex-end' }}>
            <Link to={`/car/${car.id}`} className="btn btn-ghost" data-hover style={{ padding: '8px 12px', fontSize: 10.5, letterSpacing: '1.5px' }}>Details</Link>
            <motion.button
              onClick={() => addToCart(car)}
              aria-label={`Add ${car.name} to garage`}
              className="btn btn-gold"
              data-hover
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: '8px 12px', fontSize: 10.5, letterSpacing: '1.5px' }}
            >
              + Garage
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  );
}

/* ── Brands Section ── */
function BrandsSection() {
  const [ref, visible] = useIntersectionObserver();
  const [hoveredBrand, setHoveredBrand] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [allLit, setAllLit] = useState(false);
  const [clickedBrand, setClickedBrand] = useState(null);

  // Brand colors and logos - Local files
  const brands = [
    {
      name: 'Porsche',
      count: cars.filter(c => c.brand === 'Porsche').length,
      color: '#D5001C',
      glow: 'rgba(230, 50, 28, 0.6)',
      logo: '/logos/porsche.png'
    },
    {
      name: 'Ferrari',
      count: cars.filter(c => c.brand === 'Ferrari').length,
      color: '#DC0000',
      glow: 'rgba(220, 9, 9, 0.6)',
      logo: '/logos/ferrari.png'
    },
    {
      name: 'Lamborghini',
      count: cars.filter(c => c.brand === 'Lamborghini').length,
      color: '#FFC300',
      glow: 'rgba(255, 195, 0, 0.6)',
      logo: '/logos/lamborghini.png'
    },
    {
      name: 'Tesla',
      count: cars.filter(c => c.brand === 'Tesla').length,
      color: '#E82127',
      glow: 'rgba(232, 33, 39, 0.6)',
      logo: '/logos/tesla.png'
    },
    {
      name: 'BMW',
      count: cars.filter(c => c.brand === 'BMW' || c.brand === 'Bmw').length,
      color: '#1C69D4',
      glow: 'rgba(28, 105, 212, 0.6)',
      logo: '/logos/bmw.png'
    },
    {
      name: 'Mercedes-AMG',
      count: cars.filter(c => c.brand === 'Mercedes-AMG').length,
      color: '#00ADEF',
      glow: 'rgba(0, 173, 239, 0.6)',
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Mercedes-Benz-Logo.png'
    },
    {
      name: 'McLaren',
      count: cars.filter(c => c.brand === 'McLaren').length,
      color: '#FF8000',
      glow: 'rgba(255, 128, 0, 0.6)',
      logo: 'https://pngimg.com/uploads/Mclaren/Mclaren_PNG49.png'
    },
    {
      name: 'Aston Martin',
      count: cars.filter(c => c.brand === 'Aston Martin').length,
      color: '#00563F',
      glow: 'rgba(0, 86, 63, 0.6)',
      logo: 'https://crystalpng.com/wp-content/uploads/2025/08/Aston-Martin-01-1024x1024.png'
    },
    {
      name: 'Bugatti',
      count: cars.filter(c => c.brand === 'Bugatti').length,
      color: '#BE0032',
      glow: 'rgba(190, 0, 50, 0.6)',
      logo: 'https://ymimg1.b8cdn.com/uploads/car_make/35/logo/Bugatti_logo.png'
    },
    {
      name: 'Audi',
      count: cars.filter(c => c.brand === 'Audi').length,
      color: '#BB0A30',
      glow: 'rgba(187, 10, 48, 0.6)',
      logo: 'https://www.pngmart.com/files/10/Audi-Logo-PNG-Photos.png'
    },
    {
      name: 'Bentley',
      count: cars.filter(c => c.brand === 'Bentley').length,
      color: '#00563F',
      glow: 'rgba(0, 86, 63, 0.6)',
      logo: 'https://www.bentleypasadena.com/wp-content/themes/DealerInspireDealerTheme/images/bentley-pasadena-logo-mobile.png'
    },
    {
      name: 'Chevrolet',
      count: cars.filter(c => c.brand === 'Chevrolet').length,
      color: '#C8A961',
      glow: 'rgba(200, 169, 97, 0.6)',
      logo: 'https://th.bing.com/th/id/R.3d628918cedb81b90391f2aa20fd6008?rik=VWpAojifrAwHTg&pid=ImgRaw&r=0'
    },
    {
      name: 'Ford',
      count: cars.filter(c => c.brand === 'Ford').length,
      color: '#003478',
      glow: 'rgba(0, 52, 120, 0.6)',
      logo: 'https://th.bing.com/th/id/R.2fea7d1453f54ff356ddf31e3e589d30?rik=uA7s9mxzm0dkhA&pid=ImgRaw&r=0'
    },
    {
      name: 'Toyota',
      count: cars.filter(c => c.brand === 'Toyota').length,
      color: '#EB0A1E',
      glow: 'rgba(235, 10, 30, 0.6)',
      logo: 'https://pngtemplates.com/storage/101599/thumb_Toyota-PNG-Pic.webp'
    },
    {
      name: 'Honda',
      count: cars.filter(c => c.brand === 'Honda').length,
      color: '#CC0000',
      glow: 'rgba(204, 0, 0, 0.6)',
      logo: 'https://www.pngall.com/wp-content/uploads/13/Honda-Logo.png'
    },
    {
      name: 'Lotus',
      count: cars.filter(c => c.brand === 'Lotus').length,
      color: '#FFD700',
      glow: 'rgba(255, 215, 0, 0.6)',
      logo: 'https://th.bing.com/th/id/R.7641ad8781a6a6bb31adafdecb36792e?rik=x7JDjKlg5rg%2bNw&pid=ImgRaw&r=0'
    },
  ].filter(brand => brand.count > 0); // Only show brands with cars

  // Sequential lighting effect with loop
  useEffect(() => {
    if (!visible) return;

    const runSequence = () => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < brands.length) {
          setCurrentIndex(index);
          index++;
        } else {
          clearInterval(interval);
          // Light all brands after sequence completes
          setTimeout(() => {
            setAllLit(true);

            // Hold all lit for 3 seconds, then restart
            setTimeout(() => {
              setAllLit(false);
              setCurrentIndex(-1);
              // Wait 500ms then restart the sequence
              setTimeout(() => {
                runSequence();
              }, 500);
            }, 3000); // Hold for 3 seconds
          }, 500);
        }
      }, 400); // 400ms between each brand lighting
    };

    runSequence();
  }, [visible, brands.length]);

  return (
    <section ref={ref} style={{ padding: 'clamp(72px, 8vw, 112px) 0', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 48 }}>
          <span style={{ width: 44, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)', boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}/>
          <p className="eyebrow" style={{ margin: 0 }}>Our Partners</p>
          <span style={{ width: 44, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)', boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', position: 'relative' }}>
          {brands.map((brand, i) => {
            const isLit = allLit || i <= currentIndex;

            return (
              <div
                key={brand.name}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(20px)',
                  transition: `all 0.7s ${i * 0.15}s var(--ease-out)`,
                  textAlign: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: '20px',
                }}
                onMouseEnter={() => setHoveredBrand(brand.name)}
                onMouseLeave={() => setHoveredBrand(null)}
                onClick={() => {
                  setClickedBrand(brand.name);
                  setTimeout(() => setClickedBrand(null), 600);
                }}
                onTouchStart={() => {
                  setHoveredBrand(brand.name);
                  setClickedBrand(brand.name);
                }}
                onTouchEnd={() => {
                  setTimeout(() => {
                    setHoveredBrand(null);
                    setClickedBrand(null);
                  }, 600);
                }}
              >

                {/* Brand Logo */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  marginBottom: 16,
                }}>
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'contain',
                      mixBlendMode: 'normal',
                      filter: isLit
                        ? clickedBrand === brand.name
                          ? 'brightness(1.8) saturate(1.6) drop-shadow(0 0 20px currentColor)'
                          : hoveredBrand === brand.name
                          ? 'brightness(1.6) saturate(1.5) drop-shadow(0 0 15px currentColor)'
                          : 'brightness(1.3) saturate(1.2)'
                        : 'grayscale(100%) brightness(0.5) opacity(0.6)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: clickedBrand === brand.name
                        ? 'scale(1.3) rotate(5deg)'
                        : hoveredBrand === brand.name
                        ? 'scale(1.25) translateY(-5px)'
                        : isLit
                        ? 'scale(1.15)'
                        : 'scale(1)',
                      animation: brand.name === 'BMW' && hoveredBrand === 'BMW' ? 'spinBMW 2s linear infinite' :
                                 allLit && !clickedBrand && !hoveredBrand ? 'glowPulse 2s ease-in-out infinite' : 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                    }}
                  />

                  {/* Hover Glow Effect */}
                  {hoveredBrand === brand.name && (
                    <div style={{
                      position: 'absolute',
                      inset: -20,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${brand.glow.replace('0.6', '0.4')} 0%, ${brand.glow.replace('0.6', '0.2')} 90%, transparent 70%)`,
                      filter: 'blur(20px)',
                      animation: 'hoverGlowPulse 1s ease-in-out infinite',
                      pointerEvents: 'none',
                      zIndex: -1,
                    }}/>
                  )}
                </div>

                {/* Brand Name */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  fontWeight: 400,
                  color: isLit ? brand.color : 'var(--white)',
                  letterSpacing: '2px',
                  lineHeight: 1,
                  marginBottom: 8,
                  opacity: isLit ? 1 : 0.4,
                  textShadow: clickedBrand === brand.name
                    ? `0 0 30px ${brand.glow}, 0 0 60px ${brand.glow}, 0 0 90px ${brand.glow}`
                    : hoveredBrand === brand.name
                    ? `0 0 25px ${brand.glow}, 0 0 50px ${brand.glow}, 0 0 75px ${brand.glow}`
                    : allLit
                    ? `0 0 20px ${brand.glow}, 0 0 40px ${brand.glow}`
                    : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  zIndex: 1,
                  animation: allLit && !clickedBrand && !hoveredBrand ? 'textGlow 2s ease-in-out infinite' : 'none',
                  transform: clickedBrand === brand.name
                    ? 'scale(1.1)'
                    : hoveredBrand === brand.name
                    ? 'scale(1.05)'
                    : 'scale(1)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}>
                  {brand.name}
                </div>

                {/* Model Count */}
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 10,
                  letterSpacing: '3px',
                  color: isLit ? brand.color : 'var(--white-40)',
                  opacity: isLit ? 1 : 0.4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textShadow: clickedBrand === brand.name
                    ? `0 0 20px ${brand.glow}, 0 0 40px ${brand.glow}`
                    : hoveredBrand === brand.name
                    ? `0 0 18px ${brand.glow}, 0 0 35px ${brand.glow}`
                    : allLit
                    ? `0 0 15px ${brand.glow}`
                    : 'none',
                  position: 'relative',
                  zIndex: 1,
                  textTransform: 'uppercase',
                  transform: clickedBrand === brand.name
                    ? 'scale(1.05)'
                    : hoveredBrand === brand.name
                    ? 'scale(1.03)'
                    : 'scale(1)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}>
                  <AnimatedCounter to={brand.count} duration={1400} suffix=" MODELS" />
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spinBMW {
          0% {
            transform: scale(1.15) rotate(0deg);
          }
          100% {
            transform: scale(1.15) rotate(360deg);
          }
        }

        @keyframes hoverGlowPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            filter: brightness(1.3) saturate(1.2);
          }
          50% {
            filter: brightness(1.5) saturate(1.4);
          }
        }

        @keyframes textGlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        @keyframes volumetricPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }

        @keyframes bloomPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.12);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1.8);
          }
          50% {
            opacity: 1;
            transform: scale(2.2);
          }
        }
      `}</style>
    </section>
  );
}

/* ── Collection Preview ── */
function CollectionPreview() {
  const preview = cars.slice(0, 12);
  const [ref, visible] = useIntersectionObserver();

  return (
    <section style={{ padding: 'clamp(88px, 9vw, 132px) 0', background: 'transparent' }} ref={ref}>
      <div className="container">
        <div style={{ marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ width: 44, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)', boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}/>
              <p className="eyebrow" style={{ margin: 0 }}>Full Collection</p>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.1 }}>
              12 Exceptional<br/>
              <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#C9A84C,#E0C06A 55%,#F4D03F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Machines</em>
            </h2>
          </div>
          <Link to="/cars" className="btn btn-outline-gold" data-hover>Browse All →</Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: 20
        }}>
          {preview.map((car, i) => (
            <MiniCard key={car.id} car={car} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniCard({ car, index, visible }) {
  return (
    <div className="hm-card" style={{ borderRadius: radius.md, height: '100%' }}>
    <Link to={`/car/${car.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        className="car-card"
        style={{
          borderRadius: radius.md,
          overflow: 'hidden',
          border: `1px solid ${colors.border2}`,
          background: 'rgba(17,17,23,0.85)',
          opacity: visible ? 1 : 0,
          animation: visible ? `fadeUp 0.6s ${index * 0.08}s ${transitions.easeOut} both` : 'none',
          cursor: 'none',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ width: 130, flexShrink: 0, overflow: 'hidden' }}>
            <OptimizedImage
              src={car.image}
              alt={car.name}
              objectFit="cover"
              className="hm-card-img"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          <div style={{ flex: 1, padding: `${spacing.lg} ${spacing.lg}`, minWidth: 0 }}>
            <p style={{ fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, letterSpacing: typography.letterSpacing.wide, textTransform: 'uppercase', color: colors.gold, marginBottom: spacing.xs }}>{car.brand}</p>
            <h4 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.white, marginBottom: spacing.sm, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.name}</h4>
            <p style={{ fontSize: 11, color: colors.white40, marginBottom: 0 }}>{car.specs.horsepowerStr} · {car.specs.accelStr}</p>
          </div>
        </div>

        {/* Gold price strip */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md,
          padding: `${spacing.md} ${spacing.lg}`,
          background: 'linear-gradient(to top, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.02) 100%)',
          borderTop: '1px solid rgba(201,168,76,0.28)',
        }}>
          <div style={{
            position: 'absolute',
            top: -1, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5) 25%, #E0C06A 50%, rgba(201,168,76,0.5) 75%, transparent)',
          }}/>
          <p style={{
            fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, lineHeight: 1.1,
            ...components.goldText,
          }}>{compactPrice(car.price)}</p>
          <span style={{ fontFamily: typography.fontUI, fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)', transition: 'color 0.3s' }}>
            Details →
          </span>
        </div>
      </div>
    </Link>
    </div>
  );
}

/* ── Private Allocation Countdown ── */
function PrivateAllocationCountdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(23, 59, 59, 0);

    const tick = () => {
      const diff = target - new Date();
      setTimeLeft(diff > 0 ? {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      } : { d: 0, h: 0, m: 0, s: 0 });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { v: timeLeft.d, l: 'Days' },
    { v: timeLeft.h, l: 'Hours' },
    { v: timeLeft.m, l: 'Minutes' },
    { v: timeLeft.s, l: 'Seconds' },
  ];

  return (
    <section style={{ padding: 'clamp(16px, 2vw, 24px) 0 clamp(40px, 5vw, 72px)' }}>
      <div className="container">
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          padding: 'clamp(40px, 5vw, 64px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(201,168,76,0.22)',
          background: 'linear-gradient(135deg, rgba(17,17,23,0.85) 0%, rgba(20,18,12,0.85) 100%)',
        }}>
          {/* Shine sweep */}
          <div className="alloc-shine" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.12) 50%, transparent 60%)',
            backgroundSize: '250% 100%',
            animation: 'allocSweep 5s linear infinite',
            pointerEvents: 'none',
          }} />
          {/* Corner accents */}
          {['top','bottom'].map(pos => (
            <div key={pos} style={{
              position: 'absolute',
              [pos]: 0, left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(to right, transparent, var(--gold), #E0C06A, var(--gold), transparent)',
              boxShadow: '0 0 18px rgba(201,168,76,0.7)',
            }} />
          ))}

          <p className="eyebrow" style={{ marginBottom: 16 }}>Private Allocation</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(30px, 4vw, 48px)',
            fontWeight: 300,
            color: 'var(--white)',
            lineHeight: 1.15,
            marginBottom: 10,
          }}>
            Annual Allocation Window Closes In
          </h2>
          <p style={{ fontSize: 15, color: 'var(--white-40)', maxWidth: 460, margin: '0 auto 40px' }}>
            Secure one of the final build slots for this season's most coveted machines.
          </p>

          <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 20px)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {units.map(({ v, l }) => (
              <div key={l} style={{
                width: 'clamp(76px, 9vw, 100px)',
                padding: '18px 8px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                backdropFilter: 'blur(8px)',
              }}>
                <div key={`${l}-${v}`} className="alloc-tick" style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(30px, 4vw, 44px)',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: '#C9A84C',
                  textShadow: '0 0 24px rgba(201,168,76,0.5)',
                }}>
                  {String(v).padStart(2, '0')}
                </div>
                <div style={{
                  marginTop: 8,
                  fontFamily: 'var(--font-ui)',
                  fontSize: 10,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--white-40)',
                }}>{l}</div>
              </div>
            ))}
          </div>

          <Link to="/cars" className="btn btn-gold" data-hover data-magnetic style={{ marginTop: 40 }}>
            Reserve Your Build
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes allocSweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .alloc-tick {
          animation: allocFlip 0.5s ease-out;
        }
        @keyframes allocFlip {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ── CTA Banner ── */
function CTABanner() {
  const [ref, visible] = useIntersectionObserver();
  return (
    <section ref={ref} style={{ padding: 'clamp(80px, 9vw, 128px) 0' }}>
      <div className="container">
        <div style={{
          background: 'rgba(17,17,23,0.8)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(48px, 6vw, 80px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(30px)',
          transition: 'all 0.8s var(--ease-out)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Experience the Difference</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: 'var(--white)', marginBottom: 20, lineHeight: 1.1 }}>
            Ready to Find Your<br/>
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#C9A84C,#E0C06A 55%,#F4D03F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Perfect Machine?</em>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--white-40)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Let our AI concierge guide you, or explore the full collection at your own pace.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cars" className="btn btn-gold" data-hover data-magnetic>Browse Collection</Link>
            <Link to="/compare" className="btn btn-ghost" data-hover data-magnetic>Compare Models</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer role="contentinfo" aria-label="Site footer" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '52px 0 36px', background: 'rgba(5,5,7,0.98)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 600,
              color: 'var(--white)',
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Brand1M style={{
                fontSize: 26,
                fontWeight: 600,
                background: 'linear-gradient(135deg,var(--gold),var(--gold-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }} />
              <span style={{ fontSize: 26, fontWeight: 600 }}>MOTORS</span>
            </p>
            <p style={{ fontSize: 13, color: 'var(--white-40)', maxWidth: 280 }}>The world's most exclusive automotive experience.</p>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {[['Collection', '/cars'], ['Compare', '/compare'], ['Favorites', '/favorites'], ['Configurator', '/configurator']].map(([label, to]) => (
              <Link key={label} to={to} style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--white-40)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--white-40)'}
              >{label}</Link>
            ))}
          </div>
        </div>
        <div className="divider" style={{ marginBottom: 24 }}/>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
          {[['Contact', '/contact'], ['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms-of-service'], ['Loyalty', '/loyalty']].map(([label, to]) => (
            <Link key={label} to={to} style={{ fontFamily: 'var(--font-ui)', fontSize: 10.5, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--white-40)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--white-40)'}
            >{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--white-20)' }}>© 2026 1M Motors. All rights reserved.</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '2.5px', color: 'var(--white-20)' }}>LUXURY · PERFORMANCE · EXCELLENCE</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Grid lines decoration ── */
/* ── Classy-style hero textures (ported aesthetic from 21st "Classy Hero") ── */

function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        opacity: 0.06, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 150px',
      }}
    />
  );
}

function LightBeamSweep() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 3, pointerEvents: 'none' }} aria-hidden="true">
      <div style={{
        position: 'absolute',
        top: '-50%', bottom: '-50%',
        width: '36%',
        left: '-40%',
        background: 'linear-gradient(115deg, transparent 30%, rgba(244,208,63,0.05) 45%, rgba(201,168,76,0.03) 55%, transparent 70%)',
        transform: 'rotate(14deg)',
        animation: 'heroLightSweep 9s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute',
        top: '-50%', bottom: '-50%',
        width: '20%',
        left: '-40%',
        background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.035) 50%, transparent 70%)',
        transform: 'rotate(14deg)',
        animation: 'heroLightSweep 9s ease-in-out 1.6s infinite',
      }}/>
    </div>
  );
}

function DottedGrid() {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.055,
      backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
      backgroundSize: '34px 34px',
    }}/>
  );
}

function LetterReveal({ text, style, delay = 0 }) {
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap', ...style }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: delay + i * 0.035, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block' }}
        >{ch === ' ' ? '\u00A0' : ch}</motion.span>
      ))}
    </span>
  );
}

function RippleButton({ children, className = '', style, onClick, ...props }) {
  const [ripples, setRipples] = useState([]);
  const ref = useRef(null);

  const addRipple = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();
    setRipples(r => [...r, { id, x, y, size }]);
    setTimeout(() => setRipples(r => r.filter(ri => ri.id !== id)), 700);
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={ref}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map(ri => (
        <motion.span
          key={ri.id}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ri.x, top: ri.y,
            width: ri.size, height: ri.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </button>
  );
}