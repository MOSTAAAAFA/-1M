import React from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function AnnouncementBar() {
  const { settings } = useSiteSettings();
  const show = settings.announcementEnabled && settings.announcementText;

  if (!show) return null;

  return (
    <motion.div
      role="region"
      aria-label="Announcement"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 36, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 36,
        zIndex: 950,
        background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
      }}
    >
      <p style={{
        margin: 0,
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '2.5px',
        textTransform: 'uppercase',
        color: '#0a0a0e',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '0 24px',
        maxWidth: '100%',
      }}>
        {settings.announcementText}
      </p>
    </motion.div>
  );
}