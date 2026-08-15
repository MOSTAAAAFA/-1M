import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, typography, shadows, transitions, zIndex, components } from '../styles/designTokens';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const TAX_RATE = 0.0875;

export default function CartSidebar() {
  const { cart, cartOpen, cartTotal, setCartOpen, removeFromCart, updateQty, clearCart } = useApp();
  const navigate = useNavigate();
  const tax = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + tax;

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setCartOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: zIndex.modal,
        opacity: cartOpen ? 1 : 0,
        pointerEvents: cartOpen ? 'all' : 'none',
        transition: `opacity 0.4s ${transitions.easeOut}`,
      }}/>

      {/* Drawer */}
      <aside style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 460,
        maxWidth: '100vw',
        zIndex: zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10,10,14,0.97)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderLeft: `1px solid ${colors.border}`,
        transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: `transform ${transitions.duration.slow} ${transitions.easeOut}`,
        boxShadow: shadows.lg,
      }}>

        {/* Header */}
        <div style={{
          padding: `${spacing['3xl']} ${spacing['3xl']} ${spacing.xl}`,
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontFamily: typography.fontUI, fontSize: typography.fontSize.xs, letterSpacing: typography.letterSpacing.extreme, textTransform: 'uppercase', color: colors.gold, marginBottom: spacing.xs }}>
              MY GARAGE
            </p>
            <h2 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.white }}>
              {cart.length} {cart.length === 1 ? 'Vehicle' : 'Vehicles'}
            </h2>
          </div>

          <button onClick={() => setCartOpen(false)} style={{
            width: 40, height: 40, borderRadius: radius.full,
            background: colors.white10,
            border: `1px solid ${colors.border2}`,
            color: colors.white40,
            fontSize: typography.fontSize.lg, cursor: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: transitions.default,
          }}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: `${spacing.sm} 0` }}>
          {cart.length === 0 ? <EmptyState /> : cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => removeFromCart(item.id)}
              onQtyChange={(qty) => updateQty(item.id, qty)}
              onNavigate={() => { setCartOpen(false); navigate(`/car/${item.id}`); }}
            />
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: `${spacing.xl} ${spacing['3xl']} ${spacing['3xl']}`,
            borderTop: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}>

            {/* Summary lines */}
            {[
              { label: 'Subtotal', value: fmt(cartTotal) },
              { label: `Est. Tax (${(TAX_RATE * 100).toFixed(2)}%)`, value: fmt(tax) },
              { label: 'Delivery & Registration', value: 'TBD at checkout' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.white40 }}>{label}</span>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.white70 }}>{value}</span>
              </div>
            ))}

            <div style={{ height: 1, background: colors.border, margin: `${spacing.lg} 0` }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
              <span style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.white }}>
                Total (Est.)
              </span>
              <span style={{
                fontFamily: typography.fontDisplay, fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold,
                ...components.goldText,
              }}>{fmt(grandTotal)}</span>
            </div>

            <button
              onClick={() => {
                setCartOpen(false);
                navigate('/checkout');
              }}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', marginBottom: spacing.md, fontSize: typography.fontSize.sm }}
            >
              Proceed to Purchase
            </button>

            <button
              onClick={clearCart}
              style={{
                width: '100%', padding: spacing.md, background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                color: colors.white20, fontFamily: typography.fontUI,
                fontSize: 11, fontWeight: typography.fontWeight.semibold, letterSpacing: typography.letterSpacing.wider, textTransform: 'uppercase',
                cursor: 'none', transition: transitions.default,
              }}
            >
              Clear Garage
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function CartItem({ item, onRemove, onQtyChange, onNavigate }) {
  return (
    <div style={{
      display: 'flex',
      gap: spacing.lg,
      alignItems: 'center',
      padding: `${spacing.lg} ${spacing['3xl']}`,
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <div
        onClick={onNavigate}
        style={{
          width: 96, height: 60, flexShrink: 0,
          borderRadius: radius.sm, overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          background: colors.white10,
          cursor: 'none',
        }}
      >
        <img
          src={item.image || item.heroImage}
          alt={item.name}
          onError={(e) => { e.currentTarget.src = '/logos/1m-mark.svg'; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: typography.fontUI, fontSize: 10, letterSpacing: typography.letterSpacing.wider, textTransform: 'uppercase', color: colors.gold, marginBottom: 2 }}>
          {item.brand || '1M Motors'}
        </p>
        <p onClick={onNavigate} style={{
          fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold,
          color: colors.white, marginBottom: 8, cursor: 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{item.name}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, border: `1px solid ${colors.border2}`, borderRadius: radius.full, padding: '2px 6px' }}>
            <button
              onClick={() => onQtyChange(item.qty - 1)}
              aria-label={`Decrease quantity of ${item.name}`}
              style={{ width: 22, height: 22, borderRadius: radius.full, background: 'transparent', border: 'none', color: colors.white70, fontSize: typography.fontSize.lg, lineHeight: 1, cursor: 'none', transition: transitions.default }}
            >−</button>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.white, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
            <button
              onClick={() => onQtyChange(item.qty + 1)}
              aria-label={`Increase quantity of ${item.name}`}
              style={{ width: 22, height: 22, borderRadius: radius.full, background: 'transparent', border: 'none', color: colors.white70, fontSize: typography.fontSize.lg, lineHeight: 1, cursor: 'none', transition: transitions.default }}
            >+</button>
          </div>
          <span style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.white }}>
            {fmt(item.price * item.qty)}
          </span>
        </div>
      </div>

      <button
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
        style={{
          flexShrink: 0,
          width: 30, height: 30, borderRadius: radius.full,
          background: colors.white10, border: `1px solid ${colors.border2}`,
          color: colors.white40, fontSize: 11, lineHeight: 1,
          cursor: 'none', transition: transitions.default,
        }}
      >✕</button>
    </div>
  );
}

function EmptyState() {
  const { setCartOpen } = useApp();
  const navigate = useNavigate();
  return (
    <div style={{ padding: spacing['3xl'], textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, margin: '0 auto 24px', borderRadius: radius.full,
        background: colors.white10, border: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color: colors.white40,
      }}>⚿</div>
      <p style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.white, marginBottom: spacing.sm }}>
        Your Garage is empty
      </p>
      <p style={{ fontSize: typography.fontSize.sm, color: colors.white40, marginBottom: spacing.xl }}>
        Add a masterpiece to begin your collection.
      </p>
      <button
        className="btn btn-gold"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => { setCartOpen(false); navigate('/cars'); }}
      >Browse Collection</button>
    </div>
  );
}