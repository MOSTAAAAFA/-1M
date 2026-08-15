import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function TextReveal({
  children,
  delay = 0,
  duration = 0.05,
  stagger = 0.03,
  once = true,
  className,
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const text = typeof children === 'string' ? children : '';
  const letters = text.split('');

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', ...style }}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration,
            delay: delay + (index * stagger),
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {letter === ' ' ? ' ' : letter}
        </motion.span>
      ))}
    </span>
  );
}

export function TextRevealByWord({
  children,
  delay = 0,
  duration = 0.3,
  stagger = 0.1,
  once = true,
  className,
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', ...style }}>
      {words.map((word, index) => (
        <span key={index} style={{ display: 'inline-block', marginRight: '0.3em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration,
              delay: delay + (index * stagger),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function TextGlitch({ children, trigger = false, className, style = {} }) {
  return (
    <motion.span
      className={className}
      style={style}
      animate={trigger ? {
        x: [-2, 2, -2, 2, 0],
        textShadow: [
          '2px 0 #ff00ff, -2px 0 #00ffff',
          '-2px 0 #ff00ff, 2px 0 #00ffff',
          '2px 0 #ff00ff, -2px 0 #00ffff',
          '0 0 transparent',
        ],
      } : {}}
      transition={{
        duration: 0.3,
        times: [0, 0.3, 0.6, 1],
      }}
    >
      {children}
    </motion.span>
  );
}

export function TextWave({ children, delay = 0, className, style = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const text = typeof children === 'string' ? children : '';
  const letters = text.split('');

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', ...style }}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
          animate={isInView ? {
            y: [0, -10, 0],
          } : {}}
          transition={{
            duration: 0.5,
            delay: delay + (index * 0.05),
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
        >
          {letter === ' ' ? ' ' : letter}
        </motion.span>
      ))}
    </span>
  );
}

export function TextMorph({ from, to, trigger, className, style = {} }) {
  return (
    <motion.span
      className={className}
      style={style}
      animate={trigger ? {
        opacity: [1, 0, 1],
        scale: [1, 0.8, 1],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {trigger ? to : from}
    </motion.span>
  );
}
