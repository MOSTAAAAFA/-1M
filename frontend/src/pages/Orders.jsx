import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API_BASE from '../utils/api';
import { getCurrentUser } from '../utils/activity';
import { compactPrice } from '../utils/finance';
import Crest1M from '../components/Crest1M';
import Brand1M from '../components/Brand1M';

const STATUS_COLORS = {
  pending: '#f59e0b',
  processing: '#60a5fa',
  shipped: '#a78bfa',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(!!getCurrentUser());

  const user = getCurrentUser();

  useEffect(() => {
    let cancelled = false;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders`, { credentials: 'include' });
        if (res.status === 401) {
          if (!cancelled) setSignedIn(false);
          return;
        }
        const data = await res.json();
        const all = data.orders || [];
        // Only show this user's orders (orders without a user are treated as demo/admin)
        const mine = user && user.id
          ? all.filter(o => String(o.user) === String(user.id))
          : [];
        if (!cancelled) setOrders(mine);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const stat = (label, value, suffix) => (
    <div style={{
      flex: '1 1 160px',
      minWidth: 140,
      padding: '22px 24px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(201,168,76,0.2)',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)' }}>{label}</p>
      <p style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontSize: 26,
        fontWeight: 700,
        color: 'var(--gold)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {value}{suffix}
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        padding: '40px 20px 80px',
        maxWidth: 900,
        margin: '0 auto',
        background: 'linear-gradient(135deg, #050507 0%, #0a0a0e 100%)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gold)' }}>
          <Crest1M size={20} /> <Brand1M style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C' }} /> MOTORS
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 46px)', fontWeight: 700, color: 'var(--white)', margin: '0 0 8px' }}>
          Your Orders
        </h1>
        <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '1px', color: 'rgba(240,237,232,0.5)' }}>
          Track your purchases, payments and delivery status.
        </p>
      </div>

      {!signedIn ? (
        <div style={{
          padding: '60px 32px',
          textAlign: 'center',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
          border: '1px solid rgba(201,168,76,0.25)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: '0 0 8px', color: 'var(--gold)' }}>Sign in to view your orders</h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(240,237,232,0.55)', margin: '0 0 24px' }}>
            Your order history and invoices live in your account.
          </p>
          <Link to="/login" style={{
            display: 'inline-block', padding: '14px 36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #C9A84C, #E0C06A)', color: '#000', fontWeight: 700,
            fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>Sign In</Link>
        </div>
      ) : loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, margin: '0 auto 16px', borderRadius: '50%', border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid var(--gold)', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)' }}>Loading your orders...</p>
        </div>
      ) : (
        <>
          {/* Stats — compact so numbers never overflow */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40,
          }}>
            {stat('Orders', orders.length)}
            {stat('Total Spent', compactPrice(totalSpent))}
            {stat('Pending', orders.filter(o => o.status === 'pending').length)}
          </div>

          {/* Order list */}
          {orders.length === 0 ? (
            <div style={{
              padding: '56px 32px', textAlign: 'center', borderRadius: '18px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🏎️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 8px', color: 'var(--white)' }}>No orders yet</h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(240,237,232,0.5)', margin: '0 0 24px' }}>
                Your placed orders will appear here with live status.
              </p>
              <Link to="/cars" style={{
                display: 'inline-block', padding: '12px 30px', borderRadius: '10px',
                background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)',
                color: 'var(--gold)', fontWeight: 600, fontFamily: 'var(--font-ui)', fontSize: 12,
                letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
              }}>Explore the Collection</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.map((order) => (
                <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '22px 24px', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'border 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(201,168,76,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: 0, color: 'var(--white)' }}>
                        Order #{String(order._id).slice(-6)}
                      </h4>
                      <small style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(240,237,232,0.4)' }}>
                        {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 14px', borderRadius: '999px',
                        fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: STATUS_COLORS[order.status] || 'var(--gold)',
                        background: `${STATUS_COLORS[order.status] || '#C9A84C'}1a`,
                        border: `1px solid ${STATUS_COLORS[order.status] || '#C9A84C'}40`,
                      }}>{order.status || 'pending'}</span>
                    </div>
                  </div>

                  <div style={{ margin: '10px 0 14px', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(240,237,232,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                          {item.quantity > 1 && <span style={{ color: 'var(--gold)', marginLeft: 6 }}>× {item.quantity}</span>}
                        </span>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'rgba(240,237,232,0.7)', whiteSpace: 'nowrap' }}>
                          {compactPrice(Number(item.price) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(240,237,232,0.4)' }}>
                      {order.customer?.name ? `Deliver to: ${order.customer.name}` : order.user ? 'On your account' : ''}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
                      {compactPrice(order.total)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}