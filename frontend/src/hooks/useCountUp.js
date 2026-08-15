/**
 * useCountUp Hook
 * Smooth number counting animation for stats and metrics
 */

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Animate a number from start to end value
 * @param {number} end - Target value
 * @param {Object} options - Configuration
 * @returns {number} - Current animated value
 */
export function useCountUp(end, options = {}) {
  const {
    start = 0,
    duration = 2000,
    delay = 0,
    decimals = 0,
    onComplete = null,
    triggerOnView = true,
    threshold = 0.3,
  } = options;

  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const frameRef = useRef();
  const startTimeRef = useRef();

  // Use intersection observer to trigger animation when visible
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  });

  const shouldAnimate = triggerOnView ? inView && !hasAnimated : !hasAnimated;

  useEffect(() => {
    if (!shouldAnimate) return;

    const startAnimation = () => {
      setHasAnimated(true);
      startTimeRef.current = null;

      const animate = (timestamp) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp + delay;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (end - start) * easeOutCubic;

        setCount(currentValue);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
          if (onComplete) onComplete();
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    startAnimation();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [shouldAnimate, start, end, duration, delay, onComplete]);

  // Format the number with specified decimals
  const formattedCount = count.toFixed(decimals);

  return triggerOnView ? [ref, formattedCount, count] : [null, formattedCount, count];
}

/**
 * Format number with commas (e.g., 1234 -> 1,234)
 */
export function formatNumber(num, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Parse number from string (e.g., "640 hp" -> 640)
 */
export function parseStatNumber(str) {
  if (typeof str !== 'string') return 0;
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * Extract unit from string (e.g., "640 hp" -> "hp")
 */
export function parseStatUnit(str) {
  if (typeof str !== 'string') return '';
  const match = str.match(/[a-zA-Z/()–-]+/);
  return match ? match[0].trim() : '';
}

/**
 * Component wrapper for count-up animation
 */
export function CountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  separator = true,
  ...props
}) {
  const [ref, formattedCount] = useCountUp(end, {
    start,
    duration,
    decimals,
    triggerOnView: true,
  });

  const displayValue = separator
    ? formatNumber(parseFloat(formattedCount), decimals)
    : formattedCount;

  return (
    <span ref={ref} {...props}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default useCountUp;
