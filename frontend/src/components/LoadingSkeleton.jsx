import React from 'react';

/**
 * Loading skeletons for the catalogue.
 *
 * These mirror the real CarCard's geometry on purpose: if the placeholder is a
 * different height or aspect ratio than the content that replaces it, the page
 * jumps on load, which is a worse experience than a slower one. The numbers
 * below match car-card.css.
 */

const shimmerKeyframes = {
  '0%': { backgroundPosition: '200% 0' },
  '100%': { backgroundPosition: '-200% 0' },
};

const surface = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)',
  backgroundSize: '200% 100%',
  borderRadius: 4,
};

function Bar({ w = '100%', h = 12, mt, style }) {
  return <span style={{ display: 'block', width: w, height: h, marginTop: mt, ...surface, ...style }} />;
}

export function CarCardSkeleton() {
  return (
    <div
      className="car-card car-card--skeleton"
      aria-hidden="true"
      style={{ pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* 16/10, same as the real card's media box */}
      <div style={{ aspectRatio: '16 / 10', background: surface, borderRadius: 0 }} />
      <div style={{ padding: '20px' }}>
        <Bar w="38%" h={10} />
        <Bar h={18} mt={12} style={{ width: '78%' }} />
        <Bar w="46%" h={13} mt={10} />
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <Bar w="64%" h={38} style={{ borderRadius: 8, flex: 1 }} />
          <Bar w={38} h={38} style={{ borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

/**
 * @param {number} count - how many cards to show
 * @param {{label?: string}} [props] - announced to screen readers
 */
export function CarGridSkeleton({ count = 6, label = 'Loading vehicles' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
        gap: 28,
      }}
    >
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
        {label}…
      </span>
      {Array.from({ length: count }, (_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatSkeleton({ h = 48, w = '100%' }) {
  return <Bar h={h} w={w} style={{ borderRadius: 8 }} />;
}

export { shimmerKeyframes };
