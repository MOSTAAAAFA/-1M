import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cars } from '../data/cars';
import { useApp } from '../context/AppContext';
import ImageGallery from '../components/ImageGallery';
import SocialShare from '../components/SocialShare';
import TestDriveBooking from '../components/TestDriveBooking';
import { StockAlert, PriceAlert } from '../components/FlashSaleCountdown';
import FinanceCalculator from '../components/FinanceCalculator';
import ReviewsSection from '../components/ReviewsSection';
import Crest1M from '../components/Crest1M';
import OptimizedImage from '../components/OptimizedImage';
import { trackActivity } from '../utils/activity';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites } = useApp();
  const { settings } = useSiteSettings();
  const [loaded, setLoaded] = useState(false);
  const [addedPulse, setAddedPulse] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const [isMuted, setIsMuted] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const smoothHeroScale = useSpring(heroScale, { stiffness: 100, damping: 30 });

  const car = cars.find(c => c.id === Number(id));
  const relatedCars = cars.filter(c => c.id !== car?.id && c.brand === car?.brand).slice(0, 3);
  const isFav = favorites.includes(car?.id);

  const galleryImages = car
    ? [car.heroImage || car.image, car.image].filter((v, i, a) => v && a.indexOf(v) === i)
    : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const t = setTimeout(() => setLoaded(true), 80);
    if (car) trackActivity('view', car);
    return () => clearTimeout(t);
  }, [id, car]);

  if (!car) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 17H3v-6l2-5h14l2 5v6h-2" />
          <path d="M3 17h18" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '32px',
          color: '#f0ede8',
        }}>Vehicle Not Found</h2>
        <Link to="/" className="btn btn-gold">Back to Collection</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(car);
    setAddedPulse(true);
    setTimeout(() => setAddedPulse(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '72px' }}
    >

{/* Hero */}
<section ref={heroRef} style={{
  position: 'relative',
  height: 'clamp(500px, 70vh, 800px)',
  overflow: 'hidden',
}}>
    {car.heroVideo ? (
    <>
    <motion.video
      ref={videoRef}
      autoPlay
      muted={isMuted}
      loop
      playsInline
      // These are 100MB+ files. preload="auto" made the browser buffer the
      // whole thing before the user could skip, and the poster frame meant
      // they saw black for seconds first.
      preload="metadata"
      poster={car.heroImage || car.image}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
        y: smoothHeroY,
        scale: smoothHeroScale,
        opacity: heroOpacity,
      }}
    >
      <source src={car.heroVideo} type="video/mp4" />
    </motion.video>

    {/* Sound Toggle Button */}
    <motion.button
      onClick={() => setIsMuted(!isMuted)}
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      whileHover={{ scale: 1.1, background: 'rgba(201,168,76,0.2)' }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(201,168,76,0.5)',
        color: 'var(--gold)',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      {isMuted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </motion.button>
    </>
  ) : (
    <>
    <motion.img
      src={car.heroImage || car.image}
      alt={car.name}
      onError={(e) => { e.currentTarget.src = `https://placehold.co/1920x1080/111117/C9A84C?text=${encodeURIComponent(car.brand + ' ' + car.name)}`; }}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center 40%',
        y: smoothHeroY,
        scale: smoothHeroScale,
        opacity: heroOpacity,
      }}
    />
    {/* Gallery launcher */}
    <motion.button
      onClick={() => setGalleryOpen(true)}
      aria-label={`Open gallery for ${car.name}`}
      whileHover={{ scale: 1.06, background: 'rgba(201,168,76,0.2)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        borderRadius: '50px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(201,168,76,0.4)',
        color: 'var(--gold)',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
      </svg>
      View Gallery
    </motion.button>
    </>
  )}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to top, rgba(5,5,7,1) 0%, rgba(5,5,7,0.5) 40%, rgba(5,5,7,0.15) 100%),
            linear-gradient(to right, rgba(5,5,7,0.8) 0%, transparent 40%)
          `,
        }} />

        {/* Back button */}
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '32px' }}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(5,5,7,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(240,237,232,0.7)',
              padding: '10px 16px',
              minHeight: '44px',
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              e.currentTarget.style.color = '#c9a84c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(240,237,232,0.7)';
            }}
          >
            ← Back
          </button>
        </div>

        {/* Title overlay */}
        <div className="container" style={{
          position: 'absolute',
          bottom: '48px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          zIndex: 2,
        }}>
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 0.8s 0.3s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#c9a84c',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Crest1M size={26} />
              <span style={{ width: '24px', height: '1px', background: '#c9a84c', display: 'inline-block' }} />
              {car.brand} · {car.year} · {car.category}
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px, 5vw, 72px)',
              fontWeight: '400',
              color: '#f0ede8',
              lineHeight: '1',
              letterSpacing: '-0.5px',
            }}>{car.name}</h1>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: '0 0 100px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '48px',
            paddingTop: '48px',
            alignItems: 'start',
          }}>
            {/* Left column */}
            <div>
              {/* Showcase image */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  height: 380,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <OptimizedImage
                    src={car.heroImage || car.image}
                    alt={car.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    fallback={`https://placehold.co/800x600/111117/C9A84C?text=${encodeURIComponent(car.brand + ' ' + car.name)}`}
                  />
                </div>
              </div>

              {/* Tagline */}
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                fontWeight: '300',
                fontStyle: 'italic',
                color: 'rgba(240,237,232,0.6)',
                lineHeight: '1.5',
                marginBottom: '40px',
                paddingBottom: '40px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>"{car.tagline}"</p>

              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: '0',
                marginBottom: '40px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>
                {[
                  { key: 'specs', label: 'Specifications' },
                  { key: 'features', label: 'Features' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    role="tab"
                    aria-selected={activeTab === key}
                    aria-controls={`${key}-panel`}
                    style={{
                      padding: '14px 28px',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === key
                        ? '2px solid #c9a84c'
                        : '2px solid transparent',
                      color: activeTab === key ? '#c9a84c' : 'rgba(240,237,232,0.4)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      marginBottom: '-1px',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'specs' && (
                <div
                  id="specs-panel"
                  role="tabpanel"
                  aria-labelledby="specs-tab"
                  style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px',
                  animation: 'fadeUp 0.4s both',
                }}>
                  {Object.entries(car.specs).map(([key, value]) => (
                    <SpecCard key={key} label={key} value={value} />
                  ))}
                </div>
              )}

              {activeTab === 'features' && (
                <div
                  id="features-panel"
                  role="tabpanel"
                  aria-labelledby="features-tab"
                  style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  animation: 'fadeUp 0.4s both',
                }}>
                  {car.features.map((feature, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '18px 24px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.25s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
                        e.currentTarget.style.background = 'rgba(201,168,76,0.04)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '14px',
                        color: 'rgba(240,237,232,0.8)',
                      }}>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Owner reviews */}
              <ReviewsSection carId={car.id} carName={car.name} />

              {/* Related cars */}
              {relatedCars.length > 0 && (
                <div style={{ marginTop: '60px' }}>
                  <p className="section-eyebrow" style={{ marginBottom: '24px' }}>
                    More from {car.brand}
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                  }}>
                    {relatedCars.map(rc => (
                      <RelatedCard key={rc.id} car={rc} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column — Purchase card */}
            <div style={{ position: 'sticky', top: '96px' }}>
              <div style={{
                background: 'rgba(16,16,22,0.9)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                animation: 'fadeUp 0.6s 0.2s both',
              }}>
                {/* Price */}
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(240,237,232,0.4)',
                  marginBottom: '6px',
                }}>Starting Price</p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '42px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}>{fmt(car.price)}</p>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(240,237,232,0.3)',
                  marginBottom: '28px',
                }}>Excluding taxes, registration & delivery</p>

                {/* Color */}
                <div style={{
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c9a84c, #f0ede8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: 'rgba(240,237,232,0.3)',
                      marginBottom: '2px',
                    }}>Color</p>
                    <p style={{ fontSize: '13px', color: '#f0ede8', fontWeight: '400' }}>{car.color}</p>
                  </div>
                </div>

                {/* Availability */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '28px',
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: car.inStock ? '#4ade80' : '#e03030',
                    boxShadow: car.inStock
                      ? '0 0 0 4px rgba(74,222,128,0.15)'
                      : '0 0 0 4px rgba(224,48,48,0.15)',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    color: car.inStock ? 'rgba(240,237,232,0.7)' : 'rgba(240,237,232,0.5)',
                  }}>
                    {car.inStock ? 'In Stock — Ready for Delivery' : 'Pre-Order — 8–12 Months'}
                  </span>
                </div>

                {/* Financing estimate */}
                <div style={{ marginBottom: '24px' }}>
                  <FinanceCalculator price={car.price} />
                </div>

                {/* CTAs */}
                <button
                  onClick={handleAddToCart}
                  aria-label={`Add ${car.name} to garage`}
                  data-magnetic
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: addedPulse
                      ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                      : 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                    border: 'none',
                    borderRadius: '10px',
                    color: addedPulse ? '#fff' : '#050507',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                    transform: addedPulse ? 'scale(0.98)' : 'scale(1)',
                  }}
                >
                  {addedPulse ? '✓ Added to Garage' : '+ Add to Garage'}
                </button>

                <button
                  onClick={() => toggleFavorite(car)}
                  aria-label={isFav ? `Remove ${car.name} from favorites` : `Add ${car.name} to favorites`}
                  aria-pressed={isFav}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'transparent',
                    border: isFav
                      ? '1px solid rgba(201,168,76,0.5)'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: isFav ? '#c9a84c' : 'rgba(240,237,232,0.5)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    transition: 'all 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => {
                    if (!isFav) {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                      e.currentTarget.style.color = 'rgba(201,168,76,0.7)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isFav) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'rgba(240,237,232,0.5)';
                    }
                  }}
                >
                  <span>{isFav ? '♥' : '♡'}</span>
                  {isFav ? 'Saved to Favorites' : 'Save to Favorites'}
                </button>

                {/* Book a test drive */}
                <button
                  onClick={() => setBookingOpen(true)}
                  data-magnetic
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.35)',
                    borderRadius: '10px',
                    color: '#c9a84c',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    transition: 'all 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ color: 'var(--gold)' }}><InfoIcon name="flag" /></span>
                  Book a Test Drive
                </button>

                {/* Info bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {[
                    { icon: 'delivery', text: 'Free white-glove delivery' },
                    { icon: 'shield', text: '4-year manufacturer warranty' },
                    { icon: 'key', text: 'Complimentary test drive' },
                    { icon: 'return', text: '14-day return policy' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <InfoIcon name={icon} />
                      <span style={{ fontSize: '12px', color: 'rgba(240,237,232,0.6)' }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Share */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <SocialShare
                    title={`${car.brand} ${car.name} at 1M Motors`}
                    description={car.tagline}
                  />
                </div>

                {/* VIP Alerts */}
                {car.inStock ? (
                  <PriceAlert currentPrice={car.price} />
                ) : (
                  <StockAlert productName={car.name} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test drive booking modal */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBookingOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5,5,7,0.85)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              overflowY: 'auto',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 24, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 560,
                maxHeight: '88vh',
                overflowY: 'auto',
                borderRadius: '20px',
              }}
            >
              <button
                onClick={() => setBookingOpen(false)}
                aria-label="Close booking form"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1px solid rgba(201,168,76,0.4)',
                  background: 'rgba(5,5,7,0.8)',
                  color: '#c9a84c',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >✕</button>
              {settings.testDriveEnabled !== false && <TestDriveBooking carName={car.name} carId={car.id} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery lightbox */}
      <ImageGallery
        images={galleryImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </motion.div>
  );
}

/* ── Spec Card ── */
function SpecCard({ label, value }) {
  const labelMap = {
    engine: 'Engine',
    horsepower: 'Power',
    torque: 'Torque',
    topSpeed: 'Top Speed',
    acceleration: 'Acceleration',
    transmission: 'Transmission',
    drivetrain: 'Drivetrain',
    range: 'Range',
  };

  return (
    <div
      className="glass-ultra"
      style={{
        padding: '22px 24px',
        borderRadius: '14px',
        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)';
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '9px',
        fontWeight: '600',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--ultra-gold)',
        marginBottom: '8px',
        opacity: 0.85,
      }}>{labelMap[label] || label}</p>
      <p style={{
        fontFamily: 'var(--font-telemetry)',
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: '0.05em',
        color: value === 'N/A' ? 'rgba(250,250,249,0.3)' : 'var(--ultra-ivory)',
        lineHeight: 1.3,
        textShadow: '0 0 20px rgba(212,175,55,0.25)',
      }}>{value}</p>
    </div>
  );
}

/* ── Related Card ── */
function RelatedCard({ car }) {
  return (
    <Link
      to={`/car/${car.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(18,18,24,0.8)',
          transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ height: '130px', overflow: 'hidden' }}>
          {/* Lazy by default: this sits at the very bottom of a long page, so
              eager-loading it competes with content the user is still reading. */}
          <OptimizedImage
            src={car.image}
            alt={car.name}
            width="100%"
            height="100%"
            objectFit="cover"
            fallback={`https://placehold.co/400x300/111117/C9A84C?text=${encodeURIComponent(car.brand)}`}
          />
        </div>
        <div style={{ padding: '14px' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '15px',
            fontWeight: '600',
            color: '#f0ede8',
            marginBottom: '4px',
          }}>{car.name}</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '14px',
            background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(car.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function InfoIcon({ name }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  switch (name) {
    case 'delivery': return (
      <svg {...common}>
        <path d="M10 17h4V5H2v12h3" />
        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    );
    case 'shield': return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
    case 'key': return (
      <svg {...common}>
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="m21 2-9.6 9.6" />
        <path d="m15.5 7.5 3 3L22 7l-3-3" />
      </svg>
    );
    case 'return': return (
      <svg {...common}>
        <path d="M1 4v6h6" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    );
    case 'flag': return (
      <svg {...common}>
        <path d="M4 22V4s0-2 2-2h10.5l-2 4 2 4H6" />
      </svg>
    );
    default: return null;
  }
}