import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, StarIcon } from './icons';

const STORAGE_KEY = '1m_loyalty';

const LoyaltyDashboard = () => {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchLoyaltyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          applyFallback('Not signed in');
          return;
        }
        const response = await fetch('/api/v1/loyalty', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!data.success || !data.data) throw new Error('Empty loyalty payload');
        if (cancelled) return;
        setLoyaltyData(data.data);
        setOffline(false);
      } catch (error) {
        console.warn('Loyalty API unavailable, using offline data:', error);
        applyFallback('Network unavailable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const applyFallback = (reason) => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.points !== undefined) {
            if (!cancelled) {
              setLoyaltyData(parsed);
              setOffline(true);
            }
            return;
          }
        }
      } catch (e) { /* corrupted cache — regenerate */ }

      const seeded = seedFallbackData();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded)); } catch (e) { /* ignore */ }
      if (!cancelled) {
        setLoyaltyData(seeded);
        setOffline(true);
      }
    };

    fetchLoyaltyData();
    return () => { cancelled = true; };
  }, []);

  const getTierColor = (tier) => {
    const colors = {
      Bronze: '#CD7F32',
      Silver: '#C0C0C0',
      Gold: '#FFD700',
      Platinum: '#E5E4E2'
    };
    return colors[tier] || '#CD7F32';
  };

  const getTierProgress = () => {
    const thresholds = { Bronze: 0, Silver: 20000, Gold: 50000, Platinum: 100000 };
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const currentIndex = tiers.indexOf(loyaltyData?.tier);

    if (currentIndex === tiers.length - 1) return 100;

    const currentThreshold = thresholds[loyaltyData?.tier];
    const nextTier = tiers[currentIndex + 1];
    const nextThreshold = thresholds[nextTier];

    const progress = ((loyaltyData?.totalEarned - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(240,237,232,0.6)' }}>
        Loading loyalty data...
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(240,237,232,0.6)' }}>
        Failed to load loyalty data
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '42px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #F4D03F 0%, #E0C06A 50%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}>
          Loyalty Rewards
        </h1>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '16px',
          color: 'rgba(240,237,232,0.6)',
        }}>
          Earn points with every purchase and unlock exclusive benefits
        </p>
        {offline && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            padding: '8px 14px',
            borderRadius: '50px',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.3)',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e0c06a', boxShadow: '0 0 8px rgba(201,168,76,0.8)' }} />
            Offline Mode — demo data
          </div>
        )}
      </motion.div>

      {/* Main Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      }}>
        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: '32px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)',
            border: '2px solid rgba(201,168,76,0.3)',
            boxShadow: '0 8px 32px rgba(201,168,76,0.2)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '12px',
          }}>
            Available Points
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--gold)',
            marginBottom: '8px',
          }}>
            {loyaltyData.points.toLocaleString()}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            color: 'rgba(240,237,232,0.6)',
          }}>
            = ${(loyaltyData.points / 100).toFixed(2)} discount value
          </div>
        </motion.div>

        {/* Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: '32px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
            border: `2px solid ${getTierColor(loyaltyData.tier)}40`,
            boxShadow: `0 8px 32px ${getTierColor(loyaltyData.tier)}20`,
          }}
        >
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: getTierColor(loyaltyData.tier),
            marginBottom: '12px',
          }}>
            Current Tier
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '36px',
            fontWeight: 700,
            color: getTierColor(loyaltyData.tier),
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {loyaltyData.tier}
            <svg width="32" height="32" viewBox="0 0 24 24" fill={getTierColor(loyaltyData.tier)}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          {/* Progress Bar */}
          {loyaltyData.tier !== 'Platinum' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  color: 'rgba(240,237,232,0.6)',
                }}>
                  Progress to next tier
                </span>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  color: 'var(--gold)',
                  fontWeight: 600,
                }}>
                  {getTierProgress().toFixed(0)}%
                </span>
              </div>
              <div style={{
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(201,168,76,0.1)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getTierProgress()}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(to right, ${getTierColor(loyaltyData.tier)}, var(--gold))`,
                    boxShadow: `0 0 10px ${getTierColor(loyaltyData.tier)}`,
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '32px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
            border: '1px solid rgba(201,168,76,0.2)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.6)',
            marginBottom: '20px',
          }}>
            Lifetime Stats
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                color: 'rgba(240,237,232,0.5)',
                marginBottom: '4px',
              }}>
                Total Earned
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 600,
                color: 'rgba(240,237,232,0.9)',
              }}>
                {loyaltyData.totalEarned.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                color: 'rgba(240,237,232,0.5)',
                marginBottom: '4px',
              }}>
                Total Redeemed
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 600,
                color: 'rgba(240,237,232,0.9)',
              }}>
                {loyaltyData.totalRedeemed.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          padding: '32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
          marginBottom: '40px',
        }}
      >
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--gold)',
          marginBottom: '24px',
        }}>
          Your {loyaltyData.tier} Benefits
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          <BenefitItem
            icon="sparkles"
            label="Points Multiplier"
            value={`${loyaltyData.benefits.pointsMultiplier}x`}
          />
          <BenefitItem
            icon="coin"
            label="Discount"
            value={`${loyaltyData.benefits.discountPercentage}%`}
          />
          <BenefitItem
            icon="truck"
            label="Free Shipping"
            value={loyaltyData.benefits.freeShipping ? 'Yes' : 'No'}
            active={loyaltyData.benefits.freeShipping}
          />
          <BenefitItem
            icon="star"
            label="Priority Support"
            value={loyaltyData.benefits.prioritySupport ? 'Yes' : 'No'}
            active={loyaltyData.benefits.prioritySupport}
          />
        </div>
      </motion.div>

      {/* Recent History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          padding: '32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--gold)',
          marginBottom: '24px',
        }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loyaltyData.history.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: 'rgba(240,237,232,0.5)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
            }}>
              No activity yet. Start shopping to earn points!
            </div>
          ) : (
            loyaltyData.history.map((item, index) => (
              <HistoryItem key={index} item={item} />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Offline fallback helpers ── */
const TIER_BENEFITS = {
  Bronze: { pointsMultiplier: 1, discountPercentage: 0, freeShipping: true, prioritySupport: false },
  Silver: { pointsMultiplier: 2, discountPercentage: 2, freeShipping: true, prioritySupport: true },
  Gold: { pointsMultiplier: 3, discountPercentage: 5, freeShipping: true, prioritySupport: true },
  Platinum: { pointsMultiplier: 5, discountPercentage: 10, freeShipping: true, prioritySupport: true },
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const tierFor = (points) => {
  if (points >= 100000) return 'Platinum';
  if (points >= 50000) return 'Gold';
  if (points >= 20000) return 'Silver';
  return 'Bronze';
};

function seedFallbackData() {
  let name = 'Member';
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) name = user.name || user.username || user.email || 'Member';
  } catch (e) { /* ignore */ }

  let h = 0;
  for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) % 100000;

  const totalEarned = 8000 + (h % 24000);
  const totalRedeemed = h % 5000;
  const points = totalEarned - totalRedeemed;
  const tier = tierFor(points);

  return {
    points,
    tier,
    totalEarned,
    totalRedeemed,
    benefits: TIER_BENEFITS[tier],
    history: [
      { type: 'earned', points: Math.round(totalEarned * 0.4), reason: 'Purchase reward — 911 Turbo S', date: daysAgo(14) },
      { type: 'earned', points: 1500, reason: 'Welcome bonus', date: daysAgo(30) },
      { type: 'earned', points: 500, reason: 'Profile completion bonus', date: daysAgo(45) },
      ...(totalRedeemed > 0 ? [{ type: 'redeemed', points: totalRedeemed, reason: 'Redeemed for service credit', date: daysAgo(7) }] : []),
    ],
    offline: true,
  };
}

const BenefitItem = ({ icon, label, value, active = true }) => (
  <div style={{
    padding: '16px',
    borderRadius: '12px',
    background: active ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.03)',
    border: `1px solid ${active ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.1)'}`,
    opacity: active ? 1 : 0.6,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: 'var(--gold)' }}><BenefitIcon name={icon} /></div>
    <div style={{
      fontFamily: 'var(--font-ui)',
      fontSize: '12px',
      color: 'rgba(240,237,232,0.6)',
      marginBottom: '4px',
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: 'var(--font-display)',
      fontSize: '18px',
      fontWeight: 600,
      color: active ? 'var(--gold)' : 'rgba(240,237,232,0.5)',
    }}>
      {value}
    </div>
  </div>
);

const HistoryItem = ({ item }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'earned': return '#25D366';
      case 'redeemed': return '#FF4444';
      case 'expired': return '#999999';
      default: return 'var(--gold)';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(201,168,76,0.03)',
      border: '1px solid rgba(201,168,76,0.1)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'rgba(240,237,232,0.9)',
          marginBottom: '4px',
        }}>
          {item.reason}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          color: 'rgba(240,237,232,0.5)',
        }}>
          {formatDate(item.date)}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 700,
        color: getTypeColor(item.type),
      }}>
        {item.type === 'earned' ? '+' : '-'}{item.points.toLocaleString()}
      </div>
    </div>
  );
};

export default LoyaltyDashboard;

function CoinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15 9.5c-.5-.8-1.7-1.5-3-1.5s-2.5.7-2.5 1.5.9 1.3 2.5 1.5 3 .8 3 1.6-1.7 1.6-3 1.6-2.5-.7-3-1.5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18h-5" />
      <path d="M15 8h3.5L22 13v5a1 1 0 0 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function BenefitIcon({ name }) {
  switch (name) {
    case 'sparkles': return <SparklesIcon size={22} />;
    case 'coin': return <CoinIcon />;
    case 'truck': return <TruckIcon />;
    case 'star': return <StarIcon size={22} />;
    default: return null;
  }
}
