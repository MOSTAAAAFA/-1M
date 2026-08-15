import React from 'react';
import { motion } from 'framer-motion';

const ComparisonTable = ({ cars = [] }) => {
  if (!cars || cars.length === 0) return null;

  const specs = [
    { key: 'price', label: 'Price', format: (val) => `$${val?.toLocaleString() || 'N/A'}` },
    { key: 'horsepower', label: 'Horsepower', format: (val) => `${val || 'N/A'} HP` },
    { key: 'topSpeed', label: 'Top Speed', format: (val) => `${val || 'N/A'} mph` },
    { key: 'acceleration', label: '0-60 mph', format: (val) => `${val || 'N/A'}s` },
    { key: 'engine', label: 'Engine', format: (val) => val || 'N/A' },
    { key: 'transmission', label: 'Transmission', format: (val) => val || 'N/A' },
    { key: 'fuelType', label: 'Fuel Type', format: (val) => val || 'N/A' },
    { key: 'drivetrain', label: 'Drivetrain', format: (val) => val || 'N/A' },
    { key: 'seating', label: 'Seating', format: (val) => `${val || 'N/A'} seats` },
    { key: 'warranty', label: 'Warranty', format: (val) => val || 'N/A' },
  ];

  return (
    <div style={{
      padding: '40px 0',
      borderTop: '1px solid rgba(201,168,76,0.15)',
      marginTop: '60px',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px', textAlign: 'center' }}
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
          Compare Specifications
        </h2>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '16px',
          color: 'rgba(240,237,232,0.6)',
        }}>
          Side-by-side detailed comparison
        </p>
      </motion.div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '20px 16px',
                textAlign: 'left',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>
                Specification
              </th>
              {cars.map((car, index) => (
                <th key={car.id || index} style={{ padding: '20px 16px', textAlign: 'center' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <img
                      src={car.image || '/placeholder.png'}
                      alt={car.name}
                      style={{
                        width: '120px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid rgba(201,168,76,0.2)',
                      }}
                    />
                    <div style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--white)',
                    }}>
                      {car.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '12px',
                      color: 'rgba(240,237,232,0.6)',
                    }}>
                      {car.brand}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec) => (
              <motion.tr
                key={spec.key}
                whileHover={{
                  backgroundColor: 'rgba(201,168,76,0.05)',
                }}
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                <td style={{
                  padding: '16px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'rgba(240,237,232,0.9)',
                  borderRadius: '8px 0 0 8px',
                }}>
                  {spec.label}
                </td>
                {cars.map((car, index) => (
                  <td
                    key={car.id || index}
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '14px',
                      color: 'rgba(240,237,232,0.8)',
                      borderRadius: index === cars.length - 1 ? '0 8px 8px 0' : '0',
                    }}
                  >
                    {spec.format(car[spec.key])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
