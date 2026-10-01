import React from 'react';
import { Link } from 'react-router-dom';
import Crest1M from '../components/Crest1M';

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 60%), linear-gradient(180deg, #050507 0%, #0c0c10 100%)',
        color: 'var(--white, #F0EDE8)',
        textAlign: 'center',
        padding: '0 24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(to right, transparent, var(--gold, #C9A84C), #E0C06A, var(--gold, #C9A84C), transparent)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <span style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.55))' }} />
        <Crest1M size={56} />
        <span style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.55))' }} />
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display, Georgia, serif)',
          fontSize: 140,
          fontWeight: 300,
          lineHeight: 1,
          margin: 0,
          background: 'linear-gradient(135deg, var(--gold, #C9A84C), transparent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-ui, Inter, system-ui, sans-serif)',
          fontSize: 13,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'var(--white-40, rgba(255,255,255,0.4))',
          marginBottom: 26,
        }}
      >
        Page Not Found
      </p>
      <p
        style={{
          fontFamily: 'var(--font-display, Georgia, serif)',
          fontStyle: 'italic',
          fontSize: 28,
          color: 'rgba(240,237,232,0.85)',
          margin: 0,
          marginBottom: 12,
        }}
      >
        This road doesn&apos;t exist.
      </p>
      <p
        style={{
          color: 'var(--white-70, rgba(255,255,255,0.55))',
          maxWidth: 420,
          margin: 0,
          marginBottom: 44,
          fontSize: 15,
          lineHeight: 1.7,
        }}
      >
        One of our designers may have misplaced the key. Let&apos;s get you back on the asphalt.
      </p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-ui, Inter, system-ui, sans-serif)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: 'var(--black, #050507)',
            background: 'linear-gradient(135deg, var(--gold, #C9A84C) 0%, var(--gold-light, #E8CC7A) 100%)',
            padding: '16px 44px',
            borderRadius: 8,
            boxShadow: '0 8px 32px rgba(201,168,76,0.35)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,168,76,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.35)';
          }}
        >
          Back to Home
        </Link>
        <Link
          to="/cars"
          style={{
            fontFamily: 'var(--font-ui, Inter, system-ui, sans-serif)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: 'var(--gold, #C9A84C)',
            border: '1px solid rgba(201,168,76,0.45)',
            padding: '15px 44px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
            e.currentTarget.style.borderColor = '#E0C06A';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Browse the Collection →
        </Link>
      </div>
    </section>
  );
}