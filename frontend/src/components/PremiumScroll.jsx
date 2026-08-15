import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global premium scroll FX kit.
 * - Reveal: fade/slide/blur element into view (IntersectionObserver + GSAP)
 * - ParallaxBg: parallax background image layer
 * - HorizontalGallery: pinned horizontal scroll section
 */

const isTouch = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

export function usePremiumScrollFX() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [motionOK, setMotionOK] = useState(!prefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setMotionOK(!e.matches);
    setMotionOK(!mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    };
  }, []);

  return { motionOK, isTouch: isTouch() };
}

/* ── Reveal on scroll ── */
const REVEAL_VARIANTS = {
  up: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 } },
  down: { from: { opacity: 0, y: -60 }, to: { opacity: 1, y: 0 } },
  left: { from: { opacity: 0, x: -80 }, to: { opacity: 1, x: 0 } },
  right: { from: { opacity: 0, x: 80 }, to: { opacity: 1, x: 0 } },
  zoom: { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } },
  blur: { from: { opacity: 0, y: 40, filter: 'blur(12px)' }, to: { opacity: 1, y: 0, filter: 'blur(0px)' } },
};

export function ScrollRevealFX({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.9,
  stagger = 0,
  once = true,
  amount = 0.2,
  className,
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const { motionOK } = usePremiumScrollFX();

  const base = REVEAL_VARIANTS[variant] || REVEAL_VARIANTS.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={motionOK ? base.from : false}
      animate={isInView || !motionOK ? base.to : base.from}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {stagger > 0
        ? React.Children.map(children, (child, i) =>
            React.cloneElement(child, {
              style: {
                ...(child.props.style || {}),
                transitionDelay: `${i * stagger}s`,
              },
            })
          )
        : children}
    </motion.div>
  );
}

/* ── Parallax background layer ── */
export function ParallaxBg({
  src,
  speed = 0.35,
  children,
  className,
  style = {},
  overlay = 'linear-gradient(to bottom, rgba(5,5,7,0.82), rgba(5,5,7,0.55))',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);
  const smoothY = useSpring(y, { stiffness: 90, damping: 25 });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {src && (
        <motion.div
          style={{
            position: 'absolute',
            inset: '-18% 0',
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: smoothY,
            scale,
            willChange: 'transform',
          }}
        />
      )}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: overlay,
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ── Pinned horizontal scroll gallery ── */
export function HorizontalGallery({
  title,
  subtitle,
  children,
  className,
  style = {},
}) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [enabled, setEnabled] = useState(true);
  const { motionOK } = usePremiumScrollFX();

  // Only enable pinning on desktop + motion OK
  useEffect(() => {
    setEnabled(motionOK && !isTouch() && window.innerWidth >= 1024);
  }, [motionOK]);

  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [enabled]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: enabled ? 0 : 80,
        paddingBottom: enabled ? 0 : 80,
        ...style,
      }}
    >
      {enabled && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '40px 0 24px',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 5,
              background: 'linear-gradient(to bottom, #050507, rgba(5,5,7,0))',
            }}
          >
            {title && (
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 58px)',
                fontWeight: 300,
                color: 'var(--white)',
                lineHeight: 1.1,
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ color: 'var(--white-40)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: 12, marginTop: 12 }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Scroll hint */}
          <div
            style={{
              position: 'absolute',
              right: 28,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              zIndex: 5,
              color: 'var(--gold)',
              pointerEvents: 'none',
            }}
          >
            <span style={{ writingMode: 'vertical-rl', letterSpacing: 4, fontSize: 10, textTransform: 'uppercase' }}>
              Scroll
            </span>
            <span style={{ fontSize: 18, animation: 'hGalleryArrow 1.6s ease-in-out infinite' }}>→</span>
          </div>
        </>
      )}

      {enabled ? (
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 28,
            padding: '0 8vw',
            willChange: 'transform',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          {children}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, padding: '0 4vw' }}>
          {children}
        </div>
      )}

      <style>{`
        @keyframes hGalleryArrow {
          0%, 100% { transform: translateX(0); opacity: 0.4; }
          50% { transform: translateX(8px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

export default usePremiumScrollFX;
