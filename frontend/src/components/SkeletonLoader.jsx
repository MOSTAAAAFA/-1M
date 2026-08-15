import React from 'react';
import { motion } from 'framer-motion';

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(201,168,76,0.1) 50%, rgba(255,255,255,0.03) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
        ...style,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={styles.card}>
      <Skeleton height="240px" borderRadius="20px 20px 0 0" />
      <div style={{ padding: '24px' }}>
        <Skeleton width="40%" height="12px" style={{ marginBottom: '8px' }} />
        <Skeleton width="80%" height="24px" style={{ marginBottom: '8px' }} />
        <Skeleton width="30%" height="14px" style={{ marginBottom: '20px' }} />

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <Skeleton width="50%" height="40px" />
          <Skeleton width="50%" height="40px" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="30%" height="28px" />
          <Skeleton width="40%" height="40px" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr>
      {[...Array(columns)].map((_, i) => (
        <td key={i} style={{ padding: '16px' }}>
          <Skeleton height="16px" />
        </td>
      ))}
    </tr>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height="16px"
          style={{ marginBottom: '12px' }}
        />
      ))}
    </div>
  );
}

export function ImageSkeleton({ aspectRatio = '16/9', style = {} }) {
  return (
    <div style={{ aspectRatio, width: '100%', ...style }}>
      <Skeleton height="100%" borderRadius="12px" />
    </div>
  );
}

export function GridSkeleton({ count = 6, columns = 3 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '32px',
    }}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(201, 168, 76, 0.15)',
  },
};

// Add shimmer animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}

export default Skeleton;
