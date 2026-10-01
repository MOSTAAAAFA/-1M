import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Brand1M from './Brand1M';
import Crest1M from './Crest1M';
import SearchBar from './SearchBar';
import API_BASE from '../utils/api';
import { useSiteSettings } from '../context/SiteSettingsContext';
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
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { settings } = useSiteSettings();

  // Parallax effect for navbar based on scroll
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);
  const logoOpacity = useTransform(scrollY, [0, 50], [1, 0.95]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    } catch {
      setUser(null);
    }
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      /* ignore */
    }
    localStorage.removeItem('user');
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';
  const solid = scrolled || !isHome;

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="site-nav"
      data-solid={solid ? 'true' : 'false'}
      style={{
        // Layout + the solid/transparent border edge only. The glass material
        // lives in cinematic.css (.site-nav[data-solid='true']) so it shares
        // one token with the footer and can degrade in @supports instead of
        // needing a JS branch here.
        position: 'fixed',
        top: 'var(--announce-offset, 0px)',
        left: 0, right: 0,
        zIndex: 900,
        height: 'var(--nav-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
        transition: 'background 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s cubic-bezier(0.22,1,0.36,1), backdrop-filter 0.4s ease',
        borderBottom: solid ? '1px solid rgba(201,168,76,0.22)' : '1px solid transparent',
        boxShadow: solid
          ? '0 10px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(201,168,76,0.18), inset 0 -1px 0 rgba(201,168,76,0.08)'
          : 'none',
      }}
      >
        <div style={{
          width: '100%',
          maxWidth: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <motion.div
              style={{ scale: logoScale, opacity: logoOpacity }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LogoMark scrolled={scrolled} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
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
              }}
            >
              <Brand1M name={settings.siteName} style={{
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
              }}>{settings.siteSuffix || 'MOTORS'}</span>
            </motion.span>
          </Link>

          {/* ── Desktop links ── */}
          <motion.div
            className="nav-links"
            style={{ display: 'flex', gap: spacing['4xl'], alignItems: 'center' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, staggerChildren: 0.1 }}
          >
            {NAV_LINKS.map(({ label, to }, index) => {
              const active = location.pathname === to;
              return (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <Link to={to} style={{
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
                      <motion.span
                        layoutId="activeNav"
                        style={{
                          position: 'absolute',
                          bottom: -2, left: 0, right: 0,
                          height: 2,
                          background: `linear-gradient(90deg, ${colors.gold}, ${colors.goldLight})`,
                          borderRadius: '2px 2px 0 0',
                          boxShadow: `0 0 8px ${colors.goldGlow}`,
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Search ── */}
          <motion.div
            className="nav-search"
            style={{ display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <SearchBar />
          </motion.div>

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
            {user ? (
              <div style={{ position: 'relative' }}>
                {/* Gmail-style profile circle */}
                <button
                  type="button"
                  onClick={() => setProfileOpen(o => !o)}
                  aria-label={`Account menu for ${user.name || user.email || 'member'}`}
                  aria-expanded={profileOpen}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.full,
                    background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
                    border: solid ? '2px solid rgba(5,5,7,0.92)' : '2px solid rgba(244,208,63,0.6)',
                    color: colors.black,
                    fontFamily: typography.fontDisplay,
                    fontSize: 16,
                    fontWeight: typography.fontWeight.black,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: `0 4px 16px ${colors.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
                    transition: transitions.default,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = `0 6px 24px ${colors.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.5)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = `0 4px 16px ${colors.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.4)`;
                  }}
                >
                  {getInitials(user)}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setProfileOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 940 }}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.19, 1, 0.22, 1] }}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 12px)',
                          right: 0,
                          width: 264,
                          background: 'rgba(14,14,20,0.98)',
                          border: `1px solid ${colors.goldDim}`,
                          borderRadius: 16,
                          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 24px rgba(201,168,76,0.12)',
                          backdropFilter: 'blur(20px)',
                          overflow: 'hidden',
                          zIndex: 950,
                        }}
                      >
                        <div style={{
                          padding: '18px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}>
                          <div style={{
                            fontFamily: typography.fontDisplay,
                            fontSize: 15,
                            fontWeight: typography.fontWeight.bold,
                            color: colors.white,
                            marginBottom: 4,
                          }}>
                            {user.name || 'Member'}
                          </div>
                          <div style={{
                            fontFamily: typography.fontUI,
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.5)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {user.email}
                          </div>
                        </div>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} style={dropdownItemStyle}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; e.currentTarget.style.color = colors.gold; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}>
                          <ProfileIcon type="dashboard" />
                          My Dashboard
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)} style={dropdownItemStyle}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; e.currentTarget.style.color = colors.gold; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}>
                          <ProfileIcon type="orders" />
                          My Orders
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          style={{ ...dropdownItemStyle, width: '100%', background: 'transparent', border: 'none', textAlign: 'left', color: '#ef4444', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <ProfileIcon type="logout" />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
            <>
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
                borderRadius: radius.full,
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
                borderRadius: radius.full,
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
            </>
            )}
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
                borderRadius: radius.full,
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
                borderRadius: radius.full,
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
      </motion.nav>

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
  return (
    <div style={{ position: 'relative', width: 40, height: 40 }}>
      {/* Soft ambient glow — brighter over the transparent hero */}
      <div style={{
        position: 'absolute',
        inset: -7,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.45) 0%, rgba(201,168,76,0.12) 55%, transparent 72%)',
        opacity: scrolled ? 0.6 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
      }} />
      <Crest1M size={40} />
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

function getInitials(u) {
  const source = String(u?.name || u?.email || 'M').trim();
  const letters = source.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return letters || 'M';
}

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '13px 20px',
  fontFamily: typography.fontUI,
  fontSize: 13,
  fontWeight: typography.fontWeight.semibold,
  letterSpacing: '0.5px',
  color: 'rgba(255,255,255,0.85)',
  textDecoration: 'none',
  transition: transitions.default,
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};

function ProfileIcon({ type }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    orders: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  };
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}
