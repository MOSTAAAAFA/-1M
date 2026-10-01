// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS — GSAP SCROLL ANIMATIONS
// Cinema-grade scroll-triggered effects using GSAP ScrollTrigger
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Hook: Fade up reveal on scroll ──
export function useGSAPFadeUp(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: options.y ?? 60, scale: options.scale ?? 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: options.duration ?? 0.9,
          delay: options.delay ?? 0,
          ease: options.ease ?? 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 88%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// ── Hook: Staggered children reveal ──
export function useGSAPStagger(selector = '.stagger-child', options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const children = container.querySelectorAll(selector);
      if (!children.length) return;

      gsap.fromTo(children,
        { opacity: 0, y: options.y ?? 40 },
        {
          opacity: 1, y: 0,
          duration: options.duration ?? 0.75,
          stagger: options.stagger ?? 0.12,
          ease: options.ease ?? 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: options.start ?? 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [selector]);

  return ref;
}

// ── Hook: Scrub parallax (moves with scroll) ──
export function useGSAPParallax(strength = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: strength * -100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, el);

    return () => ctx.revert();
  }, [strength]);

  return ref;
}

// ── Hook: Clip-path reveal (curtain draw) ──
export function useGSAPClipReveal(direction = 'left') {
  const ref = useRef(null);

  const clipMap = {
    left:   { from: 'inset(0 100% 0 0)',   to: 'inset(0 0% 0 0)' },
    right:  { from: 'inset(0 0% 0 100%)',  to: 'inset(0 0% 0 0)' },
    top:    { from: 'inset(0 0 100% 0)',   to: 'inset(0 0 0% 0)' },
    bottom: { from: 'inset(100% 0 0 0)',   to: 'inset(0% 0 0 0)' },
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const clip = clipMap[direction] || clipMap.left;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { clipPath: clip.from, opacity: 0.4 },
        {
          clipPath: clip.to, opacity: 1,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [direction]);

  return ref;
}

// ── Hook: Count up numbers ──
export function useGSAPCountUp(target, options = {}) {
  const ref = useRef(null);
  const countRef = useRef({ val: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof target !== 'number') return;

    const ctx = gsap.context(() => {
      gsap.to(countRef.current, {
        val: target,
        duration: options.duration ?? 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate() {
          const formatted = options.format
            ? options.format(countRef.current.val)
            : Math.round(countRef.current.val).toLocaleString();
          if (el) el.textContent = (options.prefix ?? '') + formatted + (options.suffix ?? '');
        }
      });
    }, el);

    return () => ctx.revert();
  }, [target]);

  return ref;
}

// ── Hook: Horizontal scrub (pinned section) ──
export function useGSAPHorizontalScroll(itemsCount = 4) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Only on desktop
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - container.offsetWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.2,
          end: () => `+=${totalWidth * 1.2}`,
          invalidateOnRefresh: true,
        }
      });
    }, container);

    return () => ctx.revert();
  }, [itemsCount]);

  return { trackRef, containerRef };
}

// ── Hook: Text split character-by-character reveal ──
export function useGSAPTextReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const text = el.textContent || '';
    el.innerHTML = text
      .split('')
      .map(ch => ch === ' '
        ? '<span style="display:inline-block">&nbsp;</span>'
        : `<span style="display:inline-block;overflow:hidden"><span style="display:inline-block">${ch}</span></span>`
      )
      .join('');

    const innerSpans = el.querySelectorAll('span > span');

    const ctx = gsap.context(() => {
      gsap.fromTo(innerSpans,
        { y: '105%' },
        {
          y: '0%',
          duration: 0.8,
          stagger: 0.025,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
