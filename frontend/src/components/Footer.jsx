// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS — GLOBAL SITE FOOTER
//
// Was a private component inside pages/Home.jsx, which meant 12 other public
// pages (/cars, /car/:id, /configurator, /compare, /contact, …) shipped no
// footer at all. Extracted here and mounted once in the route frame.
//
// Design notes:
// - <nav aria-label="Footer"> gives the link groups a real landmark so screen
//   readers can jump straight past the marketing block.
// - Links use .link-underline (CSS) instead of onMouseEnter style mutation, so
//   they get an identical treatment on :focus-visible, not just :hover.
// - Data font (--font-data) is used for phone/email/address so contact details
//   scan as a row of aligned figures rather than prose.
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import Brand1M from './Brand1M';
import Crest1M from './Crest1M';

const EXPLORE = [
  ['Collection', '/cars'],
  ['Configurator', '/configurator'],
  ['Compare', '/compare'],
  ['Favorites', '/favorites'],
  ['Loyalty', '/loyalty'],
];

const COMPANY = [
  ['Contact', '/contact'],
  ['Privacy Policy', '/privacy-policy'],
  ['Terms of Service', '/terms-of-service'],
];

const labelStyle = {
  fontFamily: 'var(--font-ui)',
  fontSize: 10,
  letterSpacing: '2.4px',
  textTransform: 'uppercase',
  color: 'var(--white-30)',
  marginBottom: 14,
};

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer
      className="site-footer"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Hairline of gold light across the top edge — reads as a light source
          above the footer rather than a 1px border. */}
      <div className="footer-lightline" aria-hidden="true" />

      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-wordmark">
              <Crest1M size={28} />
              <span className="footer-wordmark-text">
                <Brand1M
                  name={settings.siteName}
                  style={{ fontSize: 28, fontWeight: 600 }}
                />
                <span>{settings.siteSuffix || 'MOTORS'}</span>
              </span>
            </p>

            <p className="footer-description">
              {settings.footerDescription ||
                "The world's most exclusive automotive experience."}
            </p>

            <p className="footer-tagline">
              {settings.tagline || 'For the few who command the road.'}
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <div className="footer-col">
              <p style={labelStyle}>Explore</p>
              <ul className="footer-list">
                {EXPLORE.map(([label, to]) => (
                  <li key={to}>
                    <Link className="link-underline" to={to}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <p style={labelStyle}>Company</p>
              <ul className="footer-list">
                {COMPANY.map(([label, to]) => (
                  <li key={to}>
                    <Link className="link-underline" to={to}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <p style={labelStyle}>Private Client</p>
              <ul className="footer-list footer-list-data">
                {settings.phone && (
                  <li>
                    <a className="link-underline" href={`tel:${settings.phone.replace(/\s+/g, '')}`}>
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li>
                    <a className="link-underline" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.address && <li className="footer-address">{settings.address}</li>}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            {settings.copyright || '© 2026 1M Motors. All rights reserved.'}
          </p>
          <p className="footer-motto">
            {settings.tagline || 'PRIVATE COLLECTION · BY APPOINTMENT'}
          </p>
        </div>
      </div>
    </footer>
  );
}