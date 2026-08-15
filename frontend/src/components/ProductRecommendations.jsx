import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductRecommendations = ({ currentCarId, currentCarBrand, currentCarCategory, currentCarPrice, cars }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!cars || cars.length === 0) return;

    const filteredCars = cars
      .filter(car => car.id !== currentCarId)
      .map(car => {
        let score = 0;

        // Same brand gets high priority
        if (car.brand === currentCarBrand) score += 50;

        // Same category gets medium priority
        if (car.category === currentCarCategory) score += 30;

        // Similar price range (±20%)
        const priceDiff = Math.abs(car.price - currentCarPrice);
        const priceRange = currentCarPrice * 0.2;
        if (priceDiff <= priceRange) {
          score += 20 - (priceDiff / priceRange) * 20;
        }

        return { ...car, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    setRecommendations(filteredCars);
  }, [currentCarId, currentCarBrand, currentCarCategory, currentCarPrice, cars]);

  if (recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: '80px',
        padding: '60px 0',
        borderTop: '1px solid rgba(201,168,76,0.15)',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #F4D03F 0%, #E0C06A 50%, #C9A84C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
          }}>
            You Might Also Like
          </h2>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '16px',
            color: 'rgba(240,237,232,0.6)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Discover similar vehicles that match your preferences and budget
          </p>
        </motion.div>
      </div>

      {/* Recommendations Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        <AnimatePresence>
          {recommendations.map((car, index) => (
            <RecommendationCard key={car.id} car={car} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const RecommendationCard = ({ car, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={`/car/${car.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textDecoration: 'none',
        position: 'relative',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
        border: '1px solid rgba(201,168,76,0.2)',
        overflow: 'hidden',
        cursor: 'none',
        transition: 'all 0.4s ease',
        boxShadow: isHovered
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.2)'
          : '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        overflow: 'hidden',
      }}>
        <img
          src={car.image || '/placeholder-car.jpg'}
          alt={car.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
        />

        {/* Overlay Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
        }} />

        {/* Badge */}
        {car.featured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
            background: 'var(--gold)',
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#000',
          }}>
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Brand & Category */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}>
            {car.brand}
          </span>
          <span style={{ color: 'rgba(201,168,76,0.4)' }}>•</span>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            color: 'rgba(240,237,232,0.5)',
          }}>
            {car.category}
          </span>
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'rgba(240,237,232,0.95)',
          marginBottom: '12px',
          lineHeight: 1.3,
        }}>
          {car.name}
        </h3>

        {/* Specs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          {car.horsepower && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,232,0.5)" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                color: 'rgba(240,237,232,0.6)',
              }}>
                {car.horsepower} HP
              </span>
            </div>
          )}
          {car.topSpeed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,232,0.5)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                color: 'rgba(240,237,232,0.6)',
              }}>
                {car.topSpeed} mph
              </span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              color: 'rgba(240,237,232,0.5)',
              marginBottom: '2px',
            }}>
              Starting at
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--gold)',
            }}>
              ${car.price?.toLocaleString() || 'N/A'}
            </div>
          </div>

          <motion.div
            animate={{
              x: isHovered ? 4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          border: '2px solid var(--gold)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
    </motion.a>
  );
};

export default ProductRecommendations;
