import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import AnimatedCounter from '../components/AnimatedCounter';
import API_BASE from '../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setLastUpdate(new Date());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F4D03F',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#22c55e',
      completed: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status?.toLowerCase()] || '#6b7280';
  };

  if (loading && !stats) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 80,
                  height: 80,
                  border: '6px solid rgba(201,168,76,0.1)',
                  borderTop: '6px solid #C9A84C',
                  borderRight: '6px solid #E0C06A',
                  borderRadius: '50%',
                }}
              />
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  color: '#C9A84C',
                  fontSize: 15,
                  fontFamily: 'var(--font-ui)',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Loading Dashboard
              </motion.p>
            </motion.div>
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  if (error && !stats) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              padding: 40,
            }}
          >
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '2px solid rgba(239,68,68,0.3)',
              borderRadius: 20,
              padding: 48,
              textAlign: 'center',
              maxWidth: 500,
              backdropFilter: 'blur(20px)',
            }}>
              <ErrorIcon />
              <h3 style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#ef4444',
                marginTop: 24,
                marginBottom: 12,
              }}>
                Connection Error
              </h3>
              <p style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.7)',
                marginBottom: 32,
                lineHeight: 1.6,
              }}>
                {error}
              </p>
              <button
                onClick={fetchDashboardData}
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#000',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Retry Connection
              </button>
            </div>
          </motion.div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 40 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <h1 style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: 8,
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(135deg, #fff 0%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Dashboard Overview
                </h1>
                <p style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0,
                  fontFamily: 'var(--font-ui)',
                }}>
                  Real-time business intelligence and analytics
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                background: 'rgba(17,17,23,0.8)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 12,
                backdropFilter: 'blur(20px)',
              }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 12px rgba(34,197,94,0.6)',
                  }}
                />
                <span style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-ui)',
                }}>
                  Updated {formatRelativeTime(lastUpdate)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginBottom: 48,
          }}>
            <HeroStatCard
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              prefix="$"
              icon="money"
              gradient="linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)"
              delay={0}
            />
            <HeroStatCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon="box"
              gradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
              delay={0.1}
            />
            <HeroStatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon="users"
              gradient="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
              delay={0.2}
            />
            <HeroStatCard
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon="car"
              gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
              delay={0.3}
            />
          </div>

          {/* Today's Metrics */}
          {stats?.today && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(224,192,106,0.05) 100%)',
                border: '2px solid rgba(201,168,76,0.3)',
                borderRadius: 20,
                padding: 32,
                marginBottom: 48,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <h2 style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#C9A84C',
                marginBottom: 24,
                fontFamily: 'var(--font-display)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                Today's Performance
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 24,
              }}>
                <TodayMetric
                  label="Orders"
                  value={stats.today.orders || 0}
                  icon="box"
                  color="#3b82f6"
                />
                <TodayMetric
                  label="Revenue"
                  value={formatCurrency(stats.today.revenue || 0)}
                  icon="money"
                  color="#C9A84C"
                  isCounter={false}
                />
                <TodayMetric
                  label="New Users"
                  value={stats.today.users || 0}
                  icon="users"
                  color="#8b5cf6"
                />
                <TodayMetric
                  label="Reviews"
                  value={stats.today.reviews || 0}
                  icon="star"
                  color="#f59e0b"
                />
              </div>
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: 32,
            marginBottom: 48,
          }}>
            {/* Revenue Trends Chart */}
            {stats?.revenueTrends && stats.revenueTrends.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  background: 'rgba(17,17,23,0.8)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 20,
                  padding: 32,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 24,
                  fontFamily: 'var(--font-display)',
                }}>
                  Revenue Trends (30 Days)
                </h3>
                <RevenueChart data={stats.revenueTrends.slice(-30)} />
              </motion.div>
            )}

            {/* Order Status Breakdown */}
            {stats?.ordersByStatus && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  background: 'rgba(17,17,23,0.8)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 20,
                  padding: 32,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 24,
                  fontFamily: 'var(--font-display)',
                }}>
                  Order Status Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { status: 'pending', count: stats.pendingOrders || 0, label: 'Pending' },
                    { status: 'processing', count: stats.processingOrders || 0, label: 'Processing' },
                    { status: 'shipped', count: stats.shippedOrders || 0, label: 'Shipped' },
                    { status: 'delivered', count: stats.deliveredOrders || 0, label: 'Delivered' },
                    { status: 'completed', count: stats.completedOrders || 0, label: 'Completed' },
                    { status: 'cancelled', count: stats.cancelledOrders || 0, label: 'Cancelled' },
                  ].map((item, idx) => (
                    <OrderStatusRow
                      key={item.status}
                      status={item.status}
                      label={item.label}
                      count={item.count}
                      total={stats.totalOrders || 1}
                      color={getStatusColor(item.status)}
                      delay={idx * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Secondary Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginBottom: 48,
          }}>
            <SecondaryMetricCard
              label="Avg Order Value"
              value={formatCurrency(stats?.avgOrderValue || 0)}
              icon="money"
              delay={0.6}
            />
            <SecondaryMetricCard
              label="Conversion Rate"
              value={`${(stats?.conversionRate || 0).toFixed(1)}%`}
              icon="trending"
              delay={0.65}
            />
            <SecondaryMetricCard
              label="Avg Rating"
              value={(stats?.avgRating || 0).toFixed(1)}
              icon="star"
              delay={0.7}
            />
            <SecondaryMetricCard
              label="Total Reviews"
              value={stats?.totalReviews || 0}
              icon="reviews"
              delay={0.75}
            />
          </div>

          {/* Bottom Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: 32,
          }}>
            {/* Recent Activity */}
            {stats?.recentActivity && stats.recentActivity.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                  background: 'rgba(17,17,23,0.8)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div style={{
                  padding: '24px 32px',
                  borderBottom: '1px solid rgba(201,168,76,0.15)',
                  background: 'rgba(201,168,76,0.08)',
                }}>
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#fff',
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                  }}>
                    Recent Activity
                  </h3>
                </div>
                <div style={{ padding: 20, maxHeight: 400, overflowY: 'auto' }}>
                  {stats.recentActivity.slice(0, 8).map((activity, idx) => (
                    <ActivityItem
                      key={idx}
                      type={activity.type}
                      message={activity.message}
                      time={activity.time}
                      icon={activity.icon}
                      delay={idx * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Top Products */}
            {stats?.topProductsByRevenue && stats.topProductsByRevenue.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                  background: 'rgba(17,17,23,0.8)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div style={{
                  padding: '24px 32px',
                  borderBottom: '1px solid rgba(201,168,76,0.15)',
                  background: 'rgba(201,168,76,0.08)',
                }}>
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#fff',
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                  }}>
                    Top Products by Revenue
                  </h3>
                </div>
                <div style={{ padding: 20 }}>
                  {stats.topProductsByRevenue.slice(0, 5).map((product, idx) => (
                    <ProductRow
                      key={product._id || idx}
                      name={product.name || 'Unknown Product'}
                      revenue={product.revenue || 0}
                      unitsSold={product.count || 0}
                      delay={idx * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}

function HeroStatCard({ title, value, prefix = '', icon, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      style={{
        background: 'rgba(17,17,23,0.9)',
        border: '2px solid rgba(201,168,76,0.25)',
        borderRadius: 20,
        padding: 32,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: gradient,
        opacity: 0.1,
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 8px 24px rgba(201,168,76,0.3)',
        }}>
          <Icon name={icon} size={28} color="#000" />
        </div>

        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 8,
          fontFamily: 'var(--font-ui)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontWeight: 600,
        }}>
          {title}
        </p>

        <div style={{
          fontSize: 44,
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'var(--font-display)',
          lineHeight: 1,
        }}>
          {prefix && <span style={{ color: '#C9A84C' }}>{prefix}</span>}
          <AnimatedCounter
            to={value}
            duration={2000}
            separator=","
          />
        </div>
      </div>
    </motion.div>
  );
}

function TodayMetric({ label, value, icon, color, isCounter = true }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon name={icon} size={20} color={color} />
        </div>
        <span style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          fontFamily: 'var(--font-ui)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontSize: 32,
        fontWeight: 700,
        color: '#fff',
        fontFamily: 'var(--font-display)',
      }}>
        {isCounter ? (
          <AnimatedCounter to={typeof value === 'number' ? value : 0} duration={1500} separator="," />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.4)',
      }}>
        No data available
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue || 0));
  const width = 100;
  const height = 200;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((d.revenue / maxRevenue) * (height - 2 * padding) + padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 200 }}
        aria-label="Revenue trends chart"
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          points={`${padding},${height} ${points} ${width - padding},${height}`}
          fill="url(#revenueGradient)"
        />

        <motion.polyline
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          points={points}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - ((d.revenue / maxRevenue) * (height - 2 * padding) + padding);
          return (
            <motion.circle
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.02, duration: 0.3 }}
              cx={x}
              cy={y}
              r="2.5"
              fill="#E0C06A"
              stroke="#C9A84C"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <div style={{
        marginTop: 16,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
      }}>
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function OrderStatusRow({ status, label, count, total, color, delay }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 8px ${color}60`,
              }}
            />
            <span style={{
              fontSize: 14,
              color: '#fff',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}>
              {label}
            </span>
          </div>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: color,
          }}>
            <AnimatedCounter to={count} duration={1500} />
          </span>
        </div>
        <div style={{
          height: 6,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: color,
              borderRadius: 3,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function SecondaryMetricCard({ label, value, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      style={{
        background: 'rgba(17,17,23,0.6)',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: 16,
        padding: 24,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'rgba(201,168,76,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon name={icon} size={18} color="#C9A84C" />
        </div>
        <span style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-ui)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {label}
        </span>
      </div>
      <p style={{
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        margin: 0,
        fontFamily: 'var(--font-display)',
      }}>
        {value}
      </p>
    </motion.div>
  );
}

function ActivityItem({ type, message, time, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        padding: 16,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.02)',
        marginBottom: 12,
        border: '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div style={{
        minWidth: 36,
        height: 36,
        borderRadius: 8,
        background: 'rgba(201,168,76,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color="#C9A84C" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14,
          color: '#fff',
          margin: 0,
          marginBottom: 4,
          lineHeight: 1.4,
        }}>
          {message}
        </p>
        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.4)',
          margin: 0,
        }}>
          {time}
        </p>
      </div>
    </motion.div>
  );
}

function ProductRow({ name, revenue, unitsSold, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        padding: '16px 0',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <p style={{
          fontSize: 15,
          fontWeight: 500,
          color: '#fff',
          margin: 0,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </p>
        <p style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#C9A84C',
          margin: 0,
          fontFamily: 'var(--font-display)',
        }}>
          <AnimatedCounter
            to={revenue}
            prefix="$"
            duration={1500}
            separator=","
          />
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Icon name="box" size={14} color="rgba(255,255,255,0.4)" />
        <span style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
        }}>
          <AnimatedCounter to={unitsSold} duration={1500} /> units sold
        </span>
      </div>
    </motion.div>
  );
}

function Icon({ name, size = 24, color = 'currentColor' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const icons = {
    money: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M15 9.5c-.5-.8-1.7-1.5-3-1.5s-2.5.7-2.5 1.5.9 1.3 2.5 1.5 3 .8 3 1.6-1.7 1.6-3 1.6-2.5-.7-3-1.5" />
      </svg>
    ),
    box: (
      <svg {...common}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
    users: (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    car: (
      <svg {...common}>
        <path d="M5 17H3v-6l2-5h14l2 5v6h-2" />
        <path d="M3 17h18" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
      </svg>
    ),
    star: (
      <svg {...common}>
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    trending: (
      <svg {...common}>
        <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
        <path d="M16 7h6v6" />
      </svg>
    ),
    reviews: (
      <svg {...common}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function ErrorIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ margin: '0 auto' }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
