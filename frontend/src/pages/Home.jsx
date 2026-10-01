import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cars } from '../data/cars';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import usePointerSpotlight from '../hooks/usePointerSpotlight';
import Brand1M from '../components/Brand1M';
import Crest1M from '../components/Crest1M';
import CarCard from '../components/CarCard';
import ScrollReveal from '../components/ScrollReveal';
import { TextRevealByWord } from '../components/TextReveal';
import OptimizedImage from '../components/OptimizedImage';
import { shouldEnableKenBurns } from '../utils/performanceOptimization';
import { compactPrice } from '../utils/finance';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { colors, spacing, radius, typography, transitions, components } from '../styles/designTokens';

const HERO_SLIDES = [
  { carId: 20, headline: 'Absolute', accent: 'Power', sub: 'Absolute power. Absolute art.' },
  { carId: 11, headline: 'Pure', accent: 'Racing DNA', sub: 'The race track distilled into a road car.' },
  { carId: 36, headline: 'Absolute', accent: 'Performance', sub: 'Eat the track.' },
  { carId: 56, headline: 'The last', accent: 'pure Lotus', sub: 'Precision engineered for pure driving emotion.' },
  { carId: 40, headline: 'final Aventador', accent: 'ultimate V12', sub: 'Precision engineered for pure driving emotion.' },
  { carId: 32, headline: 'Open-air thrills', accent: 'with Aston soul', sub: 'Precision engineered for pure driving emotion.' },
];

export default function Home() {
  const { settings } = useSiteSettings();
  const [slide, setSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const carsRef = useRef(null);
  const heroRef = useRef(null);

  // Pointer-tracked light over the hero backdrop (B1). Writes CSS vars only, so
  // pointer movement never re-renders this page.
  usePointerSpotlight(heroRef, { radius: 520 });

  // Hero autoplay controls
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [heroHovered, setHeroHovered] = useState(false);
  const [heroFocused, setHeroFocused] = useState(false);
  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const navigate = useNavigate();

  // Performance optimization flags
  const enableKenBurns = shouldEnableKenBurns();

  // Auto slide transition every 6 seconds (pauses on toggle, hover, focus, hidden tab, reduced-motion)
  const autoplayBlocked = autoplayPaused || heroHovered || heroFocused;
  useEffect(() => {
    if (prefersReducedMotion || autoplayBlocked) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled || autoplayBlocked) return;
      if (document.hidden) {
        // Tab is in the background: keep re-arming so autoplay resumes on return
        timer = setTimeout(tick, 1000);
        return;
      }
      setPrevSlide(slide);
      setSlide(s => (s + 1) % HERO_SLIDES.length);
    };
    let timer = setTimeout(tick, 4000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [slide, autoplayBlocked, prefersReducedMotion]);

  const goToSlide = (i) => {
    if (i === slide) return;
    setPrevSlide(slide);
    setSlide(i);
  };

  // Keyboard navigation — arrow keys cycle the hero (ignored while typing)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      const next = e.key === 'ArrowRight'
        ? (slide + 1) % HERO_SLIDES.length
        : (slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
      setPrevSlide(slide);
      setSlide(next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slide]);

  const current = HERO_SLIDES[slide];
  const heroCar = cars.find(c => c.id === current.carId);

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', position: 'relative', zIndex: 0 }}>
      {/* ══ HERO ══ */}
      <section
        ref={heroRef}
        className="spotlight-surface"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
        onFocus={() => setHeroFocused(true)}
        onBlur={() => setHeroFocused(false)}
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100vh',
          minHeight: 700,
          overflow: 'hidden',
          paddingTop: 'var(--nav-offset)', // clears announcement bar + navbar
        }}
      >

        {/* Background image with cinematic crossfade + zoom transition */}
        <HeroBackdrop slide={slide} prevSlide={prevSlide} enableKenBurns={enableKenBurns} />

        {/* Tracked light. z-index 0 sits above the backdrop (which sets its own
            stacking) and below the legibility gradients, so the light reveals
            the photo without reducing text contrast. */}
        <div className="spotlight-layer" aria-hidden="true" />

        {/* Gradient overlays (minimum needed for legibility) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,5,7,0.92) 30%, rgba(5,5,7,0.5) 62%, rgba(5,5,7,0.12) 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #050507 0%, rgba(5,5,7,0.95) 16%, rgba(5,5,7,0.6) 40%, rgba(5,5,7,0.22) 62%, transparent 80%)',
        }}/>

        {/* Bottom fade edge - hero (dissolves hard image edge) */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: '38%',
          background: 'linear-gradient(to top, #050507 0%, #050507 30%, rgba(5,5,7,0.55) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}/>

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
          {!prefersReducedMotion && (
            <button
              onClick={() => setAutoplayPaused(p => !p)}
              aria-pressed={autoplayPaused}
              aria-label={autoplayPaused ? 'Play slideshow' : 'Pause slideshow'}
              title={autoplayPaused ? 'Play' : 'Pause'}
              style={{
                marginTop: 8,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(5,5,7,0.55)',
                border: '1px solid rgba(201,168,76,0.45)',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
                boxShadow: autoplayPaused ? '0 0 14px rgba(201,168,76,0.45)' : 'none',
              }}
            >
              {autoplayPaused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="container" style={{
          height: '100%',
          maxWidth: 'none',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          position: 'relative',
          zIndex: 5,
          paddingTop: 'var(--nav-offset)',
          paddingLeft: 28,
          paddingBottom: 'clamp(104px, 13vh, 140px)',
        }}>
          <div style={{ maxWidth: 660, textAlign: 'left', width: '100%' }}>

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
                {/* Signature gold crest — same emblem as the footer */}
                <div style={{
                  position: 'relative',
                  width: 50,
                  height: 50,
                  flexShrink: 0,
                }}>
                  <Crest1M size={50} />
                </div>

                {/* Vertical divider */}
                <div style={{
                  width: 1,
                  height: 28,
                  background: 'rgba(201,168,76,0.4)',
                  flexShrink: 0,
                }}/>

                {/* Eyebrow text */}
                <div>
                  <p style={{
                    fontFamily: 'var(--font-data)', fontSize: 11, fontWeight: 400,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: '#C9A84C',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    <Brand1M name={settings.siteName} style={{ fontSize: 11, fontWeight: 400, color: '#C9A84C' }} /> {settings.siteSuffix || 'MOTORS'}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 400,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(240,237,232,0.62)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {settings.heroEyebrowTop || 'Luxury Performance'} · {settings.heroEyebrowBottom || 'Est. 2026'}
                  </p>
                </div>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.3rem, 5vw, 4.6rem)',
                fontWeight: 400,
                lineHeight: 1.08,
                color: 'var(--white)',
                marginBottom: 18,
                letterSpacing: '-0.02em',
                wordBreak: 'keep-all',
                overflowWrap: 'normal',
                whiteSpace: 'normal',
              }}>
                {current.headline}
                <br/>
                <em style={{
                  fontStyle: 'italic',
                  color: '#C9A84C',
                  fontWeight: 400,
                }}>
                  {current.accent}
                </em>
              </h1>

              {/* Gold tick */}
              <div style={{
                width: 48,
                height: 1,
                background: '#C9A84C',
                marginBottom: 24,
              }}/>

              <p style={{
                fontSize: 16, fontWeight: 300,
                color: 'rgba(240,237,232,0.72)',
                lineHeight: 1.75, marginBottom: 40, maxWidth: 440,
                letterSpacing: '0.2px',
              }}>{current.sub}</p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <RippleButton
                  className="btn btn-gold hover-lift"
                  onClick={() => navigate(`/car/${heroCar?.id}`)}
                  data-hover
                  data-no-magnetic
                >View Vehicle</RippleButton>
                <RippleButton
                  className="btn btn-ghost hover-lift"
                  onClick={() => carsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  data-hover
                  data-no-magnetic
                >Explore Collection</RippleButton>
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

      {/* Footer is mounted globally in App.js's route frame, not per-page, so
          every public route gets it. */}
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
  const isHidden = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => { scrollY.current = window.scrollY; };
    const onMouse = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 15;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 15;
    };
    const onVisibility = () => { isHidden.current = document.hidden; };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    const animate = () => {
      // Always schedule the next frame first so the loop survives tab switches
      rafRef.current = requestAnimationFrame(animate);
      if (isHidden.current) return; // skip work while tab is in the background

      // Smooth easing (same feel as the original useMouseParallax hook)
      current.current.x += (target.current.x - current.current.x) * 0.1;
      current.current.y += (target.current.y - current.current.y) * 0.1;
      const ty = scrollY.current * 0.35 + current.current.y;
      const tx = current.current.x;

      parallaxLayers.current.forEach((el) => {
        if (el) el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
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
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/1920x1080/111117/C9A84C?text=${encodeURIComponent(car ? `${car.brand} ${car.name}` : '1M Motors')}`;
                  }}
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
        // Tight role: the stats strip is a divider between hero and content, so
        // it sits closer to both than a full section would.
        paddingBlock: 'var(--rhythm-tight)',
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
            // Lead tile spans half the row; the rest pair up beside it. The
            // last tile then runs full width to close the composition.
            data-bento="equal"
            style={{
              gridColumn: 'span 3',
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
            {/* Wide tiles get horizontal type, not a stretched 12-column box:
                the copy stays a readable measure instead of one long line. */}
            {i === 3 && (
              <style>{`
                @media (min-width: 641px) {
                  .stats-grid [data-bento='wide'] {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
                    align-items: center;
                    gap: 40px;
                    text-align: left;
                  }
                  .stats-grid [data-bento='wide'] > div:last-of-type {
                    justify-content: center;
                  }
                }
              `}</style>
            )}
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
          .stats-grid > * { grid-column: span 1 !important; }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .stats-grid > * { grid-column: span 1 !important; }
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
            <span
              aria-hidden="true"
              style={{
                marginLeft: '72px',
                color: 'rgba(201,168,76,0.6)',
                textShadow: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
              </svg>
            </span>
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
  const [ref] = useIntersectionObserver();

  return (
    <section className="rhythm rhythm--generous" ref={ref}>
      <div className="container">
        <div className="rhythm-heading" style={{ flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ width: 28, height: 1, background: '#C9A84C' }}/>
              <p className="eyebrow" style={{ margin: 0 }}>Editor's Selection</p>
            </div>
            <h2 className="type-display-md" style={{ fontWeight: 400, color: 'var(--white)' }}>
              <TextRevealByWord delay={0} stagger={0.1}>
                Most Coveted
              </TextRevealByWord>
              <br/>
              <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>
                <TextRevealByWord delay={0.3} stagger={0.1}>
                  Machines
                </TextRevealByWord>
              </em>
            </h2>
          </div>
          <Link to="/cars" className="btn btn-ghost" data-hover>View All Collection</Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
          gridAutoRows: '1fr',
          gap: 28
        }}>
          {featured.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
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

    let cancelled = false;
    const timers = [];

    const later = (fn, ms) => {
      const t = setTimeout(() => { if (!cancelled) fn(); }, ms);
      timers.push(t);
      return t;
    };

    const runSequence = () => {
      if (cancelled || document.hidden) return;
      let index = 0;
      const interval = setInterval(() => {
        if (cancelled || document.hidden) {
          clearInterval(interval);
          return;
        }
        if (index < brands.length) {
          setCurrentIndex(index);
          index++;
        } else {
          clearInterval(interval);
          // Light all brands after sequence completes
          later(() => {
            if (cancelled || document.hidden) return;
            setAllLit(true);

            // Hold all lit for 3 seconds, then restart
            later(() => {
              if (cancelled || document.hidden) return;
              setAllLit(false);
              setCurrentIndex(-1);
              // Wait 500ms then restart the sequence
              later(runSequence, 500);
            }, 3000); // Hold for 3 seconds
          }, 500);
        }
      }, 400); // 400ms between each brand lighting
      timers.push(interval);
    };

    runSequence();

    return () => {
      cancelled = true;
      timers.forEach(t => clearTimeout(t));
    };
  }, [visible, brands.length]);

  return (
    <section ref={ref} className="rhythm rhythm--tight" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 'var(--rhythm-heading-gap)' }}>
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
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://placehold.co/120x120/111117/C9A84C?text=${encodeURIComponent(brand.name)}`;
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
    <section className="rhythm rhythm--standard" style={{ background: 'transparent' }} ref={ref}>
      <div className="container">
        <div className="rhythm-heading" style={{ flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ width: 44, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)', boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}/>
              <p className="eyebrow" style={{ margin: 0 }}>Full Collection</p>
            </div>
            <h2 className="type-display-sm" style={{ fontWeight: 300, color: 'var(--white)' }}>
              12 Exceptional<br/>
              <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#C9A84C,#E0C06A 55%,#F4D03F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Machines</em>
            </h2>
          </div>
          <Link to="/cars" className="btn btn-outline-gold" data-hover>View All Collection →</Link>
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
      if (document.hidden) return;
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
    /* Tight: this is a call to action, not a content section. It should sit
       close to what precedes it and breathe out into the footer. */
    <section style={{ paddingBlock: 'var(--rhythm-tight) var(--rhythm-standard)' }}>
      <div className="container">
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          padding: 'var(--rhythm-heading-gap)',
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
    <section ref={ref} className="rhythm rhythm--hero">
      <div className="container">
        <div className="spotlight-surface" style={{
          background: 'rgba(17,17,23,0.8)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--rhythm-generous)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(30px)',
          transition: 'all 0.8s var(--ease-out)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div className="spotlight-layer" aria-hidden="true" />
          <p className="eyebrow" style={{ marginBottom: 20 }}>Experience the Difference</p>
          <h2 className="type-display-md" style={{ fontWeight: 300, color: 'var(--white)', marginBottom: 20 }}>
            Ready to Find Your<br/>
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#C9A84C,#E0C06A 55%,#F4D03F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Perfect Machine?</em>
          </h2>
          <p className="type-body" style={{ color: 'var(--white-40)', margin: '0 auto 40px', maxWidth: 480 }}>
            Let our AI concierge guide you, or explore the full collection at your own pace.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cars" className="btn btn-gold" data-hover data-magnetic>View All Collection</Link>
            <Link to="/compare" className="btn btn-ghost" data-hover data-magnetic>Compare Models</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ── Grid lines decoration ── */

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
