import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from '../context/ReducedMotionContext.jsx';

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className,
  style = {},
  onComplete,
  children,
}) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasStarted = useRef(false);
  const rafRef = useRef(0);
  const reducedMotion = useReducedMotion();

  // Format is pure, so memoise it: it runs on every animation frame and
  // re-deriving a regex split 60x/second is pure waste.
  const formatNumber = useCallback(
    (num) => {
      const fixed = num.toFixed(decimals);
      const parts = fixed.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return parts.join('.');
    },
    [decimals, separator]
  );

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    // Reduced motion: land on the final value immediately. Counting up from
    // zero is exactly the kind of gratuitous movement the preference exists
    // to suppress, and for large figures it also means the number is wrong
    // for the whole 2s.
    if (reducedMotion) {
      setCount(to);
      onComplete?.();
      return;
    }

    let cancelled = false;
    const startTime = performance.now();
    const totalChange = to - from;

    const animate = (now) => {
      // Guard against a setState after unmount, and against a slow first
      // frame producing a negative progress.
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(Math.max(elapsed / duration, 0), 1);

      // easeOutCubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(from + totalChange * easeOut);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Snap to the exact target; the eased value can land a hair under.
        setCount(to);
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [isInView, from, to, duration, reducedMotion, onComplete]);

  // A render-prop child lets callers format the number themselves.
  const display = children ? children(count) : `${prefix}${formatNumber(count)}${suffix}`;

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}

export function CurrencyCounter({ amount, currency = 'USD', ...props }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <AnimatedCounter
      to={amount}
      {...props}
      // The formatter replaces AnimatedCounter's own number formatting
      // entirely, so prefix/suffix must stay empty or the symbol prints twice.
      suffix=""
      prefix=""
    >
      {(value) => formatter.format(value)}
    </AnimatedCounter>
  );
}

export function PercentageCounter({ percentage, ...props }) {
  return (
    <AnimatedCounter
      to={percentage}
      suffix="%"
      decimals={1}
      {...props}
    />
  );
}

export function DurationCounter({ seconds, ...props }) {
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatedCounter
      to={seconds}
      duration={2000}
      {...props}
    >
      {(value) => formatTime(value)}
    </AnimatedCounter>
  );
}
