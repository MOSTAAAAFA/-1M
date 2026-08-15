import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiveStreamingEvents = () => {
  const [liveStreams] = useState([
    {
      id: 1,
      title: 'New Porsche 911 GT3 RS Launch Event',
      status: 'live',
      viewers: 2456,
      thumbnail: 'https://via.placeholder.com/600x400/C9A84C/000000?text=Live+Stream',
      startTime: 'Now'
    },
    {
      id: 2,
      title: 'Virtual Showroom Tour',
      status: 'upcoming',
      viewers: 0,
      thumbnail: 'https://via.placeholder.com/600x400/E0C06A/000000?text=Upcoming',
      startTime: 'Tomorrow 6:00 PM'
    }
  ]);

  return (
    <div style={{ padding: '32px 0' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <polyline points="10 9 16 12 10 15" />
        </svg>
        Live Events
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {liveStreams.map(stream => (
          <motion.div
            key={stream.id}
            whileHover={{ y: -5 }}
            style={{
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.2)',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img src={stream.thumbnail} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              {stream.status === 'live' && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: '#FF0000',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><circle cx="12" cy="12" r="8" /></svg>
                  LIVE
                </motion.div>
              )}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.8)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {stream.viewers.toLocaleString()} watching
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {stream.title}
              </h3>
              <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {stream.startTime}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LiveStreamingEvents;
