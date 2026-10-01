import React from 'react';

/**
 * Brand1M Component
 * Renders "1M" text with proper vertical alignment
 * Ensures "1" and "M" appear at the same height/baseline
 */
export default function Brand1M({ className, style, name = '1M', ...props }) {
  return (
    <span
      className={className}
      style={{
        fontVariantNumeric: 'lining-nums',
        fontFeatureSettings: '"lnum"',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style,
      }}
      {...props}
    >
      {name}
    </span>
  );
}
