import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ServiceCards - Premium service features section
 * 4 cards with neutral smoked glass, solid gold figures, scroll fade-up
 */

const CONFIG = {
  eyebrow: 'THE 1M EXPERIENCE',
  cards: [
    {
      figure: '18hrs',
      title: 'Private Delivery',
      description: 'Direct to your doorstep, anywhere in the nation',
      icon: 'truck'
    },
    {
      figure: '5 Years',
      title: 'Manufacturer Warranty',
      description: 'Full powertrain & factory coverage included',
      icon: 'shield'
    },
    {
      figure: '24/7',
      title: 'VIP Concierge',
      description: 'Personal advisor for every need',
      icon: 'headset'
    },
    {
      figure: 'Exclusive',
      title: 'Private Test Drive',
      description: 'Experience at your preferred location',
      icon: 'steering'
    }
  ]
};

export default function ServiceCards() {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref]);

  return (
    <section
      ref={setRef}
      style={{
        position: 'relative',
        padding: '96px 0',
        background: '#0b0a08',
        overflow: 'hidden',
      }}
      aria-label="Premium services"
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Section Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '64px',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, var(--color-gold-500))',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-500)',
              fontWeight: 600,
            }}
          >
            {CONFIG.eyebrow}
          </span>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(to left, transparent, var(--color-gold-500))',
            }}
          />
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
          }}
        >
          {CONFIG.cards.map((card, i) => (
            <ServiceCard
              key={i}
              card={card}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section[aria-label="Premium services"] > div > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          section[aria-label="Premium services"] {
            padding: 64px 0 !important;
          }

          section[aria-label="Premium services"] > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* Individual Service Card */
function ServiceCard({ card, index, inView }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      style={{
        position: 'relative',
        padding: '28px',
        borderRadius: '16px',
        background: 'rgba(12,10,8,0.62)',
        backdropFilter: 'blur(18px) saturate(120%)',
        WebkitBackdropFilter: 'blur(18px) saturate(120%)',
        border: isHovered
          ? '1px solid rgba(201,168,76,0.8)'
          : '1px solid rgba(201,168,76,0.35)',
        boxShadow: isHovered
          ? '0 0 30px rgba(201,168,76,0.12), inset 0 1px 0 rgba(255,255,255,0.06)'
          : 'inset 0 1px 0 rgba(255,255,255,0.06)',
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'translateY(0)'
          : 'translateY(24px)',
        transition: `all 0.8s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s,
                     border-color 0.3s ease,
                     box-shadow 0.3s ease,
                     transform 0.3s ease`,
        cursor: 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gold Hairline */}
      <div
        style={{
          width: '40px',
          height: '2px',
          background: 'linear-gradient(to right, var(--color-gold-500), var(--color-gold-300))',
          marginBottom: '20px',
        }}
      />

      {/* Icon (optional - placeholder) */}
      {card.icon && (
        <div
          style={{
            width: '22px',
            height: '22px',
            marginBottom: '16px',
            color: 'var(--color-gold-500)',
          }}
        >
          <IconComponent type={card.icon} />
        </div>
      )}

      {/* Figure (SOLID GOLD, NO OUTLINE) */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 3.2vw, 52px)',
          fontWeight: 500,
          color: 'var(--color-gold-500)',
          marginBottom: '12px',
          lineHeight: 1,
        }}
      >
        {card.figure}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '19px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: 'rgba(255,255,255,1)',
          marginBottom: '10px',
          lineHeight: 1.3,
        }}
      >
        {card.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14.5px',
          lineHeight: 1.6,
          color: 'rgba(240,237,232,0.8)',
          margin: 0,
        }}
      >
        {card.description}
      </p>

      {/* Hover lift effect */}
      <div
        style={{
          transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
        }}
      />
    </article>
  );
}

/* Simple Icon Component (22px SVGs) */
function IconComponent({ type }) {
  const icons = {
    truck: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    shield: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    headset: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    steering: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v4M12 18v4M22 12h-4M6 12H2" />
      </svg>
    )
  };

  return icons[type] || null;
}
