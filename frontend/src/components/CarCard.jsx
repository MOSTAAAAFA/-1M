// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS — CANONICAL CAR CARD
//
// This is the ONE card used for every car in the product: the home featured
// rail, the /cars catalogue grid, and /favorites. It replaces four parallel
// implementations (Cars.jsx inline CarCard, Home.jsx MiniCard, AnimatedCard,
// and pages/EnhancedCarCard.jsx which was written and never imported), which
// is why listings previously looked like four different products.
//
// Interaction model — the "stretched link":
//   The card is not itself a button. The title renders a real <Link> whose
//   ::after is stretched over the whole card, so the entire surface is
//   clickable and the link is properly focusable and announced as a link.
//   Nested controls (favorite, add to garage) sit above it via z-index and
//   stopPropagation. This keeps the markup valid — nesting <button> inside
//   <a> is invalid HTML and breaks keyboard/screen-reader behaviour.
//
// Motion budget:
//   - Tilt/spotlight use Framer motion values + springs (compositor only).
//   - Pointer tracking writes CSS custom properties straight to the DOM node
//     (--gx/--gy) so the glow follows the cursor with zero React re-renders.
//   - Both are gated on prefers-reduced-motion and on a fine pointer, and are
//     additionally neutralised by MotionConfig reducedMotion="user".
//   - On a grid of 60+ cars the layout animation is disabled (layout={false})
//     to avoid measuring every card on filter changes.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useRef, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import OptimizedImage from './OptimizedImage';
import { compactPrice } from '../utils/finance';

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ── Shared stat pill: label above value, the way a spec sheet reads ──────────
const SpecPill = ({ label, value, active }) => (
  <div className="car-spec" data-active={active || undefined}>
    <p className="car-spec-label">{label}</p>
    <p className="car-spec-value">{value}</p>
  </div>
);

function CarCard({ car, index = 0, priority = false }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(car.id);

  // Fine pointer + no reduced motion are required for tilt. Coarse pointers
  // (touch) would get a sticky tilt with no pointer to drive it back to centre.
  const canTilt = !reduced && typeof window !== 'undefined'
    ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
    : false;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], canTilt ? [4, -4] : [0, 0]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], canTilt ? [-4, 4] : [0, 0]), { stiffness: 150, damping: 20 });
  const lift = useSpring(hovered ? 1.015 : 1, { stiffness: 220, damping: 22 });

  // Pointer position is written to CSS vars on the node itself. No setState, so
  // moving across a card of 60 costs one style write per frame, not a render.
  const onMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el || !canTilt) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [canTilt, mx, my]);

  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => {
    setHovered(false);
    mx.set(0);
    my.set(0);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--gx', '50%');
      cardRef.current.style.setProperty('--gy', '50%');
    }
  }, [mx, my]);

  const specs = [
    { l: 'Power', v: car.specs?.horsepower || car.horsepower || '—' },
    { l: '0–60', v: car.specs?.acceleration || car.acceleration || '—' },
  ];

  return (
    <div className="car-card-perspective">
      <motion.article
        ref={cardRef}
        className="car-card"
        data-hovered={hovered || undefined}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, scale: lift, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Media ─────────────────────────────────────────────────── */}
        <div className="car-card-media">
          <OptimizedImage
            src={car.image}
            alt={`${car.brand} ${car.name} ${car.year}`}
            objectFit="cover"
            eager={priority}
            className="car-card-img"
          />

          {/* B2 · Rim light: a 1px bright edge along the top of the frame plus a
              specular sweep, so a flat press photo reads as studio-lit metal. */}
          <div className="car-card-rim" aria-hidden="true" />
          <div className="car-card-sweep" aria-hidden="true" />

          {/* Bottom scrim carries the badges' contrast without dimming the car */}
          <div className="car-card-scrim" aria-hidden="true" />

          {/* Pointer-tracked gold glare. mix-blend-mode: screen, GPU only. */}
          <div className="car-card-glare" aria-hidden="true" />

          {car.category && (
            <span className="car-card-badge">{car.category}</span>
          )}

          {!car.inStock && (
            <span className="car-card-badge car-card-badge--preorder">Pre-Order</span>
          )}

          <button
            className="car-card-fav"
            data-on={fav || undefined}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(car); }}
            aria-label={fav ? `Remove ${car.brand} ${car.name} from favorites` : `Add ${car.brand} ${car.name} to favorites`}
            aria-pressed={fav}
          >
            <HeartIcon filled={fav} />
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="car-card-body">
          <p className="car-card-brand">
            {car.brand}
            <span className="car-card-year">{car.year}</span>
          </p>

          {/* The stretched link: real anchor, real focus ring, whole card hit area */}
          <h3 className="car-card-title">
            <Link to={`/car/${car.id}`} className="car-card-link">
              {car.name}
            </Link>
          </h3>

          {car.tagline && <p className="car-card-tagline">{car.tagline}</p>}

          <div className="car-specs">
            {specs.map((s) => <SpecPill key={s.l} label={s.l} value={s.v} active={hovered} />)}
          </div>

          <div className="car-card-foot">
            <div>
              <p className="car-card-foot-label">From</p>
              <p className="car-card-price">{compactPrice(car.price)}</p>
            </div>
            <button
              className="car-card-cta"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(car); }}
            >
              Add to Garage
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default memo(CarCard);