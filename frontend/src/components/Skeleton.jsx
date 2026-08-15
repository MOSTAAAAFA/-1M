import React from 'react';

export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={{
      background: 'rgba(17,17,23,0.9)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: 24,
      animation: 'pulse 2s ease-in-out infinite',
    }}>
      <Skeleton height={180} style={{ marginBottom: 16 }} />
      <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={14} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Skeleton width="48%" height={60} />
        <Skeleton width="48%" height={60} />
      </div>
      <Skeleton height={40} />

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
