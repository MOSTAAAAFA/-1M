import React from 'react';
import { useReducedMotion } from '../context/ReducedMotionContext';

const LOGOS = [
  { src: '/logos/porsche.png', top: '4%', left: '3%', size: 130, rotate: -8, duration: 18, delay: 0, color: '#D5001C', glow: 'rgba(213, 0, 28, 0.5)' },
  { src: '/logos/ferrari.png', top: '2%', right: '4%', size: 120, rotate: 6, duration: 22, delay: 2, color: '#DC0000', glow: 'rgba(220, 0, 0, 0.5)' },
  { src: '/logos/lamborghini.png', top: '1%', left: '38%', size: 130, rotate: -4, duration: 26, delay: 1, color: '#FFC300', glow: 'rgba(255, 195, 0, 0.5)' },
  { src: '/logos/tesla.png', top: '3%', left: '62%', size: 115, rotate: 10, duration: 20, delay: 3, color: '#E82127', glow: 'rgba(232, 33, 39, 0.5)' },
  { src: '/logos/bmw.png', top: '20%', left: '2%', size: 125, rotate: -12, duration: 24, delay: 4, color: '#1C69D4', glow: 'rgba(28, 105, 212, 0.5)' },
  { src: '/logos/mercedes.png', top: '18%', right: '3%', size: 120, rotate: 4, duration: 21, delay: 5, color: '#00ADEF', glow: 'rgba(0, 173, 239, 0.5)' },
  { src: '/logos/audi.png', top: '22%', left: '40%', size: 115, rotate: -6, duration: 19, delay: 6, color: '#BB0A30', glow: 'rgba(187, 10, 48, 0.5)' },
  { src: '/logos/mclaren.png', top: '16%', left: '66%', size: 125, rotate: 8, duration: 23, delay: 7, color: '#FF8000', glow: 'rgba(255, 128, 0, 0.5)' },
  { src: '/logos/aston-martin.png', top: '34%', left: '4%', size: 110, rotate: -10, duration: 25, delay: 8, color: '#00563F', glow: 'rgba(0, 86, 63, 0.5)' },
  { src: '/logos/bugatti.png', top: '32%', right: '5%', size: 120, rotate: 5, duration: 20, delay: 9, color: '#BE0032', glow: 'rgba(190, 0, 50, 0.5)' },
  { src: '/logos/bentley.png', top: '36%', left: '38%', size: 125, rotate: -5, duration: 22, delay: 10, color: '#00563F', glow: 'rgba(0, 86, 63, 0.5)' },
  { src: '/logos/chevrolet.png', top: '30%', left: '70%', size: 115, rotate: 9, duration: 21, delay: 11, color: '#C8A961', glow: 'rgba(200, 169, 97, 0.5)' },
  { src: '/logos/honda.png', top: '48%', left: '3%', size: 120, rotate: -7, duration: 24, delay: 12, color: '#CC0000', glow: 'rgba(204, 0, 0, 0.5)' },
  { src: '/logos/toyota.png', top: '46%', right: '3%', size: 125, rotate: 6, duration: 19, delay: 13, color: '#EB0A1E', glow: 'rgba(235, 10, 30, 0.5)' },
  { src: '/logos/ford.png', top: '50%', left: '36%', size: 115, rotate: -9, duration: 26, delay: 14, color: '#003478', glow: 'rgba(0, 52, 120, 0.5)' },
  { src: '/logos/lotus.png', top: '44%', left: '68%', size: 120, rotate: 7, duration: 20, delay: 15, color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)' },
  { src: '/logos/ferrari.png', top: '62%', left: '4%', size: 115, rotate: -8, duration: 21, delay: 16, color: '#DC0000', glow: 'rgba(220, 0, 0, 0.5)' },
  { src: '/logos/porsche.png', top: '60%', right: '4%', size: 125, rotate: 4, duration: 23, delay: 17, color: '#D5001C', glow: 'rgba(213, 0, 28, 0.5)' },
  { src: '/logos/lamborghini.png', top: '64%', left: '40%', size: 120, rotate: -6, duration: 25, delay: 18, color: '#FFC300', glow: 'rgba(255, 195, 0, 0.5)' },
  { src: '/logos/tesla.png', top: '58%', left: '66%', size: 115, rotate: 10, duration: 18, delay: 19, color: '#E82127', glow: 'rgba(232, 33, 39, 0.5)' },
  { src: '/logos/audi.png', top: '78%', left: '3%', size: 125, rotate: -11, duration: 22, delay: 20, color: '#BB0A30', glow: 'rgba(187, 10, 48, 0.5)' },
  { src: '/logos/mclaren.png', top: '76%', right: '3%', size: 120, rotate: 5, duration: 20, delay: 21, color: '#FF8000', glow: 'rgba(255, 128, 0, 0.5)' },
  { src: '/logos/bmw.png', top: '80%', left: '38%', size: 115, rotate: -4, duration: 24, delay: 22, color: '#1C69D4', glow: 'rgba(28, 105, 212, 0.5)' },
  { src: '/logos/mercedes.png', top: '74%', left: '68%', size: 120, rotate: 8, duration: 19, delay: 23, color: '#00ADEF', glow: 'rgba(0, 173, 239, 0.5)' },
];

export default function BrandWatermarkBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {LOGOS.map((logo, i) => (
        // Wrapper owns the float animation (transform + opacity, NO filter)
        // so it stays on the compositor and never re-rasterizes the glow below.
        <div
          key={`${logo.src}-${i}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: logo.top,
            left: logo.left,
            right: logo.right,
            width: logo.size,
            maxWidth: '28vw',
            transformOrigin: 'center',
            opacity: 0.15,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            pointerEvents: 'none',
            animation: prefersReducedMotion
              ? 'none'
              : `watermarkFloat ${logo.duration}s ease-in-out ${logo.delay}s infinite alternate`,
          }}
        >
          <img
            src={logo.src}
            alt=""
            loading="lazy"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              filter: `drop-shadow(0 0 10px ${logo.glow}) brightness(1.15)`,
              transform: `rotate(${logo.rotate}deg)`,
              transformOrigin: 'center',
              pointerEvents: 'none',
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes watermarkFloat {
          0% {
            transform: translateY(0);
            opacity: 0.11;
          }
          50% {
            opacity: 0.19;
          }
          100% {
            transform: translateY(-10px);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}
