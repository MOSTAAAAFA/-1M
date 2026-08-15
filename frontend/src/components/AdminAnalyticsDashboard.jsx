import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminAnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 2450000,
    totalOrders: 156,
    activeUsers: 1234,
    conversionRate: 3.2,
    avgOrderValue: 15705
  });

  const [salesData, setSalesData] = useState([
    { month: 'Jan', sales: 320000 },
    { month: 'Feb', sales: 380000 },
    { month: 'Mar', sales: 420000 },
    { month: 'Apr', sales: 390000 },
    { month: 'May', sales: 450000 },
    { month: 'Jun', sales: 490000 }
  ]);

  const [topProducts, setTopProducts] = useState([
    { name: 'Porsche 911 Turbo S', sales: 45, revenue: 1350000 },
    { name: 'Mercedes S-Class', sales: 38, revenue: 950000 },
    { name: 'BMW 7 Series', sales: 32, revenue: 768000 },
    { name: 'Audi A8', sales: 28, revenue: 672000 },
    { name: 'Range Rover', sales: 13, revenue: 390000 }
  ]);

  const maxSales = Math.max(...salesData.map(d => d.sales));

  const StatCard = ({ title, value, icon, trend, trendValue }) => (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        padding: '24px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%)',
        border: '1px solid rgba(201,168,76,0.2)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.6)', marginBottom: '8px' }}>
            {title}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
            {value}
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'rgba(201,168,76,0.15)',
          color: 'var(--gold)',
          flexShrink: 0
        }}>
          <StatIcon name={icon} />
        </div>
      </div>
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: trend === 'up' ? '#25D366' : '#FF4B4B'
        }}>
          <span>{trend === 'up' ? '↗' : '↘'}</span>
          <span>{trendValue}% vs last month</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div style={{ padding: '32px', minHeight: '100vh', background: '#0A0A0A' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '32px'
        }}>
          Analytics Dashboard
        </h2>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="Total Sales"
            value={`$${(stats.totalSales / 1000000).toFixed(2)}M`}
            icon="money"
            trend="up"
            trendValue="12.5"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="box"
            trend="up"
            trendValue="8.3"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            icon="users"
            trend="up"
            trendValue="15.2"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon="target"
            trend="down"
            trendValue="2.1"
          />
          <StatCard
            title="Avg Order Value"
            value={`$${stats.avgOrderValue.toLocaleString()}`}
            icon="card"
            trend="up"
            trendValue="5.7"
          />
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '32px',
            borderRadius: '24px',
            background: 'rgba(20,20,20,0.95)',
            border: '1px solid rgba(201,168,76,0.2)',
            marginBottom: '32px'
          }}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '24px'
          }}>
            Sales Overview (Last 6 Months)
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '300px' }}>
            {salesData.map((data, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(240,237,232,0.6)',
                  fontWeight: 600
                }}>
                  ${(data.sales / 1000).toFixed(0)}k
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.sales / maxSales) * 250}px` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  style={{
                    width: '100%',
                    borderRadius: '8px 8px 0 0',
                    background: `linear-gradient(180deg, rgba(201,168,76,${0.8 + idx * 0.05}) 0%, rgba(201,168,76,0.3) 100%)`,
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  whileHover={{ opacity: 0.8 }}
                />
                <div style={{
                  fontSize: '13px',
                  color: 'rgba(240,237,232,0.8)',
                  fontWeight: 600
                }}>
                  {data.month}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: '32px',
            borderRadius: '24px',
            background: 'rgba(20,20,20,0.95)',
            border: '1px solid rgba(201,168,76,0.2)'
          }}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '24px'
          }}>
            Top Selling Products
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topProducts.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 5 }}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, rgba(201,168,76,${0.3 - idx * 0.05}) 0%, rgba(201,168,76,${0.1 - idx * 0.02}) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--gold)'
                }}>
                  #{idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.6)' }}>
                    {product.sales} units sold
                  </div>
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--gold)'
                }}>
                  ${(product.revenue / 1000).toFixed(0)}k
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div style={{
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { icon: 'chart', label: 'Export Report', color: '#4285F4' },
            { icon: 'mail', label: 'Email Report', color: '#34A853' },
            { icon: 'refresh', label: 'Refresh Data', color: '#FBBC04' },
            { icon: 'gear', label: 'Settings', color: '#EA4335' }
          ].map((action, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${action.color}40`,
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', color: action.color }}><StatIcon name={action.icon} /></span>
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;

function StatIcon({ name }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  switch (name) {
    case 'money': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10" />
        <path d="M15 9.5c-.5-.8-1.7-1.5-3-1.5s-2.5.7-2.5 1.5.9 1.3 2.5 1.5 3 .8 3 1.6-1.7 1.6-3 1.6-2.5-.7-3-1.5" />
      </svg>
    );
    case 'box': return (
      <svg {...common}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96 12 12.01l8.73-5.05" />
        <path d="M12 22.08V12" />
      </svg>
    );
    case 'users': return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
    case 'target': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
    case 'card': return (
      <svg {...common}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    );
    case 'chart': return (
      <svg {...common}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
    case 'mail': return (
      <svg {...common}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    );
    case 'refresh': return (
      <svg {...common}>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    );
    case 'gear': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
    default: return null;
  }
}
