import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cars } from '../data/cars';
import { parseHp } from '../utils/finance';
import CarCard from '../components/CarCard';
import { SearchIcon } from '../components/icons';
import { colors, spacing, radius, typography, shadows, transitions } from '../styles/designTokens';

const fmt = (n) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(n);

const MAX_PRICE = 10000000;
const HP_OPTIONS = [
  { label: 'Any Power', value: 0 },
  { label: '500+ HP', value: 500 },
  { label: '700+ HP', value: 700 },
  { label: '900+ HP', value: 900 },
  { label: '1200+ HP', value: 1200 },
];

export default function Cars() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [minHp, setMinHp] = useState(0);
  const [sortBy, setSortBy] = useState('featured');

  // Extract unique brands and years
  const brands = useMemo(() => {
    const allBrands = [...new Set(cars.map(c => c.brand))];
    return ['All', ...allBrands.sort()];
  }, []);

  const years = useMemo(() => {
    const allYears = [...new Set(cars.map(c => c.year))];
    return ['All', ...allYears.sort((a, b) => b - a)];
  }, []);

  const categories = useMemo(() => {
    const allCategories = [...new Set(cars.map(c => c.category).filter(Boolean))];
    return ['All', ...allCategories.sort()];
  }, []);

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let filtered = cars.filter(car => {
      const matchSearch = `${car.brand || ''} ${car.name || ''} ${car.category || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBrand = selectedBrand === 'All' || car.brand === selectedBrand;
      const matchCategory = selectedCategory === 'All' || car.category === selectedCategory;
      const matchPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchYear = selectedYear === 'All' || car.year === parseInt(selectedYear);
      const matchHp = parseHp(car.specs?.horsepower) >= minHp;
      return matchSearch && matchBrand && matchCategory && matchPrice && matchYear && matchHp;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'name':
        filtered.sort((a, b) => `${a.brand || ''} ${a.name || ''}`.localeCompare(`${b.brand || ''} ${b.name || ''}`));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedBrand, selectedCategory, priceRange, selectedYear, minHp, sortBy]);

  return (
    <>
      <div style={styles.page}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={styles.backArrow}>←</span> Back
        </button>

        {/* Hero Section */}
        <motion.div
          style={styles.hero}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Cinematic backdrop */}
          <div style={styles.heroBackdrop}>
            <div style={styles.heroBackdropZoom}>
              <img
                src={cars.find(c => c.id === 11)?.heroImage}
                alt=""
                aria-hidden="true"
                loading="eager"
                style={styles.heroBackdropImg}
              />
            </div>
            <div style={styles.heroOverlayLeft} />
            <div style={styles.heroOverlayBottom} />
            <div style={styles.heroVignette} />
          </div>

          <div style={styles.particleContainer}>
            {window.innerWidth >= 768 && [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  ...styles.particle,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
          <div style={styles.heroEyebrow}>
            <span style={styles.heroEyebrowLine} />
            The Gallery
            <span style={styles.heroEyebrowLine} />
          </div>
          <motion.h1
            style={styles.heroTitle}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Premium Collection
          </motion.h1>
          <motion.p
            style={styles.heroSubtitle}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the finest automotive excellence
          </motion.p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          style={styles.controlsSection}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Search Bar */}
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              className="cars-search"
            />
            <span style={styles.searchIcon}><SearchIcon size={20} color="rgba(240,237,232,0.5)" /></span>
          </div>

          {/* Filters Row */}
          <div style={styles.filtersRow}>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={styles.filterSelect}
              className="cars-select"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>Brand: {brand}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
              className="cars-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>Category: {category}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={styles.filterSelect}
              className="cars-select"
            >
              {years.map(year => (
                <option key={year} value={year}>Year: {year}</option>
              ))}
            </select>

            <select
              value={minHp}
              onChange={(e) => setMinHp(Number(e.target.value))}
              style={styles.filterSelect}
              className="cars-select"
            >
              {HP_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.filterSelect}
              className="cars-select"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year">Newest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Price range */}
          <div style={styles.priceRangeWrapper}>
            <span style={styles.priceRangeLabel}>Price Range</span>
            <input
              type="number"
              min={0}
              max={MAX_PRICE}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
              aria-label="Minimum price"
              style={styles.priceInput}
              className="cars-price-input"
            />
            <span style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13 }}>—</span>
            <input
              type="number"
              min={0}
              max={MAX_PRICE}
              value={priceRange[1] >= MAX_PRICE ? '' : priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || MAX_PRICE])}
              aria-label="Maximum price"
              placeholder="Max"
              style={styles.priceInput}
              className="cars-price-input"
            />
            <span style={styles.priceRangeHint}>
              {fmt(priceRange[0])} – {priceRange[1] >= MAX_PRICE ? 'No Limit' : fmt(priceRange[1])}
            </span>
          </div>

          <div style={styles.resultCount}>
            {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found
          </div>
        </motion.div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <motion.div
            style={styles.emptyState}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Automotive-inspired graphic instead of emoji */}
            <div style={{
              width: 200,
              height: 120,
              margin: '0 auto 32px',
              position: 'relative',
            }}>
              {/* Stylized road/horizon line */}
              <div style={{
                position: 'absolute',
                bottom: 30,
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
              }}/>

              {/* Simple car silhouette outline */}
              <svg width="160" height="80" viewBox="0 0 160 80" style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.15,
              }}>
                <path
                  d="M 20,50 L 35,35 L 50,30 L 110,30 L 125,35 L 140,50 L 150,50 L 150,65 L 140,65 L 135,60 L 25,60 L 20,65 L 10,65 L 10,50 Z M 35,65 L 35,70 L 45,70 L 45,65 M 115,65 L 115,70 L 125,70 L 125,65"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 style={styles.emptyTitle}>No Vehicles Match Your Criteria</h2>
            <p style={styles.emptyText}>
              Adjust your filters or{' '}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBrand('All');
                  setSelectedCategory('All');
                  setSelectedYear('All');
                  setMinHp(0);
                  setPriceRange([0, MAX_PRICE]);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
                aria-label="Reset all filters"
              >
                reset all filters
              </button>{' '}
              to see our full collection
            </p>
          </motion.div>
        ) : (
          <motion.div
            style={styles.grid}
            layout
          >
            {/* The catalogue renders the same canonical CarCard as the home rail
                and /favorites. The first three images load eagerly so the LCP
                candidate is not waiting on IntersectionObserver. */}
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car, index) => (
                <CarCard
                  key={car.id}
                  car={car}
                  index={index}
                  priority={index < 3}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <style>{`
        /* Focus states for inline-styled controls */
        .cars-search:focus,
        .cars-select:focus,
        .cars-price-input:focus {
          border-color: #E0C06A !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(201, 168, 76, 0.4), 0 0 30px rgba(201, 168, 76, 0.25) !important;
          outline: none;
        }
        .cars-search::placeholder { color: rgba(240, 237, 232, 0.35); }
      `}</style>
    </>
  );
}

// Styles
const styles = {
  page: {
    minHeight: '100vh',
    background: 'transparent',
    color: colors.white,
    paddingTop: '100px',
    paddingBottom: spacing['7xl'],
    position: 'relative',
  },
  backButton: {
    position: 'fixed',
    top: '100px',
    left: spacing.xl,
    zIndex: 100,
    background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
    border: 'none',
    borderRadius: radius.full,
    padding: `${spacing.sm} ${spacing.xl}`,
    color: colors.black,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    boxShadow: `${shadows.md}, 0 0 20px ${colors.goldGlow}`,
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s ease',
    willChange: 'transform',
  },
  backArrow: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  hero: {
    textAlign: 'center',
    padding: '140px 20px 120px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '460px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBackdrop: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    overflow: 'hidden',
    background: 'rgba(5,5,7,0.6)',
  },
  heroBackdropZoom: {
    position: 'absolute',
    inset: '-8%',
    animation: 'heroZoom 18s ease-in-out infinite alternate',
  },
  heroBackdropImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 40%',
    filter: 'saturate(0.9) brightness(0.55)',
  },
  heroOverlayLeft: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(5,5,7,0.9) 0%, rgba(5,5,7,0.45) 55%, rgba(5,5,7,0.2) 100%)',
  },
  heroOverlayBottom: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, #050507 0%, rgba(5,5,7,0.8) 28%, rgba(5,5,7,0.25) 62%, transparent 100%)',
  },
  heroVignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)',
  },
  heroEyebrow: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 22,
    fontFamily: typography.fontUI,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: '5px',
    textTransform: 'uppercase',
    color: colors.gold,
  },
  heroEyebrowLine: {
    width: 44,
    height: 1,
    background: 'linear-gradient(to right, transparent, #C9A84C)',
    boxShadow: '0 0 8px rgba(201,168,76,0.5)',
    display: 'inline-block',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
    boxShadow: '0 0 10px rgba(201, 168, 76, 0.5)',
  },
  heroTitle: {
    fontSize: 'clamp(48px, 8vw, 96px)',
    fontWeight: 300,
    letterSpacing: '4px',
    background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #C9A84C 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '16px',
    textTransform: 'uppercase',
    position: 'relative',
    zIndex: 1,
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(240, 237, 232, 0.6)',
    letterSpacing: '2px',
    fontWeight: 300,
    position: 'relative',
    zIndex: 1,
  },
  controlsSection: {
    maxWidth: '1400px',
    margin: '0 auto 60px',
    padding: '0 20px',
  },
  searchWrapper: {
    position: 'relative',
    marginBottom: '24px',
  },
  searchInput: {
    width: '100%',
    padding: `${spacing.lg} ${spacing['2xl']} ${spacing.lg} 56px`,
    background: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${colors.goldDim}`,
    borderRadius: radius.xl,
    color: colors.white,
    fontSize: typography.fontSize.lg,
    outline: 'none',
    transition: transitions.default,
    backdropFilter: 'blur(10px)',
    boxShadow: shadows.sm,
  },
  searchIcon: {
    position: 'absolute',
    left: '24px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    opacity: 0.6,
  },
  filtersRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  filterSelect: {
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.black2,
    border: `1px solid ${colors.goldGlow}`,
    borderRadius: radius.xl,
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    outline: 'none',
    transition: transitions.default,
    backdropFilter: 'blur(10px)',
    boxShadow: shadows.sm,
    letterSpacing: typography.letterSpacing.wide,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23C9A84C' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right ${spacing.lg} center`,
    paddingRight: spacing['5xl'],
  },
  resultCount: {
    fontSize: '14px',
    color: 'rgba(240, 237, 232, 0.5)',
    letterSpacing: '1px',
    textAlign: 'center',
    padding: '8px 0',
  },
  priceRangeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${colors.goldDim}`,
    borderRadius: radius.xl,
    flexWrap: 'wrap',
  },
  priceRangeLabel: {
    fontFamily: typography.fontUI,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
    color: colors.white40,
  },
  priceInput: {
    width: 110,
    padding: '8px 10px',
    background: colors.black2,
    border: `1px solid ${colors.border2}`,
    borderRadius: radius.xl,
    color: colors.white,
    fontFamily: typography.fontUI,
    fontSize: typography.fontSize.sm,
    outline: 'none',
    transition: transitions.default,
  },
  priceRangeHint: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.fontSize.sm,
    color: colors.gold,
    fontWeight: typography.fontWeight.semibold,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    willChange: 'contents',
  },
  emptyState: {
    textAlign: 'center',
    padding: '100px 20px',
    maxWidth: '500px',
    margin: '60px auto',
  },
  emptyTitle: {
    fontSize: '32px',
    fontWeight: 300,
    color: '#F0EDE8',
    marginBottom: '12px',
    letterSpacing: '1px',
  },
  emptyText: {
    fontSize: '16px',
    color: 'rgba(240, 237, 232, 0.4)',
    lineHeight: 1.6,
  },
};
