import React, { useState, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ReducedMotionProvider, useReducedMotion } from './context/ReducedMotionContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Brand1M from './components/Brand1M';
import soundManager from './utils/soundManager';
import LazyLoadWrapper from './components/LazyLoadWrapper';
import { LenisSmoothScroll, ScrollToTop, FilmGrain } from './components/GlobalPremiumEffects';
import { SparklesIcon } from './components/icons';
import VideoBackground from './components/VideoBackground';

import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Toast from './components/Toast';
import CustomCursor from './components/CustomCursor';
import { ParticleTrail } from './components/MouseTrail';
import AIAssistant from './components/AiAssistant';
import AnnouncementBar from './components/AnnouncementBar';
import BrandWatermarkBackground from './components/BrandWatermarkBackground';
import ScrollProgressBar from './components/ScrollProgressBar';
import ThemeToggle from './components/ThemeToggle';
import WhatsAppButton from './components/WhatsAppButton';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import { routeVariants } from './components/PageTransition';

// Critical path - load immediately
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import UserLogin from './pages/UserLogin';
import Register from './pages/Register';

import './index.css';

// Non-critical - lazy load for code splitting
const Compare = lazy(() => import('./pages/Compare'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Configurator = lazy(() => import('./pages/Configurator'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoyaltyPage = lazy(() => import('./pages/LoyaltyPage'));

// Admin pages - lazy load (heavy and rarely used)
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCars = lazy(() => import('./pages/AdminCars'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));

// User & informational pages - lazy load (less frequent)
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Orders = lazy(() => import('./pages/Orders'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Initialize sound manager
if (typeof window !== 'undefined') {
  window.soundManager = soundManager;
}

/* ══ SPLASH SCREEN ══ */
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → hold → exit

  useEffect(() => {
    // Hold briefly then start exit animation (shown once per session)
    const t1 = setTimeout(() => setPhase('exit'), 1500);
    // Remove splash after exit animation finishes
    const t2 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'linear-gradient(135deg, #050507 0%, #0a0a0e 50%, #050507 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.08)' : 'scale(1)',
      transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: phase === 'exit' ? 'none' : 'all',
    }}>

      {/* Gold line top */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: phase === 'enter' ? '100%' : '0%',
        height: 2,
        background: 'linear-gradient(to right, transparent, #C9A84C, #E0C06A, #C9A84C, transparent)',
        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        transitionDelay: '0.2s',
        boxShadow: '0 0 25px rgba(201,168,76,0.9), 0 0 50px rgba(201,168,76,0.6), 0 0 75px rgba(201,168,76,0.3)',
        animation: 'lineGlow 2s ease-in-out infinite',
      }}/>

      {/* Gold line bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: phase === 'enter' ? '100%' : '0%',
        height: 2,
        background: 'linear-gradient(to right, transparent, #C9A84C, #E0C06A, #C9A84C, transparent)',
        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        transitionDelay: '0.2s',
        boxShadow: '0 0 25px rgba(201,168,76,0.9), 0 0 50px rgba(201,168,76,0.6), 0 0 75px rgba(201,168,76,0.3)',
        animation: 'lineGlow 2s ease-in-out infinite 1s',
      }}/>

      {/* Logo */}
      <div style={{
        textAlign: 'center',
        opacity: phase === 'enter' ? 1 : 0,
        transform: phase === 'enter' ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.6s, transform 0.6s',
        animation: 'splashLogoIn 0.9s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        {/* Gold Circle Logo - Same as Navbar & Hero */}
        <div style={{
          marginBottom: 32,
          animation: 'shieldPulse 2s ease-in-out infinite',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'relative',
            width: 100,
            height: 100,
          }}>
            {/* Outer glow ring - pulsing */}
            <div style={{
              position: 'absolute',
              inset: -15,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.5) 0%, rgba(201,168,76,0.15) 50%, transparent 70%)',
              animation: 'logoGlowPulse 3s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            {/* Main gold circle */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: 36,
              fontWeight: 900,
              color: '#000',
              letterSpacing: '-1px',
              boxShadow: '0 8px 32px rgba(201,168,76,0.8), 0 0 60px rgba(244,208,63,0.7), 0 0 100px rgba(201,168,76,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
              border: '3px solid rgba(255,255,255,0.3)',
              animation: 'logoGlow 2.5s ease-in-out infinite',
            }}>
              <Brand1M style={{ fontSize: 36, fontWeight: 900, color: '#000' }} />

              {/* Inner shine effect */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '20%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 60%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                animation: 'logoShine 3s ease-in-out infinite',
              }} />

              {/* Electric flash overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(244,208,63,0.3) 0%, transparent 50%)',
                animation: 'electricFlash 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: 54,
          fontWeight: 700,
          letterSpacing: '8px',
          textTransform: 'uppercase',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
        }}>
          <Brand1M style={{
            fontSize: 54,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #F4D03F 0%, #E0C06A 50%, #C9A84C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(201,168,76,0.8), 0 0 40px rgba(201,168,76,0.6), 0 0 60px rgba(201,168,76,0.4)',
            animation: 'goldTextGlow 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 54,
            fontWeight: 700,
            color: '#F0EDE8',
            textShadow: '0 0 20px rgba(240,237,232,0.8), 0 0 40px rgba(240,237,232,0.5), 0 0 60px rgba(240,237,232,0.3)',
            animation: 'whiteTextGlow 2s ease-in-out infinite',
          }}>MOTORS</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: 11,
          letterSpacing: '7px',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.9)',
          marginBottom: 56,
          textShadow: '0 0 15px rgba(201,168,76,0.7), 0 0 30px rgba(201,168,76,0.5)',
          animation: 'goldTaglineGlow 2s ease-in-out infinite',
        }}>
          LUXURY · PERFORMANCE · EXCELLENCE
        </div>

        {/* Loading bar with enhanced animation */}
        <div style={{
          width: 160,
          height: 3,
          background: 'rgba(201,168,76,0.15)',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '3px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #C9A84C, #F4D03F, #E0C06A, #C9A84C)',
            backgroundSize: '200% 100%',
            animation: 'splashBar 1.8s cubic-bezier(0.4,0,0.2,1) forwards, shimmerBar 2s linear infinite',
            boxShadow: '0 0 20px rgba(201,168,76,0.8), 0 0 40px rgba(201,168,76,0.4)',
            borderRadius: '3px',
          }}/>
        </div>
      </div>

      <style>{`
        @keyframes splashLogoIn {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splashBar {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes shimmerBar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes shieldPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.03);
            opacity: 0.95;
          }
        }
        @keyframes goldTextGlow {
          0%, 100% {
            textShadow: 0 0 20px rgba(201,168,76,0.8), 0 0 40px rgba(201,168,76,0.6), 0 0 60px rgba(201,168,76,0.4);
          }
          50% {
            textShadow: 0 0 30px rgba(201,168,76,1), 0 0 60px rgba(201,168,76,0.8), 0 0 90px rgba(201,168,76,0.6);
          }
        }
        @keyframes logoGlow {
          0%, 100% {
            box-shadow:
              0 4px 20px rgba(201,168,76,0.6),
              0 0 40px rgba(244,208,63,0.4),
              0 0 70px rgba(201,168,76,0.3),
              inset 0 2px 3px rgba(255,255,255,0.3),
              inset 0 -1px 2px rgba(0,0,0,0.15);
          }
          50% {
            box-shadow:
              0 4px 28px rgba(201,168,76,0.8),
              0 0 60px rgba(244,208,63,0.6),
              0 0 110px rgba(201,168,76,0.5),
              inset 0 2px 4px rgba(255,255,255,0.35),
              inset 0 -1px 3px rgba(0,0,0,0.2);
          }
        }
        @keyframes logoGlowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        @keyframes logoShine {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-10%, -10%) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translate(5%, 5%) scale(1.15);
          }
        }
        @keyframes electricFlash {
          0%, 90%, 100% {
            opacity: 0;
          }
          92%, 94%, 96% {
            opacity: 0.5;
          }
          93%, 95% {
            opacity: 0.2;
          }
        }
        @keyframes whiteTextGlow {
          0%, 100% {
            textShadow: 0 0 20px rgba(240,237,232,0.8), 0 0 40px rgba(240,237,232,0.5), 0 0 60px rgba(240,237,232,0.3);
          }
          50% {
            textShadow: 0 0 30px rgba(240,237,232,1), 0 0 60px rgba(240,237,232,0.7), 0 0 90px rgba(240,237,232,0.5);
          }
        }
        @keyframes goldTaglineGlow {
          0%, 100% {
            textShadow: 0 0 15px rgba(201,168,76,0.7), 0 0 30px rgba(201,168,76,0.5);
          }
          50% {
            textShadow: 0 0 25px rgba(201,168,76,0.9), 0 0 50px rgba(201,168,76,0.7);
          }
        }
        @keyframes lineGlow {
          0%, 100% {
            boxShadow: 0 0 25px rgba(201,168,76,0.9), 0 0 50px rgba(201,168,76,0.6), 0 0 75px rgba(201,168,76,0.3);
          }
          50% {
            boxShadow: 0 0 35px rgba(201,168,76,1), 0 0 70px rgba(201,168,76,0.8), 0 0 105px rgba(201,168,76,0.5);
          }
        }
      `}</style>
    </div>
  );
}

/* ══ SITE CHROME (settings-driven floating widgets) ══ */
function SiteChrome() {
  const { settings } = useSiteSettings();
  return (
    <>
      <AnnouncementBar />
      {settings.aiAssistantEnabled !== false && <AIAssistant />}
      <WhatsAppButton phoneNumber={settings.whatsapp || '+201050933078'} />
    </>
  );
}

/* ══ ANIMATED ROUTES ══ */
function AnimatedRoutes() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  // Check if current route is admin route
  // Anchored: a bare startsWith('/admin') also matched '/adminxyz' and
  // suppressed the entire public chrome on unrelated paths.
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  // Particle/dust effects only for capable pointers, and never under reduced motion
  const showPointerEffects = !reducedMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <>
      {/* Global premium effects - smooth scroll, scroll reset, cinematic grain */}
      <LenisSmoothScroll />
      <ScrollToTop />
      <FilmGrain />

      {/* Custom Cursor - works everywhere */}
      <CustomCursor />

      {/* Subtle gold particles behind cursor (- fine pointers only) */}
      {showPointerEffects && <ParticleTrail color="#C9A84C" particleCount={2} />}

      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Public site components - only render if NOT on admin route */}
      {!isAdminRoute && (
        <>
          <ScrollProgressBar />
          <Navbar />
          <CartSidebar />
          <Toast />
          <ThemeToggle />
          <CookieConsent />
          <SiteChrome />
        </>
      )}

      {/* Global Components for all routes */}
      <MotionConfig reducedMotion="user">
      {/*
        Route frame. The <motion.main> below is keyed by pathname and is the
        DIRECT child of AnimatePresence — that is what makes exit animations
        actually run. (Wrapping an unkeyed <Routes> in a plain <main> left
        AnimatePresence inert and 21 of 23 routes with no transition at all.)
        The footer sits outside the transitioning region so it never fades with
        a page, and the frame's flex column pins it to the bottom of short pages.
      */}
      <div className="site-frame">
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            className="site-main"
            id="main-content"
            role="main"
            aria-label="Main content"
            variants={routeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
            {/* Public Routes - Critical path (no lazy loading) */}
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/car/:id" element={<CarDetails />} />

            {/* Auth Routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Non-critical routes - Lazy loaded */}
            <Route path="/compare" element={
              <LazyLoadWrapper fallbackMessage="Loading Comparison Tool...">
                <Compare />
              </LazyLoadWrapper>
            } />
            <Route path="/favorites" element={
              <LazyLoadWrapper fallbackMessage="Loading Favorites...">
                <Favorites />
              </LazyLoadWrapper>
            } />
            <Route path="/configurator" element={
              <LazyLoadWrapper fallbackMessage="Loading Configurator...">
                <Configurator />
              </LazyLoadWrapper>
            } />
            <Route path="/configurator/:id" element={
              <LazyLoadWrapper fallbackMessage="Loading Configurator...">
                <Configurator />
              </LazyLoadWrapper>
            } />
            <Route path="/checkout" element={
              <LazyLoadWrapper fallbackMessage="Loading Checkout...">
                <CheckoutPage />
              </LazyLoadWrapper>
            } />
            <Route path="/loyalty" element={
              <LazyLoadWrapper fallbackMessage="Loading Loyalty Program...">
                <LoyaltyPage />
              </LazyLoadWrapper>
            } />

            {/* User & informational pages */}
            <Route path="/dashboard" element={
              <LazyLoadWrapper fallbackMessage="Loading Showroom...">
                <Dashboard />
              </LazyLoadWrapper>
            } />
            <Route path="/orders" element={
              <LazyLoadWrapper fallbackMessage="Loading Orders...">
                <Orders />
              </LazyLoadWrapper>
            } />
            <Route path="/contact" element={
              <LazyLoadWrapper fallbackMessage="Loading Contact...">
                <Contact />
              </LazyLoadWrapper>
            } />
            <Route path="/privacy-policy" element={
              <LazyLoadWrapper fallbackMessage="Loading Privacy Policy...">
                <PrivacyPolicy />
              </LazyLoadWrapper>
            } />
            <Route path="/terms-of-service" element={
              <LazyLoadWrapper fallbackMessage="Loading Terms of Service...">
                <TermsOfService />
              </LazyLoadWrapper>
            } />

            {/* Admin Routes - Heavy components, lazy loaded */}
            <Route path="/admin/login" element={
              <LazyLoadWrapper fallbackMessage="Loading Admin Portal...">
                <AdminLogin />
              </LazyLoadWrapper>
            } />
            <Route path="/admin/dashboard" element={
              <LazyLoadWrapper fallbackMessage="Loading Dashboard...">
                <AdminDashboard />
              </LazyLoadWrapper>
            } />
            <Route path="/admin/cars" element={
              <LazyLoadWrapper fallbackMessage="Loading Admin Cars...">
                <AdminCars />
              </LazyLoadWrapper>
            } />
            <Route path="/admin/orders" element={
              <LazyLoadWrapper fallbackMessage="Loading Orders...">
                <AdminOrders />
              </LazyLoadWrapper>
            } />
            <Route path="/admin/users" element={
              <LazyLoadWrapper fallbackMessage="Loading Users...">
                <AdminUsers />
              </LazyLoadWrapper>
            } />
            <Route path="/admin/settings" element={
              <LazyLoadWrapper fallbackMessage="Loading Settings...">
                <AdminSettings />
              </LazyLoadWrapper>
            } />

            {/* 404 - Fallback for any unknown route */}
            <Route path="*" element={
              <LazyLoadWrapper fallbackMessage="Loading...">
                <NotFound />
              </LazyLoadWrapper>
            } />
          </Routes>
          </motion.main>
        </AnimatePresence>

        {/* Public footer — mounted once here instead of inside Home, so all 12
            other public pages get one. Admin pages have their own in AdminLayout. */}
        {!isAdminRoute && <Footer />}
      </div>
      </MotionConfig>
    </>
  );
}

/* ══ APP ══ */
export default function App() {
  const [splash, setSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('1m_splash_seen');
    } catch {
      return true;
    }
  });
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome message after splash screen
    if (!splash) {
      setTimeout(() => {
        setShowWelcome(true);
        // Auto hide after 10 seconds
        setTimeout(() => {
          setShowWelcome(false);
        }, 10000);
      }, 300);
    }
  }, [splash]);

  return (
    <ReducedMotionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
<AppProvider>
            <SiteSettingsProvider>
              {splash && <SplashScreen onDone={() => {
                try { sessionStorage.setItem('1m_splash_seen', '1'); } catch { /* ignore */ }
                setSplash(false);
              }} />}
              {showWelcome && <WelcomeMessage onClose={() => setShowWelcome(false)} />}
              <Router>
                <AnimatedRoutes />
              </Router>
            </SiteSettingsProvider>
          </AppProvider>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ReducedMotionProvider>
  );
}

/* ══ WELCOME MESSAGE ══ */
function WelcomeMessage({ onClose }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    // Start exit animation after 9.5 seconds
    const timer = setTimeout(() => {
      setPhase('exit');
    }, 9500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 99998,
      maxWidth: 420,
      animation: phase === 'enter' ? 'slideInRight 0.6s cubic-bezier(0.22,1,0.36,1) both' :
                 phase === 'exit' ? 'slideOutRight 0.5s cubic-bezier(0.4,0,1,1) both' : 'none',
    }}>
      {/* Notification Box */}
      <div style={{
        position: 'relative',
        padding: '32px 28px',
        background: 'linear-gradient(135deg, rgba(17,17,23,0.98) 0%, rgba(25,25,33,0.98) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(201,168,76,0.4)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}>
        {/* Gold accent line top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(to right, var(--gold), #E0C06A, var(--gold))',
          boxShadow: '0 0 15px rgba(201,168,76,0.6)',
        }}/>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.3)',
            background: 'rgba(17,17,23,0.6)',
            color: 'var(--gold)',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.2)';
            e.currentTarget.style.border = '1px solid rgba(201,168,76,0.6)';
            e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(17,17,23,0.6)';
            e.currentTarget.style.border = '1px solid rgba(201,168,76,0.3)';
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
        >×</button>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon & Welcome text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
            animation: 'fadeInUp 0.5s ease-out 0.2s both',
          }}>
            <div style={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: 20,
              fontWeight: 900,
              color: '#000',
              boxShadow: '0 6px 24px rgba(201,168,76,0.5)',
              flexShrink: 0,
            }}>
              <Brand1M style={{ fontSize: 20, fontWeight: 900, color: '#000' }} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 4,
              }}>
                Welcome to 1M Motors
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                color: 'rgba(240,237,232,0.6)',
                fontStyle: 'italic',
              }}>
                Exclusive Automotive Experience
              </div>
            </div>
          </div>

          {/* Main message */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 300,
            color: 'rgba(240,237,232,0.85)',
            lineHeight: 1.5,
            marginBottom: 20,
            animation: 'fadeInUp 0.5s ease-out 0.4s both',
          }}>
            This premium platform is brought to you by:
          </div>

          {/* Names container */}
          <div style={{
            background: 'rgba(201,168,76,0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(201,168,76,0.15)',
            marginBottom: 16,
            animation: 'fadeInScale 0.6s ease-out 0.6s both',
          }}>
            {/* Name */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #F4D03F 0%, #E0C06A 50%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px',
              lineHeight: 1.3,
            }}>
              YOUSSEF ALI
              <div style={{
                width: '60px',
                height: '2px',
                background: 'linear-gradient(to right, transparent, #F4D03F, #E0C06A, #C9A84C, transparent)',
                margin: '12px auto',
                opacity: 0.8,
              }}/>
              MOSTAFA ABDELHAMEED
            </div>
          </div>

          {/* Bottom text with icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'var(--font-ui)',
            fontSize: 10,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.6)',
            animation: 'fadeIn 0.5s ease-out 0.8s both',
          }}>
            <SparklesIcon size={14} />
            <span>Experience Excellence</span>
            <SparklesIcon size={14} />
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(201,168,76,0.1)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            background: 'linear-gradient(to right, var(--gold), #E0C06A)',
            transformOrigin: 'left',
            animation: 'progressBar 10s linear forwards',
            boxShadow: '0 0 10px rgba(201,168,76,0.6)',
          }}/>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes progressBar {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        @media (max-width: 768px) {
          /* Mobile responsive */
        }
      `}</style>
    </div>
  );
}