import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll Orchestration Component
 * Choreographed scroll-driven animations with GSAP ScrollTrigger
 */

gsap.registerPlugin(ScrollTrigger);

export function ScrollRevealText({ children, className = '', delay = 0 }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const words = textRef.current.querySelectorAll('.word');

    gsap.from(words, {
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.08,
      duration: 0.9,
      ease: 'power4.out',
      delay,
    });
  }, [delay]);

  // Split text into words
  const splitText = React.useMemo(() => {
    if (typeof children !== 'string') return children;

    return children.split(' ').map((word, i) => (
      <span
        key={i}
        className="word"
        style={{
          display: 'inline-block',
          marginRight: '0.3em',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {word}
      </span>
    ));
  }, [children]);

  return (
    <div ref={textRef} className={className}>
      {splitText}
    </div>
  );
}

export function ScrollPinSection({ children, pinSpacing = true, id }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      pinSpacing,
      start: 'top top',
      end: '+=100%',
      scrub: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, [pinSpacing]);

  return (
    <section ref={sectionRef} id={id} style={{ position: 'relative' }}>
      {children}
    </section>
  );
}

export function ScrollFadeIn({ children, className = '', direction = 'up' }) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const directionMap = {
      up: { y: 80, x: 0 },
      down: { y: -80, x: 0 },
      left: { y: 0, x: 80 },
      right: { y: 0, x: -80 },
    };

    const from = directionMap[direction] || directionMap.up;

    gsap.from(elementRef.current, {
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 85%',
        end: 'top 60%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      ...from,
      duration: 1.2,
      ease: 'power4.out',
    });
  }, [direction]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

export function ScrollScaleIn({ children, className = '' }) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.from(elementRef.current, {
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      },
      scale: 0.8,
      opacity: 0,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

export function ParallaxImage({ src, alt, speed = 0.5, className = '' }) {
  const imageRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: `${speed * 100}%`,
      ease: 'none',
    });
  }, [speed]);

  return (
    <div className={className} style={{ overflow: 'hidden', position: 'relative' }}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

export function HorizontalScroll({ children, className = '' }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const sections = scrollRef.current.querySelectorAll('.h-scroll-section');
    const totalWidth = Array.from(sections).reduce((acc, section) => acc + section.offsetWidth, 0);

    gsap.to(scrollRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${totalWidth}`,
      },
      x: () => -(totalWidth - window.innerWidth),
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
