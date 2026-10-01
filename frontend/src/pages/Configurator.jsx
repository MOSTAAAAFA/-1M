import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cars } from '../data/cars';
import { useApp } from '../context/AppContext';
import { calcFinance, fmtCurrency } from '../utils/finance';

const COLORS = [
  { name: 'Midnight Black', hex: '#0a0a0a' },
  { name: 'Arctic White', hex: '#f5f5f5' },
  { name: 'Racing Red', hex: '#c0392b' },
  { name: 'Ocean Blue', hex: '#1a3a5c' },
  { name: 'Forest Green', hex: '#1e4d2b' },
  { name: 'Titanium Grey', hex: '#6b7280' },
];

const INTERIORS = [
  { name: 'Black Leather', hex: '#1c1c1f', price: 0 },
  { name: 'Cognac Brown', hex: '#6f4426', price: 1800 },
  { name: 'Racing Red', hex: '#8a1f1f', price: 1600 },
  { name: 'Smoke Grey', hex: '#45464a', price: 1200 },
];

const WHEELS = [
  { name: 'Standard 19"', price: 0, img: 'standard' },
  { name: 'Sport 21"', price: 3500, img: 'sport' },
  { name: 'Forged 22"', price: 7200, img: 'forged' },
];

const PACKAGES = [
  { name: 'Sport Chrono', price: 4100, desc: 'Launch Control + Track Modes' },
  { name: 'Premium Sound', price: 6800, desc: 'Burmester® 3D Surround' },
  { name: 'Night Vision', price: 3200, desc: 'Thermal Imaging Assist' },
  { name: 'Panoramic Roof', price: 2900, desc: 'Full Glass Roof Panel' },
];

const GOLD = '#c9a84c';

export default function Configurator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, addToast } = useApp();

  const fromRoute = cars.find(c => c.id === Number(id));
  const [selectedCar, setSelectedCar] = useState(fromRoute || cars[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedInterior, setSelectedInterior] = useState(INTERIORS[0]);
  const [selectedWheel, setSelectedWheel] = useState(WHEELS[0]);
  const [selectedPackages, setSelectedPackages] = useState([]);

  const togglePackage = (pkg) => {
    setSelectedPackages(prev =>
      prev.find(p => p.name === pkg.name)
        ? prev.filter(p => p.name !== pkg.name)
        : [...prev, pkg]
    );
  };

  const totalPrice =
    selectedCar.price +
    selectedWheel.price +
    selectedInterior.price +
    selectedPackages.reduce((s, p) => s + p.price, 0);

  const finance = calcFinance(totalPrice, 20, 5.9, 60);

  const handleAddToCart = () => {
    addToCart({
      ...selectedCar,
      price: totalPrice,
      color: selectedColor.name,
      interior: selectedInterior.name,
      wheel: selectedWheel.name,
      packages: selectedPackages.map(p => p.name),
    });
    addToast({ type: 'success', message: `${selectedCar.name} configuration added to Garage` });
  };

  const pageStyle = {
    minHeight: '100vh',
    background: '#050507',
    color: '#f0ede8',
    padding: '88px 2rem 3rem',
  };

  const labelStyle = {
    color: 'rgba(240,237,232,0.45)',
    fontSize: '0.72rem',
    letterSpacing: '0.2em',
    fontWeight: 600,
    marginBottom: '1rem',
  };

  const cardStyle = (active) => ({
    padding: '0.75rem',
    borderRadius: '10px',
    border: `1px solid ${active ? `rgba(201,168,76,0.6)` : 'rgba(255,255,255,0.1)'}`,
    background: active ? 'rgba(201,168,76,0.06)' : '#0d0d12',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '11px',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          color: GOLD,
          marginBottom: 10,
        }}>1M Motors · Bespoke</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '3rem',
          fontWeight: 700,
          background: `linear-gradient(135deg, #c9a84c, #e0c06a)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.05em',
          margin: 0,
        }}>Configurator</h1>
        <p style={{ color: 'rgba(240,237,232,0.5)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Build your perfect machine
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT - Preview */}
        <div>
          {/* Car Image */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#0d0d12',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <img
              src={selectedCar.heroImage || selectedCar.image}
              alt={selectedCar.name}
              style={{ width: '100%', height: '340px', objectFit: 'cover' }}
            />
            {/* Color preview strip */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '6px 12px',
              borderRadius: '50px',
              background: 'rgba(5,5,7,0.7)',
              border: `1px solid ${selectedColor.hex}`,
              color: '#fff',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: selectedColor.hex, display: 'inline-block' }} />
              {selectedColor.name}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
              padding: '2rem 1.5rem 1.5rem'
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.6rem',
                fontWeight: 700,
              }}>{selectedCar.brand} {selectedCar.name}</div>
              <div style={{ color: 'rgba(240,237,232,0.55)', fontSize: '0.85rem' }}>
                {selectedCar.year} · {selectedCar.category} · {selectedCar.specs?.horsepower}
              </div>
            </div>
          </div>

          {/* Select Car */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={labelStyle}>Select Model</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {cars.slice(0, 6).map(car => (
                <div
                  key={car.id}
                  onClick={() => setSelectedCar(car)}
                  style={cardStyle(selectedCar.id === car.id)}
                >
                  <img src={car.image} alt={car.name} onError={(e) => { e.currentTarget.src = `https://placehold.co/400x120/111117/C9A84C?text=${encodeURIComponent(car.brand)}`; }} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '20px' }} />
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    color: selectedCar.id === car.id ? GOLD : '#f0ede8',
                  }}>
                    {car.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(240,237,232,0.4)' }}>{car.brand}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={labelStyle}>
              Exterior Color — <span style={{ color: '#f0ede8' }}>{selectedColor.name}</span>
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {COLORS.map(color => (
                <div
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  style={{
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    background: color.hex,
                    cursor: 'pointer',
                    border: selectedColor.name === color.name
                      ? `3px solid ${GOLD}`
                      : '3px solid rgba(255,255,255,0.15)',
                    boxShadow: selectedColor.name === color.name
                      ? `0 0 14px rgba(201,168,76,0.5)`
                      : 'none',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Interior */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={labelStyle}>
              Interior — <span style={{ color: '#f0ede8' }}>{selectedInterior.name}</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {INTERIORS.map(int => (
                <div
                  key={int.name}
                  onClick={() => setSelectedInterior(int)}
                  style={cardStyle(selectedInterior.name === int.name)}
                >
                  <div style={{
                    height: '40px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${int.hex}, ${int.hex}88)`,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }} />
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    color: selectedInterior.name === int.name ? GOLD : '#f0ede8',
                  }}>{int.name}</div>
                  <div style={{ fontSize: '0.65rem', color: int.price === 0 ? 'rgba(240,237,232,0.4)' : GOLD }}>
                    {int.price === 0 ? 'Included' : `+$${int.price.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wheels */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={labelStyle}>Wheel Package</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {WHEELS.map(wheel => (
                <div
                  key={wheel.name}
                  onClick={() => setSelectedWheel(wheel)}
                  style={{ ...cardStyle(selectedWheel.name === wheel.name), flex: 1, textAlign: 'center', padding: '1rem' }}
                >
                  <div style={{ fontSize: '1.5rem', color: GOLD }}><WheelIcon name={wheel.img} /></div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>{wheel.name}</div>
                  <div style={{ fontSize: '0.75rem', color: wheel.price === 0 ? 'rgba(240,237,232,0.4)' : GOLD }}>
                    {wheel.price === 0 ? 'Included' : `+$${wheel.price.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div>
            <h3 style={labelStyle}>Optional Packages</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {PACKAGES.map(pkg => {
                const active = selectedPackages.find(p => p.name === pkg.name);
                return (
                  <div
                    key={pkg.name}
                    onClick={() => togglePackage(pkg)}
                    style={cardStyle(active)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{pkg.name}</span>
                      <span style={{ color: GOLD, fontSize: '0.75rem' }}>+${pkg.price.toLocaleString()}</span>
                    </div>
                    <div style={{ color: 'rgba(240,237,232,0.4)', fontSize: '0.75rem', marginTop: '0.3rem' }}>{pkg.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT - Summary */}
        <div style={{ position: 'sticky', top: '5rem', alignSelf: 'start' }}>
          <div style={{
            background: '#0d0d12',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              marginBottom: '1.5rem',
              color: GOLD,
              fontWeight: 600,
            }}>
              Your Configuration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <SummaryLine label="Base Price" value={fmtCurrency(selectedCar.price)} />
              <SummaryLine label="Exterior" value={selectedColor.name} />
              <SummaryLine label="Interior" value={selectedInterior.name}
                extra={selectedInterior.price > 0 ? `+$${selectedInterior.price.toLocaleString()}` : null} />
              <SummaryLine label="Wheels" value={selectedWheel.name}
                extra={selectedWheel.price > 0 ? `+$${selectedWheel.price.toLocaleString()}` : null} />
              {selectedPackages.map(pkg => (
                <SummaryLine key={pkg.name} label={pkg.name} value={`+$${pkg.price.toLocaleString()}`} highlight />
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: 'rgba(240,237,232,0.5)', fontSize: '0.85rem' }}>Total Price</span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  background: `linear-gradient(135deg, #c9a84c, #e0c06a)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {fmtCurrency(totalPrice)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.2)',
              }}>
                <span style={{ color: 'rgba(240,237,232,0.5)', fontSize: '0.75rem' }}>Est. Financing /mo</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: GOLD }}>
                  {fmtCurrency(finance.monthly)}
                  <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(240,237,232,0.4)', marginLeft: 4 }}>
                    20% down · 60 mo
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
                color: '#050507',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              ADD TO GARAGE
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'transparent',
                color: 'rgba(240,237,232,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              BACK
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function SummaryLine({ label, value, extra, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
      <span style={{ color: 'rgba(240,237,232,0.45)' }}>{label}</span>
      <span style={{ color: highlight ? '#e0c06a' : '#f0ede8', fontWeight: highlight ? 600 : 400 }}>{extra || value}</span>
    </div>
  );
}

function WheelIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (name === 'standard') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5" /><path d="M12 16v5" /><path d="M3 12h5" /><path d="M16 12h5" />
    </svg>
  );
  if (name === 'sport') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" /><path d="M12 19v2" /><path d="M3 12h2" /><path d="M19 12h2" />
      <path d="m5.6 5.6 1.4 1.4" /><path d="m17 17 1.4 1.4" />
    </svg>
  );
  if (name === 'forged') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v6" /><path d="M12 15v6" /><path d="M3 12h6" /><path d="M15 12h6" />
      <path d="m5.2 5.2 4.2 4.2" /><path d="m14.6 14.6 4.2 4.2" /><path d="m18.8 5.2-4.2 4.2" /><path d="m9.4 14.6-4.2 4.2" />
    </svg>
  );
  return null;
}
