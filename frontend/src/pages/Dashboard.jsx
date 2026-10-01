import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import API_BASE from '../utils/api';
import { getCurrentUser } from '../utils/activity';
import { compactPrice } from '../utils/finance';
import Crest1M from '../components/Crest1M';
import Brand1M from '../components/Brand1M';

const initialsOf = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0][0] : '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || 'GM';
};

const STATUS_COLORS = {
  pending: '#f59e0b', processing: '#60a5fa', shipped: '#a78bfa',
  delivered: '#22c55e', cancelled: '#ef4444',
};

export default function Dashboard() {
  const user = getCurrentUser();
  const { favorites, cartCount } = useApp();

  const [orders, setOrders] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [ordersRes, loyaltyRes] = await Promise.all([
          fetch(`${API_BASE}/orders`, { credentials: 'include' }),
          fetch(`${API_BASE}/loyalty`, { credentials: 'include' }),
        ]);
        const ordersData = await ordersRes.json().catch(() => ({}));
        const loyaltyData = await loyaltyRes.json().catch(() => ({}));
        const all = ordersData.orders || [];
        const mine = user && user.id ? all.filter(o => String(o.user) === String(user.id)) : [];
        if (!cancelled) {
          setOrders(mine);
          if (loyaltyData.success && loyaltyData.data) setLoyalty(loyaltyData.data);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSpent = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const points = loyalty?.points ?? null;

  const stat = (label, value, icon, to) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        flex: '1 1 150px', minWidth: 140, padding: '22px 20px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.18)',
        textAlign: 'center', overflow: 'hidden', transition: 'all 0.25s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.10)'; e.currentTarget.style.border = '1px solid rgba(201,168,76,0.45)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = '1px solid rgba(201,168,76,0.18)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
        <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--gold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
      </div>
    </Link>
  );

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px 20px', background: 'linear-gradient(135deg, #050507 0%, #0a0a0e 100%)' }}>
        <div style={{ maxWidth: 620, margin: '20vh auto 0', padding: '60px 32px', textAlign: 'center', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.25)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👤</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 10px', color: 'var(--gold)' }}>Your Account Dashboard</h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(240,237,232,0.55)', margin: '0 0 24px' }}>
            Track your orders, loyalty points, favorites and garage — all in one place.
          </p>
          <Link to="/login" style={{ display: 'inline-block', padding: '14px 36px', borderRadius: '12px', background: 'linear-gradient(135deg, #C9A84C, #E0C06A)', color: '#000', fontWeight: 700, fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', padding: '40px 20px 80px', maxWidth: 960, margin: '0 auto', background: 'linear-gradient(135deg, #050507 0%, #0a0a0e 100%)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 36, padding: '28px 30px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #C9A84C, #E0C06A 55%, #F4D03F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-ui)', fontSize: 22, fontWeight: 800, color: '#0a0a0e',
            boxShadow: '0 6px 24px rgba(201,168,76,0.4)',
          }}>
            {initialsOf(user.name)}
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Welcome back
            </p>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 34px)', fontWeight: 700, color: 'var(--white)' }}>
              {user.name || 'Member'}
            </h1>
            <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(240,237,232,0.45)' }}>
              {user.email}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)' }}>Loyalty Tier</p>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>
            {loyalty ? loyalty.tier : '—'}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, margin: '0 auto 16px', borderRadius: '50%', border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid var(--gold)', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)' }}>Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 36 }}>
            {stat('Orders', orders.length, '📦', '/orders')}
            {stat('Total Spent', compactPrice(totalSpent), '💳', '/orders')}
            {stat('Points', points != null ? points.toLocaleString() : '—', '⭐', '/loyalty')}
            {stat('Favorites', favorites.length, '❤️', '/favorites')}
            {stat('In Garage', cartCount, '🛒', '/cars')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {/* Recent orders */}
            <div style={{ padding: '26px 28px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--white)' }}>Recent Orders</h3>
                <Link to="/orders" style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none' }}>View all →</Link>
              </div>
              {orders.length === 0 ? (
                <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(240,237,232,0.45)' }}>
                  No orders yet. Your purchases will appear here.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {orders.slice(0, 3).map(o => (
                    <div key={o._id} style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--white)' }}>#{String(o._id).slice(-6)}</span>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: STATUS_COLORS[o.status] || 'var(--gold)' }}>{o.status || 'pending'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(240,237,232,0.45)' }}>
                          {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>{compactPrice(o.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ padding: '26px 28px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ margin: '0 0 18px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--white)' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Explore Cars', '/cars', '🏎️'],
                  ['My Garage', '/cars', '🛒'],
                  ['Favorites', '/favorites', '❤️'],
                  ['Loyalty Rewards', '/loyalty', '⭐'],
                ].map(([label, to, icon]) => (
                  <Link key={label} to={to} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '16px 14px', borderRadius: '12px', textAlign: 'center',
                      background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
                      transition: 'all 0.25s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.14)'; e.currentTarget.style.border = '1px solid rgba(201,168,76,0.45)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)'; }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '1px', color: 'rgba(240,237,232,0.85)' }}>{label}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p style={{ margin: '40px 0 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '2px', color: 'rgba(240,237,232,0.3)' }}>
            <Crest1M size={16} /> <Brand1M style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C' }} /> MOTORS — YOUR PRIVATE SHOWROOM
          </p>
        </>
      )}
    </motion.div>
  );
}