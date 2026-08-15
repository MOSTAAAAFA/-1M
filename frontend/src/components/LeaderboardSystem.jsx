import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon, CrownIcon } from './icons';

const LeaderboardSystem = () => {
  const [leaderboard] = useState([
    { rank: 1, name: 'John Smith', points: 12450, badge: 'crown', purchases: 3 },
    { rank: 2, name: 'Sarah Johnson', points: 10230, badge: 'silver', purchases: 2 },
    { rank: 3, name: 'Mike Wilson', points: 8900, badge: 'bronze', purchases: 2 },
    { rank: 4, name: 'Emma Davis', points: 7650, badge: 'star', purchases: 1 },
    { rank: 5, name: 'Alex Brown', points: 6420, badge: 'star', purchases: 1 }
  ]);

  return (
    <div style={{
      padding: '32px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%)',
      border: '1px solid rgba(201,168,76,0.2)'
    }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
        <TrophyIcon size={26} color="var(--gold)" style={{ verticalAlign: 'middle', marginRight: 8 }} /> Top Members Leaderboard
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {leaderboard.map((user, idx) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 5 }}
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: user.rank <= 3
                ? 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: user.rank <= 3
                ? '2px solid var(--gold)'
                : '1px solid rgba(201,168,76,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: user.rank === 1
                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                : user.rank === 2
                ? 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)'
                : user.rank === 3
                ? 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'
                : 'rgba(201,168,76,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: user.rank <= 3 ? '#000' : '#fff'
            }}>
              <RankBadge badge={user.badge} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.6)' }}>
                {user.purchases} purchases
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gold)' }}>
                {user.points.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.6)' }}>
                points
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

function RankBadge({ badge }) {
  const size = 24;
  if (badge === 'crown') return <CrownIcon size={size} color="#F4D03F" />;
  if (badge === 'silver') return <StarIcon size={size} color="#E8E8E8" />;
  if (badge === 'bronze') return <StarIcon size={size} color="#CD7F32" />;
  return <StarIcon size={size} color="#C9A84C" />;
}

export default LeaderboardSystem;
