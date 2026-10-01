// ═══════════════════════════════════════════════════════════════════════════
// 1M MOTORS — Enhanced Car Card with Motion
// Using UI UX Pro Max recommendations
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EnhancedCarCard({ car, index }) {
  const navigate = useNavigate();

  const openCar = () => navigate(`/car/${car.id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1] 
      }}
      onClick={openCar}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCar();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${car.brand} ${car.name}`}
      className="premium-card cursor-pointer"
      style={{
        background: 'var(--color-black-200)',
        borderRadius: '6px',
        border: '1px solid rgba(240,237,232,0.06)',
        overflow: 'hidden',
        outlineOffset: '2px',
      }}
    >
      {/* Car Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover"
          style={{
            transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=' + car.name;
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #050507, transparent)',
          }}
        />
        
        {/* Price Badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5"
          style={{
            background: 'rgba(5,5,7,0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            border: '1px solid rgba(240,237,232,0.1)',
          }}
        >
          <span
            className="font-ui text-sm font-semibold"
            style={{ color: 'var(--gold)' }}
          >
            ${car.price?.toLocaleString() || 'N/A'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div
          className="font-ui text-xs mb-1"
          style={{
            color: 'var(--text-secondary)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          {car.brand}
        </div>
        
        <h3
          className="font-display text-2xl mb-1"
          style={{ color: '#F0EDE8' }}
        >
          {car.name}
        </h3>
        
        <p
          className="font-body text-sm mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {car.tagline || car.description?.slice(0, 80) + '...'}
        </p>

        {/* Stats */}
        <div
          className="flex items-center gap-4 pt-4"
          style={{ borderTop: '1px solid rgba(240,237,232,0.06)' }}
        >
          {car.horsepower && (
            <span
              className="font-ui text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {car.horsepower} HP
            </span>
          )}
          {car.acceleration && (
            <span
              className="font-ui text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {car.acceleration}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
