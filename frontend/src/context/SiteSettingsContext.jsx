import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_BASE from '../utils/api';

export const DEFAULT_SETTINGS = {
  siteName: '1M',
  siteSuffix: 'MOTORS',
  tagline: 'LUXURY · PERFORMANCE · EST. 2026',
  heroEyebrowTop: 'Luxury · Performance',
  heroEyebrowBottom: 'Est. 2026',
  currency: 'USD',
  copyright: '© 2026 1M Motors. All rights reserved.',
  footerDescription: "The world's most exclusive automotive experience.",
  phone: '+2 010 5093 3078',
  whatsapp: '201050933078',
  email: 'info@1mmotors.com',
  address: 'Cairo, Egypt',
  instagram: '1m_motors',
  facebook: '1mmotors',
  tiktok: '1mmotors',
  announcementEnabled: true,
  announcementText: '',
  loyaltyEnabled: true,
  checkoutEnabled: true,
  flashSaleEnabled: false,
  testDriveEnabled: true,
  reviewEnabled: true,
  aiAssistantEnabled: true,
  carsPerPage: 12,
  pointsView: 250,
  pointsCart: 500,
  pointsWishlist: 300,
  pointsPerOrder: 1,
};

const SiteSettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  refresh: () => {},
});

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/public`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      }
    } catch (err) {
      /* keep defaults */
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Announcement bar offset — informs fixed-position nav/sections
  useEffect(() => {
    const show = settings.announcementEnabled && settings.announcementText;
    document.documentElement.style.setProperty('--announce-offset', show ? '36px' : '0px');
  }, [settings.announcementEnabled, settings.announcementText]);

  // Live browser title from settings
  useEffect(() => {
    const suffix = settings.siteSuffix ? ` ${settings.siteSuffix}` : '';
    document.title = `${settings.siteName}${suffix} | Luxury Automotive`;
  }, [settings.siteName, settings.siteSuffix]);

  return (
    <SiteSettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}