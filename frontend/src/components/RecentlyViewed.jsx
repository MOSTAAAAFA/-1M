import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import recentlyViewedManager from '../utils/recentlyViewedManager';

const RecentlyViewed = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const recentCars = recentlyViewedManager.getRecent(5);
    setCars(recentCars);
  }, []);

  if (cars.length === 0) return null;

  return (
    <div style={{
      padding: '60px 0',
      borderTop: '1px solid rgba(201,168,76,0.15)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--gold)',
          marginBottom: '8px',
        }}>
          Recently Viewed
        </h3>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'rgba(240,237,232,0.6)',
        }}>
          Continue where you left off
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        {cars.map((car, index) => (
          <motion.a
            key={car.id}
            href={`/car/${car.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            style={{
              textDecoration: 'none',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.2)',
              cursor: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              width: '100%',
              height: '140px',
              overflow: 'hidden',
            }}>
              <img
                src={car.image}
                alt={car.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                color: 'var(--gold)',
                marginBottom: '6px',
              }}>
                {car.brand}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--white)',
                marginBottom: '8px',
              }}>
                {car.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--gold)',
              }}>
                ${car.price?.toLocaleString()}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
