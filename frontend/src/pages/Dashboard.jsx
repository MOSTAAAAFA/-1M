import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cars } from '../data/cars';
import { useApp } from '../context/AppContext';
import Brand1M from '../components/Brand1M';
import OptimizedImage from '../components/OptimizedImage';
import { compactPrice } from '../utils/finance';
import { SearchIcon, BoltIcon, GemIcon } from '../components/icons';

const CATEGORIES = ['All', 'Sport', 'Electric', 'Electric SUV', 'Sport SUV', 'Hypercar', 'Sport Sedan', 'Electric Truck'];

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const carsRef = useRef(null);

  const filtered = useMemo(() => {
    let result = [...cars];
    if (activeCategory !== 'All') {
      result = result.filter(c => c.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [search, activeCategory, sortBy]);

  const scrollToCars = () => {
    carsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Hero onExplore={scrollToCars} />
      <StatsBar />
      <div ref={carsRef} id="cars-section" style={{ scrollMarginTop: '80px' }}>
        <CollectionSection
          cars={filtered}
          search={search}
          setSearch={setSearch}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
      <Footer />
    </div>
  );
}

/* ── Hero ── */
function Hero({ onExplore }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      minHeight: '700px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 60% at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 50%),
          linear-gradient(180deg, #050507 0%, #0c0c10 100%)
        `,
      }}>
        {/* Hero car image */}
        <img
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1600&q=80"
          alt="hero"
          style={{
            position: 'absolute',
            right: '-5%',
            bottom: '0',
            width: '70%',
            maxWidth: '950px',
            objectFit: 'contain',
            objectPosition: 'bottom right',
            opacity: loaded ? 0.85 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.22,1,0.36,1)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 90%)',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5,5,7,0.95) 35%, rgba(5,5,7,0.3) 65%, transparent)',
        }} />
      </div>

      {/* Grid lines decoration */}
      <GridDecor />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '72px' }}>
        <div style={{ maxWidth: '660px' }}>
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 0.8s 0.2s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: '#c9a84c',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ width: '32px', height: '1px', background: '#c9a84c', display: 'inline-block' }} />
              <Brand1M /> MOTORS — EST. 2024
            </p>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(52px, 6vw, 92px)',
            fontWeight: '300',
            lineHeight: '1.04',
            color: '#f0ede8',
            marginBottom: '28px',
            letterSpacing: '-1px',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(28px)',
            transition: 'all 0.9s 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}>
            Drive the <br />
            <em style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Extraordinary</em>
          </h1>

          <p style={{
            fontSize: '16px',
            fontWeight: '300',
            color: 'rgba(240,237,232,0.6)',
            lineHeight: '1.8',
            marginBottom: '44px',
            maxWidth: '440px',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 0.9s 0.5s cubic-bezier(0.22,1,0.36,1)',
          }}>
            Curating the world's finest automobiles. From Porsche's engineering mastery to Tesla's electric revolution — your perfect machine awaits.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 0.9s 0.65s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <button
              onClick={onExplore}
              className="btn btn-gold"
              style={{ fontSize: '13px', letterSpacing: '2px' }}
            >
              Explore Collection
              <ArrowDown />
            </button>
            <Link to="/car/1" className="btn btn-ghost" style={{ fontSize: '13px', letterSpacing: '2px' }}>
              Featured Car
            </Link>
          </div>
        </div>

        {/* Hero stats */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '40px',
          display: 'flex',
          gap: '40px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s 1s',
        }}>
          {[
            { value: '10+', label: 'Models' },
            { value: '2', label: 'Brands' },
            { value: '100%', label: 'Authentic' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}>{value}</div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '10px',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: 'rgba(240,237,232,0.4)',
                marginTop: '6px',
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: loaded ? 0.5 : 0,
        transition: 'opacity 1s 1.2s',
        cursor: 'pointer',
      }} onClick={onExplore}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '9px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(240,237,232,0.5)',
        }}>SCROLL</span>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)',
        }} />
      </div>
    </section>
  );
}

/* ── Stats Bar ── */
function StatsBar() {
  return (
    <div style={{
      background: 'rgba(12,12,16,0.9)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '28px 40px',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        {[
          { icon: 'bolt', label: 'Instant Delivery', desc: 'Nationwide shipping' },
          { icon: 'shield', label: 'Full Warranty', desc: '4-year factory coverage' },
          { icon: 'gem', label: 'Concierge Service', desc: 'White glove experience' },
          { icon: 'key', label: 'Test Drive', desc: 'At your doorstep' },
        ].map(({ icon, label, desc }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#C9A84C' }}>
              <PerkIcon name={icon} />
            </span>
            <div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                color: '#f0ede8',
              }}>{label}</p>
              <p style={{
                fontSize: '12px',
                color: 'rgba(240,237,232,0.4)',
              }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Collection Section ── */
function CollectionSection({ cars, search, setSearch, activeCategory, setActiveCategory, sortBy, setSortBy }) {
  return (
    <section style={{ padding: '100px 0 120px', background: 'var(--black)' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ marginBottom: '56px' }}>
          <p className="section-eyebrow">Our Collection</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 4vw, 58px)',
              fontWeight: '400',
              color: '#f0ede8',
              lineHeight: 1.1,
            }}>
              Exceptional Machines,<br />
              <em style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Curated for You</em>
            </h2>

            {/* Search */}
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '48px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
            {CATEGORIES.map(cat => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: 'rgba(22,22,30,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(240,237,232,0.7)',
              padding: '9px 16px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              letterSpacing: '1px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {/* Result count */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '12px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(240,237,232,0.3)',
          marginBottom: '32px',
        }}>
          {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} found
        </p>

        {/* Grid */}
        {cars.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {cars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{ fontSize: '40px', marginBottom: '16px', lineHeight: 1 }}><SearchIcon size={48} color="rgba(201,168,76,0.5)" /></p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              color: '#f0ede8',
              marginBottom: '8px',
            }}>No vehicles found</h3>
            <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: '14px' }}>
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Car Card ── */
function CarCard({ car, index }) {
  const { addToCart, toggleFavorite, favorites } = useApp();
  const [hovered, setHovered] = useState(false);
  const [addedPulse, setAddedPulse] = useState(false);
  const isFav = favorites.includes(car.id);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(car);
    setAddedPulse(true);
    setTimeout(() => setAddedPulse(false), 600);
  };

  return (
    <Link
      to={`/car/${car.id}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: hovered
            ? 'rgba(28,28,36,0.95)'
            : 'rgba(18,18,24,0.8)',
          border: hovered
            ? '1px solid rgba(201,168,76,0.45)'
            : '1px solid rgba(255,255,255,0.07)',
          transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
          transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.12)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          animation: `fadeUp 0.6s ${index * 0.07}s both`,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
          <OptimizedImage
            src={car.image}
            alt={car.name}
            objectFit="cover"
            style={{
              width: '100%',
              height: '100%',
              transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(14,14,20,0.9) 0%, rgba(14,14,20,0.1) 60%)',
          }} />

          {/* Badges */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            display: 'flex',
            gap: '8px',
          }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: 'rgba(201,168,76,0.2)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#c9a84c',
            }}>{car.category}</span>
            {!car.inStock && (
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                background: 'rgba(224,48,48,0.2)',
                border: '1px solid rgba(224,48,48,0.4)',
                color: '#e03030',
              }}>Pre-Order</span>
            )}
          </div>

          {/* Fav */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(car.id);
            }}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isFav ? 'rgba(201,168,76,0.25)' : 'rgba(5,5,7,0.6)',
              border: isFav ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
              color: isFav ? '#c9a84c' : 'rgba(240,237,232,0.5)',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s',
              backdropFilter: 'blur(8px)',
            }}
          >
            {isFav ? '♥' : '♡'}
          </button>

          {/* Year */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '14px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '2px',
            color: 'rgba(240,237,232,0.5)',
          }}>{car.year}</div>
        </div>

        {/* Info */}
        <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#c9a84c',
            marginBottom: '6px',
          }}>{car.brand}</p>

          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '24px',
            fontWeight: '600',
            color: '#f0ede8',
            lineHeight: '1.15',
            marginBottom: '8px',
          }}>{car.name}</h3>

          <p style={{
            fontSize: '12px',
            color: 'rgba(240,237,232,0.4)',
            marginBottom: '18px',
            fontStyle: 'italic',
          }}>{car.tagline}</p>

          {/* Quick specs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '22px',
          }}>
            {[
              { label: 'Power', value: car.specs.horsepower },
              { label: '0–60', value: car.specs.acceleration.replace(' (0–60)', '') },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '8px',
                padding: '10px 12px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'rgba(240,237,232,0.35)',
                  marginBottom: '3px',
                }}>{label}</p>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f0ede8',
                }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Gold price strip */}
          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            padding: '14px 24px',
            margin: 'auto -24px -24px',
            background: 'linear-gradient(to top, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.02) 100%)',
            borderTop: '1px solid rgba(201,168,76,0.28)',
          }}>
            <div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '9px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'rgba(240,237,232,0.5)',
                marginBottom: '2px',
              }}>From</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #c9a84c, #e0c06a 60%, #f4d03f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}>{compactPrice(car.price)}</p>
            </div>

            <button
              onClick={handleAdd}
              style={{
                padding: '10px 18px',
                background: addedPulse
                  ? 'linear-gradient(135deg, #c9a84c, #e0c06a)'
                  : hovered
                    ? 'rgba(201,168,76,0.18)'
                    : 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '8px',
                color: addedPulse ? '#050507' : '#c9a84c',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {addedPulse ? '✓ Added' : '+ Garage'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Search Bar ── */
function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: 'relative', width: '280px' }}>
      <span style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'rgba(240,237,232,0.3)',
        fontSize: '14px',
        pointerEvents: 'none',
      }}>⌕</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search brand or model..."
        style={{
          width: '100%',
          padding: '11px 14px 11px 38px',
          background: 'rgba(18,18,24,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color: '#f0ede8',
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          outline: 'none',
          transition: 'border-color 0.25s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
      />
    </div>
  );
}

/* ── Category Chip ── */
function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
        border: active ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)',
        color: active ? '#c9a84c' : 'rgba(240,237,232,0.5)',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.25s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
          e.currentTarget.style.color = 'rgba(240,237,232,0.8)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'rgba(240,237,232,0.5)';
        }
      }}
    >
      {label}
    </button>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '60px 0 40px',
      background: 'rgba(8,8,12,0.98)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}>
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              fontWeight: '600',
              color: '#f0ede8',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>1M</span>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>MOTORS</span>
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(240,237,232,0.3)' }}>
              © 2026 1M Motors. All rights reserved.
            </p>
          </div>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            letterSpacing: '2px',
            color: 'rgba(240,237,232,0.2)',
          }}>LUXURY · PERFORMANCE · EXCELLENCE</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Decorative grid lines ── */
function GridDecor() {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        pointerEvents: 'none',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {[...Array(20)].map((_, i) => (
        <line key={`v${i}`} x1={`${i * 5.26}%`} y1="0" x2={`${i * 5.26}%`} y2="100%" stroke="#c9a84c" strokeWidth="0.5" />
      ))}
      {[...Array(10)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={`${i * 11.1}%`} x2="100%" y2={`${i * 11.1}%`} stroke="#c9a84c" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  );
}

function PerkIcon({ name }) {
  switch (name) {
    case 'bolt': return <BoltIcon size={22} />;
    case 'shield': return <ShieldIcon />;
    case 'gem': return <GemIcon size={22} />;
    case 'key': return <KeyIcon />;
    default: return null;
  }
}