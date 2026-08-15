import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const TAX_RATE = 0.0875;

/* ─────────────────────────────────────────────
   STEP DEFINITIONS
───────────────────────────────────────────── */
const STEPS = [
  { id: 1, code: 'INFO',    label: 'Personal Info',  icon: '◈' },
  { id: 2, code: 'PAYMENT', label: 'Payment',         icon: '◉' },
  { id: 3, code: 'REVIEW',  label: 'Review & Confirm',icon: '◆' },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [info, setInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  });

  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
    bankName: '', accountHolder: '',
  });

  const tax = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + tax;

  // If cart empty, go back (unless we just completed)
  useEffect(() => {
    if (!done && cart.length === 0) navigate('/');
  }, [cart, done, navigate]);

  const goTo = (next) => {
    setAnimating(true);
    setTimeout(() => { setStep(next); setAnimating(false); }, 300);
  };

  const handleConfirm = () => {
    setAnimating(true);
    setTimeout(() => {
      setDone(true);
      clearCart();
      setAnimating(false);
    }, 400);
  };

  if (done) return <SuccessScreen onHome={() => navigate('/')} total={grandTotal} />;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black, #08080b)',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      {/* ── Background ambience ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 20% 0%, rgba(201,168,76,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 100%, rgba(201,168,76,0.05) 0%, transparent 60%)
        `,
      }} />

      {/* Decorative grid lines */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* ── Header ── */}
      <header
        role="banner"
        aria-label="Checkout header"
        style={{
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,11,0.9)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '20px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', fontSize: 13,
              fontFamily: 'var(--font-ui)', letterSpacing: '1px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <span style={{ fontSize: 18 }}>←</span> Back
          </button>

          {/* Logo / Title */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: '4px',
              textTransform: 'uppercase', color: 'var(--gold)',
            }}>Secure Checkout</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
              color: 'rgba(255,255,255,0.95)', marginTop: 3,
            }}>Complete Your Acquisition</h1>
          </div>

          {/* Lock badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 40,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '1.5px', color: 'var(--gold)' }}>
              SSL SECURED
            </span>
          </div>
        </div>
      </header>

      {/* ── Progress Bar ── */}
      <div
        role="navigation"
        aria-label="Checkout progress"
        style={{
        position: 'relative', zIndex: 10,
        maxWidth: 1280, margin: '0 auto',
        padding: '36px 40px 0',
      }}>
        <StepProgress currentStep={step} />
      </div>

      {/* ── Main Content ── */}
      <main style={{
        position: 'relative', zIndex: 10,
        maxWidth: 1280, margin: '0 auto',
        padding: '40px 40px 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 40,
        alignItems: 'start',
      }}>

        {/* Left — Step Panel */}
        <div style={{
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}>
          {step === 1 && (
            <PersonalInfoStep
              data={info}
              onChange={setInfo}
              onNext={() => goTo(2)}
            />
          )}
          {step === 2 && (
            <PaymentStep
              data={payment}
              onChange={setPayment}
              onNext={() => goTo(3)}
              onBack={() => goTo(1)}
            />
          )}
          {step === 3 && (
            <ReviewStep
              info={info}
              payment={payment}
              cart={cart}
              cartTotal={cartTotal}
              tax={tax}
              grandTotal={grandTotal}
              onBack={() => goTo(2)}
              onConfirm={handleConfirm}
            />
          )}
        </div>

        {/* Right — Order Summary */}
        <OrderSummary cart={cart} cartTotal={cartTotal} tax={tax} grandTotal={grandTotal} />
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP PROGRESS
───────────────────────────────────────────── */
function StepProgress({ currentStep }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
      {STEPS.map((s, idx) => (
        <React.Fragment key={s.id}>
          {/* Step node */}
          <div
            role="listitem"
            aria-current={currentStep === s.id ? 'step' : undefined}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700,
              transition: 'all 0.4s',
              ...(currentStep > s.id ? {
                background: 'linear-gradient(135deg, var(--gold), #e8c84a)',
                color: '#080808',
                boxShadow: '0 0 20px rgba(201,168,76,0.4)',
                border: 'none',
              } : currentStep === s.id ? {
                background: 'rgba(201,168,76,0.1)',
                border: '2px solid var(--gold)',
                color: 'var(--gold)',
                boxShadow: '0 0 30px rgba(201,168,76,0.2)',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.2)',
              }),
            }}>
              {currentStep > s.id ? '✓' : s.icon}
            </div>
            <p style={{
              marginTop: 10, fontSize: 10, letterSpacing: '1.5px',
              textTransform: 'uppercase', fontFamily: 'var(--font-ui)',
              color: currentStep >= s.id ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
              transition: 'color 0.4s', whiteSpace: 'nowrap',
            }}>{s.label}</p>
          </div>

          {/* Connector */}
          {idx < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 1, margin: '0 12px', marginBottom: 20,
              background: currentStep > s.id
                ? 'linear-gradient(90deg, var(--gold), rgba(201,168,76,0.4))'
                : 'rgba(255,255,255,0.08)',
              transition: 'background 0.5s',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORDER SUMMARY SIDEBAR
───────────────────────────────────────────── */
function OrderSummary({ cart, cartTotal, tax, grandTotal }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      overflow: 'hidden',
      position: 'sticky',
      top: 120,
    }}>
      <div style={{
        padding: '24px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: '3px', color: 'var(--gold)', marginBottom: 4 }}>
          ORDER SUMMARY
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
          {cart.length} {cart.length === 1 ? 'Vehicle' : 'Vehicles'}
        </h3>
      </div>

      {/* Items */}
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {cart.map(item => (
          <div key={item.id} style={{
            display: 'flex', gap: 14,
            padding: '16px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{
              width: 64, height: 44, borderRadius: 8, overflow: 'hidden',
              flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 9, letterSpacing: '2px', color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>{item.brand}</p>
              <p style={{
                fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-display)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{item.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Qty: {item.qty}</p>
            </div>
            <p style={{
              fontSize: 14, fontWeight: 600, flexShrink: 0,
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, var(--gold), #e8c84a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{fmt(item.price * item.qty)}</p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ padding: '20px 28px 24px' }}>
        {[
          { label: 'Subtotal', value: fmt(cartTotal) },
          { label: `Tax (${(TAX_RATE * 100).toFixed(2)}%)`, value: fmt(tax) },
          { label: 'Delivery', value: 'Included' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-ui)' }}>{label}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-ui)' }}>{value}</span>
          </div>
        ))}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            Grand Total
          </span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
            background: 'linear-gradient(135deg, var(--gold), #e8c84a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{fmt(grandTotal)}</span>
        </div>

        {/* Trust badges */}
        <div style={{
          marginTop: 24,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {[
            { icon: 'shield', text: 'Buyer Protection Guarantee' },
            { icon: 'delivery', text: 'White-Glove Delivery' },
            { icon: 'return', text: '7-Day Return Policy' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'flex', color: 'var(--gold)' }}><CheckoutInfoIcon name={icon} /></span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-ui)', letterSpacing: '0.5px' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 1 — PERSONAL INFO
───────────────────────────────────────────── */
function PersonalInfoStep({ data, onChange, onNext }) {
  const set = (k) => (e) => onChange(prev => ({ ...prev, [k]: e.target.value }));

  const isValid = data.firstName && data.lastName && data.email && data.phone
    && data.address && data.city && data.zip;

  return (
    <div>
      <SectionHeader icon="◈" title="Personal Information" subtitle="Your details for registration & delivery" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label="First Name" value={data.firstName} onChange={set('firstName')} placeholder="John" />
        <Field label="Last Name" value={data.lastName} onChange={set('lastName')} placeholder="Doe" />
        <Field label="Email Address" value={data.email} onChange={set('email')} placeholder="john@example.com" type="email" span={2} />
        <Field label="Phone Number" value={data.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" type="tel" />
        <Field label="Country" value={data.country} onChange={set('country')} tag="select" options={['US', 'UK', 'UAE', 'DE', 'FR', 'CA']} />
      </div>

      <SectionHeader icon="◈" title="Delivery Address" subtitle="Where we deliver your vehicle" small />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Street Address" value={data.address} onChange={set('address')} placeholder="123 Luxury Ave" span={2} />
        <Field label="City" value={data.city} onChange={set('city')} placeholder="Los Angeles" />
        <Field label="State" value={data.state} onChange={set('state')} placeholder="CA" />
        <Field label="ZIP / Postal Code" value={data.zip} onChange={set('zip')} placeholder="90210" />
      </div>

      <StepFooter>
        <NextButton onClick={onNext} disabled={!isValid}>
          Continue to Payment →
        </NextButton>
      </StepFooter>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 2 — PAYMENT
───────────────────────────────────────────── */
function PaymentStep({ data, onChange, onNext, onBack }) {
  const set = (k) => (e) => onChange(prev => ({ ...prev, [k]: e.target.value }));

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + ' / ' + digits.slice(2) : digits;
  };

  const isValid = data.method === 'card'
    ? data.cardNumber.replace(/\s/g, '').length === 16 && data.cardName && data.expiry && data.cvv.length >= 3
    : data.bankName && data.accountHolder;

  return (
    <div>
      <SectionHeader icon="◉" title="Payment Details" subtitle="Secure, encrypted payment processing" />

      {/* Method Toggle */}
      <div style={{
        display: 'flex', gap: 0,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 32,
      }}>
        {[
          { value: 'card', label: 'Credit / Debit Card' },
          { value: 'bank', label: 'Bank Transfer' },
          { value: 'crypto', label: 'Cryptocurrency' },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(prev => ({ ...prev, method: opt.value }))}
            aria-label={opt.label}
            aria-pressed={data.method === opt.value}
            style={{
              flex: 1, padding: '12px 8px',
              borderRadius: 9, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.5px', transition: 'all 0.3s',
              ...(data.method === opt.value ? {
                background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.1))',
                color: 'var(--gold)',
                boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.3)',
              } : {
                background: 'transparent',
                color: 'rgba(255,255,255,0.3)',
              }),
            }}
          >{opt.label}</button>
        ))}
      </div>

      {/* Card Form */}
      {data.method === 'card' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field
            label="Card Number" span={2}
            value={formatCard(data.cardNumber)}
            onChange={e => onChange(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
            placeholder="4242 4242 4242 4242"
          />
          <Field label="Cardholder Name" value={data.cardName} onChange={set('cardName')} placeholder="JOHN DOE" span={2} />
          <Field
            label="Expiry Date"
            value={data.expiry}
            onChange={e => onChange(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
            placeholder="MM / YY"
          />
          <Field
            label="CVV / CVC"
            value={data.cvv}
            onChange={e => onChange(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
            placeholder="•••"
            type="password"
          />
          {/* Card art mockup */}
          <div style={{
            gridColumn: 'span 2',
            marginTop: 8,
            padding: '24px 28px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #1a1408, #2a1f0a)',
            border: '1px solid rgba(201,168,76,0.25)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.2)',
            minHeight: 120,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -30, right: -30,
              width: 160, height: 160, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
            }} />
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: '3px',
                color: 'rgba(201,168,76,0.6)', marginBottom: 8,
              }}>LUXURY MOTORS</p>
              <p style={{
                fontFamily: '"Courier New", monospace', fontSize: 16, letterSpacing: '3px',
                color: 'rgba(255,255,255,0.8)',
              }}>
                {(data.cardNumber || '').padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', fontFamily: 'var(--font-ui)' }}>VALID</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: '"Courier New", monospace', letterSpacing: '2px' }}>
                {data.expiry || 'MM / YY'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer */}
      {data.method === 'bank' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Bank Name" value={data.bankName} onChange={set('bankName')} placeholder="Chase, BofA..." span={2} />
          <Field label="Account Holder" value={data.accountHolder} onChange={set('accountHolder')} placeholder="Full legal name" span={2} />
          <div style={{
            gridColumn: 'span 2',
            padding: '20px 24px',
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 12,
          }}>
            <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.9)', fontFamily: 'var(--font-ui)', letterSpacing: '1px', marginBottom: 8 }}>
              BANK TRANSFER DETAILS
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
              Our team will send wire transfer instructions to your registered email within 24 hours.
              Funds must clear before delivery is scheduled.
            </p>
          </div>
        </div>
      )}

      {/* Crypto */}
      {data.method === 'crypto' && (
        <div style={{
          padding: '40px', textAlign: 'center',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
        }}>
          <div style={{
            width: 48, height: 48, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(201,168,76,0.12)', borderRadius: 12, color: 'var(--gold)', margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v2" /><path d="M12 19v2" /><path d="M5 12H3" /><path d="M21 12h-2" /><path d="m6 6 1.5 1.5" /><path d="m16.5 16.5 1.5 1.5" /><path d="m18 6-1.5 1.5" /><path d="m7.5 16.5 1.5 1.5" /><circle cx="12" cy="12" r="4" /><path d="M12 8a4 4 0 1 0 4 4" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
            Crypto Payment
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
            We accept BTC, ETH & USDT.<br />
            A wallet address will be generated after you confirm your order.
          </p>
        </div>
      )}

      <StepFooter>
        <BackButton onClick={onBack} />
        <NextButton onClick={onNext} disabled={!isValid}>
          Review Order →
        </NextButton>
      </StepFooter>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — REVIEW
───────────────────────────────────────────── */
function ReviewStep({ info, payment, cart, cartTotal, tax, grandTotal, onBack, onConfirm }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { onConfirm(); }, 1800);
  };

  const maskedCard = payment.cardNumber
    ? '•••• •••• •••• ' + payment.cardNumber.slice(-4)
    : '—';

  return (
    <div>
      <SectionHeader icon="◆" title="Review Your Order" subtitle="Everything looks correct? Confirm your purchase." />

      {/* Info Summary */}
      <ReviewCard title="Delivery Information">
        <ReviewRow label="Name" value={`${info.firstName} ${info.lastName}`} />
        <ReviewRow label="Email" value={info.email} />
        <ReviewRow label="Phone" value={info.phone} />
        <ReviewRow label="Address" value={`${info.address}, ${info.city}, ${info.state} ${info.zip}, ${info.country}`} />
      </ReviewCard>

      {/* Payment Summary */}
      <ReviewCard title="Payment Method">
        <ReviewRow label="Method" value={payment.method === 'card' ? 'Credit / Debit Card' : payment.method === 'bank' ? 'Bank Transfer' : 'Cryptocurrency'} />
        {payment.method === 'card' && <ReviewRow label="Card" value={maskedCard} />}
        {payment.method === 'card' && <ReviewRow label="Cardholder" value={payment.cardName} />}
      </ReviewCard>

      {/* Total */}
      <div style={{
        padding: '20px 24px',
        background: 'rgba(201,168,76,0.05)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: 12,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)' }}>Subtotal</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{fmt(cartTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)' }}>Tax</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{fmt(tax)}</span>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Total</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(135deg, var(--gold), #e8c84a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Agreement */}
      <label
        htmlFor="terms-agreement"
        style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        marginBottom: 28, cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          id="terms-agreement"
          checked={agreed}
          onChange={() => setAgreed(v => !v)}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2,
            border: `2px solid ${agreed ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
            background: agreed ? 'var(--gold)' : 'transparent',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {agreed && <span style={{ fontSize: 11, color: '#080808', fontWeight: 700 }}>✓</span>}
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
          I agree to the <span style={{ color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Sale</span>,{' '}
          <span style={{ color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>, and understand
          this is a legally binding purchase agreement.
        </span>
      </label>

      <StepFooter>
        <BackButton onClick={onBack} />
        <button
          onClick={handleConfirm}
          disabled={!agreed || loading}
          aria-label={`Confirm purchase of ${fmt(grandTotal)}`}
          style={{
            flex: 1, padding: '16px 32px',
            background: agreed && !loading
              ? 'linear-gradient(135deg, #c9a84c, #e8c84a)'
              : 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: 12,
            color: agreed && !loading ? '#080808' : 'rgba(255,255,255,0.2)',
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
            cursor: agreed && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: agreed && !loading ? '0 0 40px rgba(201,168,76,0.3)' : 'none',
          }}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Processing…
            </>
          ) : (
            `Confirm Purchase · ${fmt(grandTotal)}`
          )}
        </button>
      </StepFooter>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUCCESS SCREEN
───────────────────────────────────────────── */
function SuccessScreen({ onHome, total }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black, #08080b)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)',
      }} />

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative', zIndex: 10,
        maxWidth: 560,
      }}>
        {/* Icon */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%', margin: '0 auto 32px',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
          border: '2px solid rgba(201,168,76,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(201,168,76,0.2)',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '4px',
          textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16,
        }}>Order Confirmed</p>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700,
          color: 'rgba(255,255,255,0.95)', lineHeight: 1.1, marginBottom: 16,
        }}>
          Your Vehicle<br />is Reserved
        </h1>

        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 12,
        }}>
          Thank you for your purchase. A confirmation has been sent to your email.
          Our concierge team will contact you within 24 hours to coordinate delivery.
        </p>

        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
          marginBottom: 40,
          background: 'linear-gradient(135deg, var(--gold), #e8c84a)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>{fmt(total)} Authorized</p>

        <button
          onClick={onHome}
          style={{
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #c9a84c, #e8c84a)',
            border: 'none', borderRadius: 12,
            color: '#080808', fontFamily: 'var(--font-ui)',
            fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.3s',
            boxShadow: '0 0 40px rgba(201,168,76,0.3)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Explore More Vehicles
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARED HELPERS
───────────────────────────────────────────── */
function SectionHeader({ icon, title, subtitle, small }) {
  return (
    <div style={{ marginBottom: small ? 20 : 28, marginTop: small ? 28 : 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ color: 'var(--gold)', fontSize: small ? 14 : 18 }}>{icon}</span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: small ? 18 : 26, fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
        }}>{title}</h2>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', paddingLeft: small ? 26 : 30 }}>{subtitle}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', span, tag, options }) {
  const [focused, setFocused] = useState(false);
  const inputId = `field-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const sharedStyle = {
    width: '100%', padding: '14px 16px',
    background: focused ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 10, color: 'rgba(255,255,255,0.85)',
    fontFamily: 'var(--font-ui)', fontSize: 14,
    transition: 'all 0.2s', outline: 'none', boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.08)' : 'none',
  };

  return (
    <div style={{ gridColumn: span === 2 ? 'span 2' : 'span 1' }}>
      <label
        htmlFor={inputId}
        style={{
        display: 'block', marginBottom: 8,
        fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase',
        fontFamily: 'var(--font-ui)', color: 'rgba(255,255,255,0.35)',
      }}>{label}</label>
      {tag === 'select' ? (
        <select
          id={inputId}
          value={value} onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...sharedStyle, cursor: 'pointer' }}
        >
          {options.map(o => <option key={o} value={o} style={{ background: '#0f0f14' }}>{o}</option>)}
        </select>
      ) : (
        <input
          id={inputId}
          type={type} value={value} onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      )}
    </div>
  );
}

function ReviewCard({ title, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '20px 24px', marginBottom: 16,
    }}>
      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: '2.5px',
        textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16,
      }}>{title}</p>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 20 }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function StepFooter({ children }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center' }}>
      {children}
    </div>
  );
}

function NextButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, padding: '16px 32px',
        background: disabled
          ? 'rgba(255,255,255,0.06)'
          : 'linear-gradient(135deg, #c9a84c, #e8c84a)',
        border: 'none', borderRadius: 12,
        color: disabled ? 'rgba(255,255,255,0.2)' : '#080808',
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
        letterSpacing: '2px', textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s',
        boxShadow: disabled ? 'none' : '0 0 30px rgba(201,168,76,0.25)',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >{children}</button>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 24px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
        letterSpacing: '1.5px', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.25s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
    >← Back</button>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      width: 16, height: 16, borderRadius: '50%',
      border: '2px solid rgba(0,0,0,0.2)',
      borderTopColor: '#080808',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}

function CheckoutInfoIcon({ name }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  switch (name) {
    case 'shield': return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
    case 'delivery': return (
      <svg {...common}>
        <path d="M10 17h4V5H2v12h3" />
        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    );
    case 'return': return (
      <svg {...common}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    );
    default: return null;
  }
}