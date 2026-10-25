import React from 'react';

/**
 * BrandMarquee - Infinite scrolling brand strip
 * Pauses on hover, fade edges with mask-image
 */

const CONFIG = {
  brands: [
    'MERCEDES-AMG',
    'BENTLEY',
    'AUDI',
    'TESLA',
    'CHEVROLET',
    'PORSCHE',
    'FERRARI'
  ]
};

export default function BrandMarquee() {
  // Duplicate brands for seamless loop
  const allBrands = [...CONFIG.brands, ...CONFIG.brands];

  return (
    <section
      style={{
        position: 'relative',
        padding: '28px 0',
        background: 'rgba(11,10,8,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
      aria-label="Premium automotive brands"
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '72px',
          whiteSpace: 'nowrap',
          width: 'max-content',
          animation: 'marqueeScroll 40s linear infinite',
        }}
      >
        {allBrands.map((brand, i) => (
          <React.Fragment key={i}>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(240,237,232,0.7)',
                transition: 'color 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-gold-500)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(240,237,232,0.7)';
              }}
            >
              {brand}
            </span>
            {i < allBrands.length - 1 && (
              <svg
                width="6"
                height="6"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: 'rgba(201,168,76,0.6)', flexShrink: 0 }}
                aria-hidden="true"
              >
                <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
