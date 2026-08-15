import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import API_BASE from '../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {
          totalOrders: 156,
          totalRevenue: 24500000,
          totalUsers: 1243,
          totalProducts: 21,
          pendingOrders: 12,
          completedOrders: 144,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data on error
      setStats({
        totalOrders: 156,
        totalRevenue: 24500000,
        totalUsers: 1243,
        totalProducts: 21,
        pendingOrders: 12,
        completedOrders: 144,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, change, color = 'var(--gold)' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(17,17,23,0.8)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 120,
        height: 120,
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'rgba(201,168,76,0.15)',
            color: 'var(--gold)',
          }}>
            <AdminStatIcon name={icon} />
          </div>
          {change && (
            <div style={{
              padding: '4px 12px',
              background: change > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${change > 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: '8px',
              fontSize: 12,
              fontWeight: 600,
              color: change > 0 ? '#22c55e' : '#ef4444',
            }}>
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>

        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 8,
          fontFamily: 'var(--font-ui)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {title}
        </p>

        <p style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#fff',
          margin: 0,
          fontFamily: 'var(--font-display)',
        }}>
          {value}
        </p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}>
              <div style={{
                width: 60,
                height: 60,
                border: '4px solid rgba(201,168,76,0.2)',
                borderTop: '4px solid var(--gold)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}/>
              <p style={{
                color: 'var(--gold)',
                fontSize: 14,
                fontFamily: 'var(--font-ui)',
                letterSpacing: '2px',
              }}>
                LOADING DASHBOARD...
              </p>
            </div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <h2 style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#fff',
            marginBottom: 8,
            fontFamily: 'var(--font-display)',
          }}>
            Dashboard Overview
          </h2>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
          }}>
            Monitor your business metrics and performance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 40,
        }}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="box"
            change={12.5}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon="money"
            change={8.3}
            color="#22c55e"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="users"
            change={15.2}
            color="#3b82f6"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="car"
            change={5.0}
            color="#f59e0b"
          />
        </div>

        {/* Secondary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          <div style={{
            background: 'rgba(17,17,23,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <p style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Pending Orders
            </p>
            <p style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#f59e0b',
              margin: 0,
            }}>
              {stats.pendingOrders}
            </p>
          </div>

          <div style={{
            background: 'rgba(17,17,23,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <p style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Completed Orders
            </p>
            <p style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#22c55e',
              margin: 0,
            }}>
              {stats.completedOrders}
            </p>
          </div>

          <div style={{
            background: 'rgba(17,17,23,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <p style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Conversion Rate
            </p>
            <p style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#3b82f6',
              margin: 0,
            }}>
              12.5%
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 40 }}
        >
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#fff',
            marginBottom: 20,
            fontFamily: 'var(--font-display)',
          }}>
            Quick Actions
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { label: 'Add New Car', icon: 'plus', link: '/admin/cars' },
              { label: 'View Orders', icon: 'clipboard', link: '/admin/orders' },
              { label: 'Manage Users', icon: 'user', link: '/admin/users' },
              { label: 'Settings', icon: 'gear', link: '/admin/settings' },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => window.location.href = action.link}
                style={{
                  padding: '20px',
                  background: 'rgba(201,168,76,0.05)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
                  e.currentTarget.style.border = '1px solid rgba(201,168,76,0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
                  e.currentTarget.style.border = '1px solid rgba(201,168,76,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--gold)' }}><AdminStatIcon name={action.icon} /></span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#fff',
            marginBottom: 20,
            fontFamily: 'var(--font-display)',
          }}>
            Recent Activity
          </h3>

          <div style={{
            background: 'rgba(17,17,23,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(201,168,76,0.1)',
              background: 'rgba(201,168,76,0.05)',
            }}>
              <p style={{
                fontSize: 12,
                color: 'var(--gold)',
                margin: 0,
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                Latest Updates
              </p>
            </div>

            <div style={{ padding: '12px' }}>
              {[
                { type: 'order', message: 'New order #1245 received', time: '5 min ago', icon: 'box' },
                { type: 'user', message: 'New user registration: john@example.com', time: '12 min ago', icon: 'user' },
                { type: 'product', message: 'Product "Porsche 911 GT3" updated', time: '1 hour ago', icon: 'car' },
                { type: 'review', message: 'New review on "Porsche Cayenne"', time: '2 hours ago', icon: 'star' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: idx < 3 ? '8px' : 0,
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--gold)' }}><AdminStatIcon name={activity.icon} /></span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: 14,
                      color: '#fff',
                      margin: 0,
                      marginBottom: 4,
                    }}>
                      {activity.message}
                    </p>
                    <p style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.4)',
                      margin: 0,
                    }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}

function AdminStatIcon({ name }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  switch (name) {
    case 'box': return (
      <svg {...common}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96 12 12.01l8.73-5.05" />
        <path d="M12 22.08V12" />
      </svg>
    );
    case 'money': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10" />
        <path d="M15 9.5c-.5-.8-1.7-1.5-3-1.5s-2.5.7-2.5 1.5.9 1.3 2.5 1.5 3 .8 3 1.6-1.7 1.6-3 1.6-2.5-.7-3-1.5" />
      </svg>
    );
    case 'users': case 'user': return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
    case 'car': return (
      <svg {...common}>
        <path d="M5 17H3v-6l2-5h14l2 5v6h-2" />
        <path d="M3 17h18" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
      </svg>
    );
    case 'star': return (
      <svg {...common}>
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
    case 'plus': return (
      <svg {...common}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    );
    case 'clipboard': return (
      <svg {...common}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="16" x2="16" y2="16" />
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
