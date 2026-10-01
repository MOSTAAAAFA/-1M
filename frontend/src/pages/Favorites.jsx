import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cars } from '../data/cars';
import { useApp } from '../context/AppContext';
import AnimatedCard from '../components/AnimatedCard';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useApp();

  const favoriteCars = cars.filter(car => favorites.includes(car.id));

  return (
    <div style={styles.page}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.header}
        >
          <h1 style={styles.title}>
            Your <span style={styles.goldText}>Favorites</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={styles.count}
          >
            {favoriteCars.length} {favoriteCars.length === 1 ? 'vehicle' : 'vehicles'} saved
          </motion.p>
        </motion.div>

        {/* Empty State */}
        {favoriteCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={styles.emptyState}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={styles.emptyIcon}
            >
              ♡
            </motion.div>
            <h2 style={styles.emptyTitle}>No favorites yet</h2>
            <p style={styles.emptyText}>
              Browse our collection and save the cars you love
            </p>
            <motion.button
              onClick={() => navigate('/cars')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={styles.exploreBtn}
            >
              Explore Collection
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={styles.grid}
          >
            {favoriteCars.map((car, i) => (
              <AnimatedCard key={car.id} car={car} index={i} />
            ))}
          </motion.div>
        )}
      </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--black)',
    padding: '140px 20px 80px'
  },
  header: {
    textAlign: 'center',
    marginBottom: 60,
    paddingTop: 20
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(48px, 6vw, 72px)',
    fontWeight: 300,
    color: 'var(--white)',
    marginBottom: 16,
    lineHeight: 1.1
  },
  goldText: {
    fontStyle: 'italic',
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  count: {
    fontSize: 16,
    color: 'var(--white-40)',
    fontFamily: 'var(--font-ui)',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  emptyState: {
    textAlign: 'center',
    padding: '100px 20px',
    maxWidth: 500,
    margin: '60px auto'
  },
  emptyIcon: {
    fontSize: 120,
    marginBottom: 30,
    color: 'var(--gold)',
    filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.3))'
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 36,
    fontWeight: 300,
    color: 'var(--white)',
    marginBottom: 16
  },
  emptyText: {
    fontSize: 16,
    color: 'var(--white-40)',
    marginBottom: 40,
    lineHeight: 1.6
  },
  exploreBtn: {
    padding: '14px 36px',
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    border: 'none',
    borderRadius: 8,
    color: 'var(--black)',
    fontFamily: 'var(--font-ui)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: 'none',
    boxShadow: '0 8px 30px rgba(201,168,76,0.4)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
    gap: 24,
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 20px'
  }
};
