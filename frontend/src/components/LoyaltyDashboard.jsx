import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, StarIcon } from './icons';
import API_BASE from '../utils/api';
import { getCurrentUser } from '../utils/activity';
import { useSiteSettings } from '../context/SiteSettingsContext';

const LoyaltyDashboard = () => {
  const { settings } = useSiteSettings();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchLoyaltyData = async () => {
      try {
        const response = await fetch(`${API_BASE}/loyalty`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          if (response.status === 401) setError('not-signed-in');
          else throw new Error(`HTTP ${response.status}`);
          return;
        }
        const data = await response.json();
        if (!data.success || !data.data) throw new Error('Empty loyalty payload');
        if (cancelled) return;
        setLoyaltyData(data.data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Network unavailable');
      } finally {
        if (!cancelled) setLoading(false);
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
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ padding: '60px', textAlign: 'center', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <div style={{
            width: 48,
            height: 48,
            margin: '0 auto 20px',
            border: '3px solid rgba(201,168,76,0.2)',
            borderTop: '3px solid var(--gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.6)' }}>
            Loading your points...
          </p>
        </div>
      </div>
    );
  }

  if (error === 'not-signed-in' || !getCurrentUser()) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          padding: '64px 40px',
          textAlign: 'center',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.02) 100%)',
          border: '1px solid rgba(201,168,76,0.25)',
        }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px' }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginBottom: '12px' }}>
            Unlock Your Rewards
          </h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', color: 'rgba(240,237,232,0.6)', maxWidth: '440px', margin: '0 auto 28px' }}>
            Sign in to earn real points for every car you view, add to your garage, or order — and watch your rank rise.
          </p>
          <Link to="/login" className="btn btn-gold" style={{ textDecoration: 'none' }}>
            Sign In to Start Earning
          </Link>
          <HowToEarn points={settings} />
        </div>
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ padding: '60px', textAlign: 'center', borderRadius: '20px', background: 'rgba(17,17,23,0.6)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--gold)', marginBottom: '12px' }}>
            Points Not Available Right Now
          </h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'rgba(240,237,232,0.6)' }}>
            We couldn't load your loyalty balance. Please try again shortly.
          </p>
        </div>
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

      {/* How to Earn — clear hint for every user */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ marginBottom: '40px' }}
      >
        <HowToEarn points={settings} />
      </motion.div>

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

const HowToEarn = ({ points }) => {
  const rows = [
    { icon: '👁', action: 'View any car', detail: 'Open a car page in the collection', pts: points.pointsView },
    { icon: '🛒', action: 'Add to your garage', detail: 'Add a car to the cart', pts: points.pointsCart },
    { icon: '❤️', action: 'Save to your favorites', detail: 'Wishlist a dream car', pts: points.pointsWishlist },
    { icon: '🏁', action: 'Complete an order', detail: `Earn ${points.pointsPerOrder} pt per $ spent`, pts: null },
  ];

  return (
    <div style={{
      padding: '32px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
      border: '1px solid rgba(201,168,76,0.25)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
      }}>
        <span style={{ fontSize: '20px' }}>💰</span>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--gold)',
          margin: 0,
        }}>
          How to Earn Points
        </h3>
      </div>
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '13px',
        color: 'rgba(240,237,232,0.55)',
        marginBottom: '24px',
      }}>
        Easy ways to boost your balance — every action counts instantly.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '14px',
      }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '16px 18px',
            borderRadius: '12px',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{r.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'rgba(240,237,232,0.9)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {r.action}
                </div>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  color: 'rgba(240,237,232,0.5)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {r.detail}
                </div>
              </div>
            </div>
            {r.pts != null && (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--gold)',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}>
                +{r.pts} pts
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

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
