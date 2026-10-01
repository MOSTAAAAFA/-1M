import React from 'react';

let crestUid = 0;

/**
 * Crest1M — 1M MOTORS signature gold emblem.
 * Hand-crafted heraldic-style SVG crest: double hairline rings, compass dots,
 * a gradient monogram disc bearing "1M" and an engraved "MOTORS" wordmark.
 * Pure static SVG so it stays crisp at any size and costs nothing at runtime.
 *
 * `spin` rotates the outer orbit — the dashed ring plus the eight compass dots
 * — while the monogram disc and the text inside it stay put. Only the orbit
 * moves, because that is the only part with any directional detail to read as
 * rotation; spinning the whole crest would make the "1M" itself spin, and a
 * rotating wordmark is just a wobble. The animation is a CSS transform (see
 * crest1m.css) so it is GPU-composited and stops under reduced-motion.
 */
export default function Crest1M({ size = 48, className, style, spin = true, ...props }) {
  const uid = `c1m-${++crestUid}`;
  const discGrad = `${uid}-disc`;
  const ringGrad = `${uid}-ring`;
  const DOTS = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={[className, spin ? 'crest1m--spin' : null].filter(Boolean).join(' ') || undefined}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      {...props}
    >
      <defs>
        <linearGradient id={discGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="50%" stopColor="#E0C06A" />
          <stop offset="100%" stopColor="#F4D03F" />
        </linearGradient>
        <linearGradient id={ringGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8E6D2F" />
          <stop offset="45%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E0C06A" />
        </linearGradient>
      </defs>

      {/* outer hairline ring */}
      <circle cx="48" cy="48" r="46" stroke={`url(#${ringGrad})`} strokeWidth="1.4" />

      {/* The orbit: dashed ring + compass dots, rotating as one. Wrapped in a
          group so the transform applies to both without duplicating the
          animation, and so the monogram below can stay upright. */}
      <g className="crest1m__orbit">
        {/* fine dashed inner ring */}
        <circle cx="48" cy="48" r="42.5" stroke="#C9A84C" strokeWidth="0.7" strokeDasharray="2 2.5" opacity="0.65" />

        {/* compass dots */}
        {DOTS.map((a) => {
          const rad = (a * Math.PI) / 180;
          const cx = 48 + 44.2 * Math.cos(rad);
          const cy = 48 + 44.2 * Math.sin(rad);
          return <circle key={a} cx={cx} cy={cy} r="1.4" fill="#E0C06A" opacity="0.9" />;
        })}
      </g>

      {/* monogram disc */}
      <circle cx="48" cy="48" r="32.5" fill={`url(#${discGrad})`} />
      <circle cx="48" cy="48" r="30.8" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
      <circle cx="48" cy="48" r="27.5" stroke="rgba(20,16,10,0.35)" strokeWidth="0.8" />
      <circle cx="48" cy="48" r="26.6" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />

      {/* monogram */}
      <text
        x="48" y="48" textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="34" fontWeight="700" letterSpacing="-1"
        fill="#171009"
      >
        1M
      </text>
    </svg>
  );
}