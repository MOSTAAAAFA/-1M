import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Brand1M from './Brand1M';
import SearchBar from './SearchBar';
import { colors, spacing, radius, typography, shadows, transitions } from '../styles/designTokens';

const NAV_LINKS = [
  { label: 'Collection', to: '/cars' },
  { label: 'Compare', to: '/compare' },
  { label: 'Favorites', to: '/favorites' },
  { label: 'Configurator', to: '/configurator' },
];

export default function Navbar() {
  const { cartCount, compareList, favorites, setCartOpen } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isHome = location.pathname === '/';
  // On non-home pages (e.g. car details) the navbar keeps a solid glass
  // background at all times so text stays readable and looks professional.
  const solid = scrolled || !isHome;

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 900,
        height: scrolled ? 'calc(var(--nav-h) - 10px)' : 'var(--nav-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
        transition: `all 0.6s ${transitions.easeOut}`,
        background: solid ? 'rgba(5,5,7,0.88)' : 'transparent',
        backdropFilter: solid ? 'blur(20px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(20px) saturate(1.2)' : 'none',
        borderBottom: solid ? '1px solid rgba(201,168,76,0.22)' : '1px solid transparent',
        boxShadow: solid
          ? '0 10px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(201,168,76,0.18), inset 0 -1px 0 rgba(201,168,76,0.08)'
          : 'none',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <LogoMark scrolled={scrolled} />
            <span style={{
              fontFamily: typography.fontDisplay,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              letterSpacing: '1.5px',
              color: colors.white,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              textShadow: !solid ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
              transition: `all 0.6s ${transitions.easeOut}`,
            }}>
              <Brand1M style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: !solid ? `drop-shadow(0 2px 4px ${colors.goldGlow})` : 'none',
              }} />
              <span style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.white,
                transition: `color 0.6s ${transitions.easeOut}`,
              }}>MOTORS</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="nav-links" style={{ display: 'flex', gap: spacing['4xl'], alignItems: 'center' }}>
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} style={{
                  fontFamily: typography.fontUI,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: active ? colors.gold : colors.white70,
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: 3,
                  transition: `color ${transitions.duration.normal} ${transitions.easeOut}`,
                  textShadow: !solid && !active ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                }}>
                  {label}
                  {active && (
                    <span style={{
                      position: 'absolute',
                      bottom: -2, left: 0, right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, ${colors.gold}, ${colors.goldLight})`,
                      borderRadius: '2px 2px 0 0',
                      boxShadow: `0 0 8px ${colors.goldGlow}`,
                    }}/>
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Search ── */}
          <div className="nav-search" style={{ display: 'flex', alignItems: 'center' }}>
            <SearchBar />
          </div>

          {/* ── Actions ── */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            {/* Icons group */}
            <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginRight: spacing.lg }}>
              {/* Favorites count */}
              <Link to="/favorites"
                aria-label={`Favorites${favorites.length > 0 ? ` (${favorites.length} items)` : ''}`}
                style={{
                ...iconBtnStyle(solid),
                color: favorites.length > 0 ? colors.gold : colors.white60,
                background: favorites.length > 0
                  ? colors.goldDim
                  : colors.white10,
                border: favorites.length > 0
                  ? `1px solid ${colors.goldDim}`
                  : `1px solid ${colors.border}`,
              }}>
                <HeartIcon />
                {favorites.length > 0 && <Badge>{favorites.length}</Badge>}
              </Link>

              {/* Compare count */}
              <Link to="/compare"
                aria-label={`Compare vehicles${compareList.length > 0 ? ` (${compareList.length} items)` : ''}`}
                style={{
                ...iconBtnStyle(solid),
                color: compareList.length > 0 ? colors.gold : colors.white60,
                background: compareList.length > 0
                  ? colors.goldDim
                  : colors.white10,
                border: compareList.length > 0
                  ? `1px solid ${colors.goldDim}`
                  : `1px solid ${colors.border}`,
              }}>
                <CompareIcon />
                {compareList.length > 0 && <Badge>{compareList.length}</Badge>}
              </Link>
            </div>

            {/* Auth group */}
            <div className="nav-auth" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginRight: spacing.lg }}>
            {/* Login Button */}
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.xl}`,
                background: colors.white10,
                border: `1px solid ${colors.border2}`,
                borderRadius: radius.sm,
                color: colors.white,
                fontFamily: typography.fontUI,
                fontSize: 11,
                fontWeight: typography.fontWeight.semibold,
                letterSpacing: typography.letterSpacing.wider,
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: transitions.default,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = colors.white20;
                e.currentTarget.style.border = `1px solid ${colors.border3}`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = colors.white10;
                e.currentTarget.style.border = `1px solid ${colors.border2}`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              LOGIN
            </Link>

            {/* Sign Up Button */}
            <Link
              to="/register"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.xl}`,
                background: `linear-gradient(135deg, ${colors.goldDim}, ${colors.goldDim})`,
                border: `1px solid ${colors.goldDim}`,
                borderRadius: radius.sm,
                color: colors.gold,
                fontFamily: typography.fontUI,
                fontSize: 11,
                fontWeight: typography.fontWeight.bold,
                letterSpacing: typography.letterSpacing.wider,
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: transitions.default,
                boxShadow: `0 2px 12px ${colors.goldDim}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.goldGlow}, ${colors.goldGlow})`;
                e.currentTarget.style.border = `1px solid ${colors.goldGlow}`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${colors.goldGlow}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.goldDim}, ${colors.goldDim})`;
                e.currentTarget.style.border = `1px solid ${colors.goldDim}`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 12px ${colors.goldDim}`;
              }}
            >
              SIGN UP
            </Link>
            </div>

            {/* Cart */}
            <button
              type="button"
              className="nav-cart"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing['2xl']}`,
                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                border: 'none',
                borderRadius: radius.sm,
                color: colors.black,
                fontFamily: typography.fontUI,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                letterSpacing: typography.letterSpacing.widest,
                textTransform: 'uppercase',
                transition: transitions.default,
                position: 'relative',
                boxShadow: `0 4px 20px ${colors.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${colors.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.35)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${colors.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.25)`;
              }}
            >
              <CartIcon /> GARAGE
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8, right: -8,
                  width: 22, height: 22,
                  background: colors.black,
                  borderRadius: radius.full,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.black,
                  color: colors.gold,
                  fontFamily: typography.fontUI,
                  animation: 'pulse 1.8s infinite',
                  border: `2px solid ${colors.goldLight}`,
                  boxShadow: `0 2px 8px ${colors.goldGlow}`,
                }}>{cartCount}</span>
              )}
            </button>

            {/* Admin Button */}
            <Link
              className="nav-admin"
              to="/admin/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing.xl}`,
                background: colors.white10,
                border: `1px solid ${colors.border2}`,
                borderRadius: radius.sm,
                color: colors.white70,
                fontFamily: typography.fontUI,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                letterSpacing: typography.letterSpacing.widest,
                textTransform: 'uppercase',
                transition: transitions.default,
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = colors.white20;
                e.currentTarget.style.border = `1px solid ${colors.border3}`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.color = colors.gold;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = colors.white10;
                e.currentTarget.style.border = `1px solid ${colors.border2}`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.color = colors.white70;
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              ADMIN
            </Link>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                flexDirection: 'column',
                gap: spacing.sm,
                padding: spacing.xs,
                minWidth: 44,
                minHeight: 44,
              }}
              className="mobile-burger"
            >
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  width: 24,
                  height: 2.5,
                  background: colors.white,
                  borderRadius: radius.sm,
                  transition: transitions.default,
                  transform: mobileOpen
                    ? i === 0 ? 'rotate(45deg) translateY(8.5px)'
                    : i === 2 ? 'rotate(-45deg) translateY(-8.5px)'
                    : 'scaleX(0)'
                    : 'none',
                }}/>
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 850,
          background: 'rgba(5,5,7,0.98)',
          backdropFilter: 'blur(32px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing['5xl'],
          animation: 'fadeIn 0.4s both',
          borderTop: `1px solid ${colors.goldDim}`,
        }}>
          {NAV_LINKS.map(({ label, to }, i) => (
            <Link key={to} to={to} style={{
              fontFamily: typography.fontDisplay,
              fontSize: typography.fontSize['4xl'],
              fontWeight: typography.fontWeight.light,
              color: colors.white,
              textDecoration: 'none',
              letterSpacing: typography.letterSpacing.wide,
              transition: transitions.default,
              opacity: 0,
              animation: `fadeUp 0.5s ${i * 0.1}s ${transitions.easeOut} forwards`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = colors.gold;
              e.currentTarget.style.transform = 'translateX(12px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = colors.white;
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            >{label}</Link>
          ))}
          <Link to="/" style={{
            fontFamily: typography.fontDisplay,
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.light,
            color: colors.white,
            textDecoration: 'none',
            opacity: 0,
            animation: `fadeUp 0.5s ${NAV_LINKS.length * 0.1}s ${transitions.easeOut} forwards`,
          }}>Home</Link>
        </div>
      )}

      <style>{`
        .nav-links > a {
          position: relative;
        }
        .nav-links > a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s var(--ease-out);
          border-radius: 2px;
          box-shadow: 0 0 12px rgba(201,168,76,0.7), 0 0 24px rgba(201,168,76,0.3);
        }
        .nav-links > a:hover::after {
          transform: scaleX(1);
        }
        @media (max-width: 1100px) {
          .nav-links, .nav-search { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
        @media (max-width: 768px) {
          .nav-icons, .nav-auth { display: none !important; }
        }
        @media (max-width: 480px) {
          nav { padding: 0 16px !important; }
          nav span { font-size: 18px !important; }
          .nav-cart span:last-child {
            display: none;
          }
          .nav-admin span:last-child {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

const iconBtnStyle = (scrolled) => ({
  position: 'relative',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 44, height: 44,
  borderRadius: radius.full,
  textDecoration: 'none',
  transition: transitions.default,
  boxShadow: scrolled ? shadows.sm : 'none',
});

function Badge({ children }) {
  return (
    <span style={{
      position: 'absolute', top: -6, right: -6,
      width: 20, height: 20,
      background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
      borderRadius: radius.full,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.black,
      color: colors.black,
      fontFamily: typography.fontUI,
      border: `2px solid ${colors.black}`,
      boxShadow: `0 2px 6px ${colors.goldGlow}`,
    }}>{children}</span>
  );
}

function LogoMark({ scrolled }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: 48,
        height: 48,
      }}
    >
      {/* Electric sparks ring 1 - rotating fast */}
      <svg
        style={{
          position: 'absolute',
          inset: -12,
          width: 'calc(100% + 24px)',
          height: 'calc(100% + 24px)',
          pointerEvents: 'none',
          animation: 'electricRotate1 4s linear infinite',
        }}
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id="electricGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle
            key={i}
            cx={50 + 40 * Math.cos(angle * Math.PI / 180)}
            cy={50 + 40 * Math.sin(angle * Math.PI / 180)}
            r="1.5"
            fill="#F4D03F"
            filter="url(#electricGlow)"
            style={{
              animation: `sparkPulse 0.${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </svg>

      {/* Electric sparks ring 2 - rotating opposite */}
      <svg
        style={{
          position: 'absolute',
          inset: -8,
          width: 'calc(100% + 16px)',
          height: 'calc(100% + 16px)',
          pointerEvents: 'none',
          animation: 'electricRotate2 3s linear infinite reverse',
        }}
        viewBox="0 0 100 100"
      >
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
          <circle
            key={i}
            cx={50 + 35 * Math.cos(angle * Math.PI / 180)}
            cy={50 + 35 * Math.sin(angle * Math.PI / 180)}
            r="1.2"
            fill="#E0C06A"
            filter="url(#electricGlow)"
            style={{
              animation: `sparkPulse 0.${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </svg>

      {/* Lightning glow trail - moving around */}
      <div
        style={{
          position: 'absolute',
          inset: -10,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(244,208,63,0.8) 20deg, rgba(244,208,63,0.4) 40deg, transparent 60deg)',
          animation: 'lightningRotate 1.5s linear infinite',
          pointerEvents: 'none',
          filter: 'blur(8px)',
        }}
      />

      {/* Lightning glow trail 2 - moving opposite */}
      <div
        style={{
          position: 'absolute',
          inset: -10,
          borderRadius: '50%',
          background: 'conic-gradient(from 180deg, transparent 0deg, rgba(201,168,76,0.7) 25deg, rgba(201,168,76,0.3) 50deg, transparent 75deg)',
          animation: 'lightningRotate 2s linear infinite reverse',
          pointerEvents: 'none',
          filter: 'blur(6px)',
        }}
      />

      {/* Outer glow ring - pulsing */}
      <div
        style={{
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.5) 0%, rgba(201,168,76,0.15) 50%, transparent 70%)',
          animation: 'logoGlowPulse 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Electric arc flashes */}
      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'rgba(244,208,63,0.6)',
          borderRightColor: 'rgba(244,208,63,0.3)',
          animation: 'electricArc 0.8s linear infinite',
          pointerEvents: 'none',
          filter: 'blur(1px)',
        }}
      />

      {/* Main logo circle */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          fontWeight: 900,
          color: 'var(--black)',
          letterSpacing: '-0.5px',
          transition: 'all 0.5s var(--ease-out)',
          boxShadow: isHovered
            ? '0 8px 32px rgba(201,168,76,0.8), 0 0 60px rgba(244,208,63,0.7), 0 0 100px rgba(201,168,76,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
            : '0 4px 20px rgba(201,168,76,0.6), 0 0 40px rgba(244,208,63,0.4), 0 0 70px rgba(201,168,76,0.3), inset 0 2px 3px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.15)',
          transform: isHovered ? 'scale(1.12) rotate(8deg)' : 'scale(1) rotate(0deg)',
          border: '2px solid rgba(255,255,255,0.3)',
          animation: 'logoGlow 2.5s ease-in-out infinite',
        }}
      >
        <Brand1M />

        {/* Inner shine effect */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '50%',
            height: '50%',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 60%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'logoShine 3s ease-in-out infinite',
          }}
        />

        {/* Electric flash overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(244,208,63,0.3) 0%, transparent 50%)',
            animation: 'electricFlash 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      </div>

      <style>{`
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

        @keyframes electricRotate1 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes electricRotate2 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes sparkPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.8);
          }
        }

        @keyframes lightningRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes electricArc {
          0% {
            transform: rotate(0deg);
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.4;
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
      `}</style>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function CompareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}
