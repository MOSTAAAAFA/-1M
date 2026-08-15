import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlameIcon } from './icons';

const SpinWheel = ({ prizes = [], onSpin }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const defaultPrizes = [
    { label: '10% OFF', color: '#C9A84C', value: 10 },
    { label: '5% OFF', color: '#E0C06A', value: 5 },
    { label: '15% OFF', color: '#F4D03F', value: 15 },
    { label: 'FREE SHIPPING', color: '#C9A84C', value: 'shipping' },
    { label: '20% OFF', color: '#E0C06A', value: 20 },
    { label: 'TRY AGAIN', color: '#F4D03F', value: 0 },
  ];

  const segments = prizes.length > 0 ? prizes : defaultPrizes;
  const segmentAngle = 360 / segments.length;

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * segments.length);
    const targetRotation = 360 * 5 + (360 - randomIndex * segmentAngle);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(segments[randomIndex]);
      if (onSpin) onSpin(segments[randomIndex]);
    }, 4000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '40px',
    }}>
      {/* Wheel Container */}
      <div style={{
        position: 'relative',
        width: '400px',
        height: '400px',
      }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderTop: '40px solid #FF4444',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
        }} />

        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.17, 0.67, 0.12, 0.99],
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 60px rgba(201,168,76,0.3)',
            border: '8px solid var(--gold)',
          }}
        >
          {segments.map((segment, index) => {
            const angle = index * segmentAngle;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  width: '50%',
                  height: '50%',
                  transformOrigin: '100% 100%',
                  transform: `rotate(${angle}deg) skewY(${-90 + segmentAngle}deg)`,
                  background: segment.color,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  transform: `skewY(${90 - segmentAngle}deg) rotate(${segmentAngle / 2}deg)`,
                  textAlign: 'center',
                  color: '#000',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                  marginLeft: '60px',
                }}>
                  {segment.label}
                </div>
              </div>
            );
          })}

          {/* Center Button */}
          <motion.button
            onClick={spin}
            disabled={isSpinning}
            whileHover={{ scale: isSpinning ? 1 : 1.1 }}
            whileTap={{ scale: isSpinning ? 1 : 0.95 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
              border: '4px solid #000',
              color: '#000',
              fontFamily: 'var(--font-ui)',
              fontSize: '18px',
              fontWeight: 700,
              cursor: isSpinning ? 'not-allowed' : 'none',
              boxShadow: '0 4px 20px rgba(201,168,76,0.6)',
              zIndex: 5,
            }}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN'}
          </motion.button>
        </motion.div>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              padding: '24px 40px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)',
              border: '2px solid var(--gold)',
              boxShadow: '0 8px 32px rgba(201,168,76,0.3)',
              textAlign: 'center',
            }}
          >
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'rgba(240,237,232,0.6)',
                marginBottom: '8px',
              }}>
                You Won!
              </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--gold)',
            }}>
              {result.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Achievement Badge Component
export const AchievementBadge = ({ icon, title, description, unlocked = false, progress = 0 }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: unlocked
          ? 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)'
          : 'rgba(255,255,255,0.03)',
        border: unlocked ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
        opacity: unlocked ? 1 : 0.5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Progress Bar */}
      {!unlocked && progress > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '4px',
          width: `${progress}%`,
          background: 'var(--gold)',
          transition: 'width 0.3s ease',
        }} />
      )}

      <div style={{
        fontSize: '48px',
        marginBottom: '12px',
        textAlign: 'center',
        filter: unlocked ? 'none' : 'grayscale(100%)',
      }}>
        {icon}
      </div>

      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '16px',
        fontWeight: 600,
        color: unlocked ? 'var(--gold)' : 'rgba(240,237,232,0.5)',
        textAlign: 'center',
        marginBottom: '4px',
      }}>
        {title}
      </div>

      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        color: 'rgba(240,237,232,0.6)',
        textAlign: 'center',
      }}>
        {description}
      </div>

      {unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontSize: '14px',
          }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
};

// Daily Check-in Component
export const DailyCheckIn = ({ streak = 0, onCheckIn }) => {
  const [canCheckIn, setCanCheckIn] = useState(true);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{
      padding: '24px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
      border: '1px solid rgba(201,168,76,0.2)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--gold)',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        Daily Check-in <FlameIcon size={20} color="var(--gold)" style={{ verticalAlign: 'middle' }} />
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        {days.map((day, index) => (
          <div
            key={day}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: index < streak ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
              border: index === streak ? '2px solid var(--gold)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              fontWeight: 600,
              color: index < streak ? '#000' : 'rgba(240,237,232,0.5)',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <motion.button
        onClick={onCheckIn}
        disabled={!canCheckIn}
        whileHover={{ scale: canCheckIn ? 1.05 : 1 }}
        whileTap={{ scale: canCheckIn ? 0.95 : 1 }}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          background: canCheckIn
            ? 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)'
            : 'rgba(255,255,255,0.1)',
          color: canCheckIn ? '#000' : 'rgba(240,237,232,0.5)',
          fontFamily: 'var(--font-ui)',
          fontSize: '16px',
          fontWeight: 600,
          cursor: canCheckIn ? 'none' : 'not-allowed',
        }}
      >
        {canCheckIn ? '✓ Check In Today (+10 Points)' : '✓ Already Checked In'}
      </motion.button>

      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        fontFamily: 'var(--font-ui)',
        fontSize: '12px',
        color: 'rgba(240,237,232,0.6)',
      }}>
        <FlameIcon size={14} color="var(--gold)" style={{ verticalAlign: 'middle' }} /> Current Streak: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{streak} days</span>
      </div>
    </div>
  );
};

export default SpinWheel;
