import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlameIcon } from './icons';

const FlashSaleCountdown = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onExpire) onExpire();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  const TimeUnit = ({ value, label }) => (
    <motion.div
      key={value}
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: '36px',
        fontWeight: 700,
        color: '#000',
        boxShadow: '0 8px 32px rgba(201,168,76,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{
            y: [-100, 0],
          }}
          transition={{
            duration: 0.5,
          }}
          key={`${label}-${value}`}
        >
          {String(value).padStart(2, '0')}
        </motion.div>
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: 'rgba(240,237,232,0.6)',
      }}>
        {label}
      </div>
    </motion.div>
  );

  return (
    <div style={{
      padding: '32px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(255,68,68,0.1) 0%, rgba(201,168,76,0.1) 100%)',
      border: '2px solid rgba(255,68,68,0.3)',
      boxShadow: '0 8px 32px rgba(255,68,68,0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,68,68,0.1), transparent)',
          backgroundSize: '200% 100%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
            style={{ fontSize: '32px' }}
          >
            <FlameIcon size={32} color="#FF4444" />
          </motion.div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: '#FF4444',
              textShadow: '0 2px 10px rgba(255,68,68,0.5)',
            }}>
              FLASH SALE
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              color: 'rgba(240,237,232,0.7)',
            }}>
              Ends Soon - Don't Miss Out!
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
        }}>
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Min" />
          <TimeUnit value={timeLeft.seconds} label="Sec" />
        </div>
      </div>
    </div>
  );
};

// Stock Alert Component
export const StockAlert = ({ onNotify, productName }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = () => {
    if (email) {
      if (onNotify) onNotify(email);
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(201,168,76,0.2)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,68,68,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4444',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--white)',
          }}>
            Out of Stock
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            color: 'rgba(240,237,232,0.6)',
          }}>
            Get notified when back in stock
          </div>
        </div>
      </div>

      {!subscribed ? (
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(201,168,76,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--white)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <motion.button
            onClick={handleNotify}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              border: 'none',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
              color: '#000',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Notify Me
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(37,211,102,0.1)',
            border: '1px solid rgba(37,211,102,0.3)',
            textAlign: 'center',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            color: '#25D366',
          }}
        >
          ✓ You'll be notified when available!
        </motion.div>
      )}
    </motion.div>
  );
};

// Price Alert Component
export const PriceAlert = ({ currentPrice, onSetAlert }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [isSet, setIsSet] = useState(false);

  const handleSetAlert = () => {
    if (targetPrice && Number(targetPrice) < currentPrice) {
      if (onSetAlert) onSetAlert(Number(targetPrice));
      setIsSet(true);
    }
  };

  return (
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(201,168,76,0.2)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-ui)',
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--white)',
        marginBottom: '12px',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10" />
          <path d="M15 9.5c-.5-.8-1.7-1.5-3-1.5s-2.5.7-2.5 1.5.9 1.3 2.5 1.5 3 .8 3 1.6-1.7 1.6-3 1.6-2.5-.7-3-1.5" />
        </svg>
        Set Price Alert
      </div>

      {!isSet ? (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={`Below $${currentPrice.toLocaleString()}`}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(201,168,76,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--white)',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <motion.button
              onClick={handleSetAlert}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                background: 'var(--gold)',
                color: '#000',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'none',
              }}
            >
              Set
            </motion.button>
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            color: 'rgba(240,237,232,0.5)',
          }}>
            We'll notify you when price drops
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            padding: '10px',
            borderRadius: '8px',
            background: 'rgba(37,211,102,0.1)',
            border: '1px solid rgba(37,211,102,0.3)',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            color: '#25D366',
          }}
        >
          ✓ Alert set for ${Number(targetPrice).toLocaleString()}
        </motion.div>
      )}
    </div>
  );
};

export default FlashSaleCountdown;
