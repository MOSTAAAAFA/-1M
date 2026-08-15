import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

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
}) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const startTime = Date.now();
    const startValue = from;
    const endValue = to;
    const totalChange = endValue - startValue;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (totalChange * easeOut);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, from, to, duration, onComplete]);

  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');

    // Add thousand separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return parts.join('.');
  };

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{formatNumber(count)}{suffix}
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
      suffix=""
      prefix=""
      className={props.className}
      style={props.style}
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
