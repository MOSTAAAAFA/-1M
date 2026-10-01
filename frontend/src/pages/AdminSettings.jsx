import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import { useSiteSettings } from '../context/SiteSettingsContext';
import API_BASE from '../utils/api';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'content', label: 'Content' },
  { id: 'announcement', label: 'Announcement' },
  { id: 'contact', label: 'Contact & Social' },
  { id: 'features', label: 'Features' },
  { id: 'loyalty', label: 'Loyalty Points' },
];

export default function AdminSettings() {
  const { refresh } = useSiteSettings();
  const [tab, setTab] = useState('general');
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/settings`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setForm(data.settings || {});
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings: form }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm(data.settings || form);
        setSaved(true);
        refresh();
        setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const field = (key, label, opts = {}) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={opts.type || 'text'}
        value={form[key] ?? ''}
        onChange={e => set(key, opts.type === 'number' ? Number(e.target.value) : e.target.value)}
        style={{
          width: '100%',
          maxWidth: 520,
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: '#fff',
          fontSize: 14,
          fontFamily: 'var(--font-ui)',
          outline: 'none',
          transition: 'all 0.3s ease',
        }}
        onFocus={e => { e.target.style.border = '1px solid var(--gold)'; e.target.style.background = 'rgba(201,168,76,0.05)'; }}
        onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
      />
    </div>
  );

  const toggle = (key, label, hint) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      marginBottom: 12,
      maxWidth: 520,
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff' }}>{label}</p>
        {hint && <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => set(key, !form[key])}
        aria-pressed={!!form[key]}
        style={{
          width: 48, height: 26,
          borderRadius: 14,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          background: form[key] ? 'linear-gradient(135deg, #C9A84C, #E0C06A)' : 'rgba(255,255,255,0.15)',
          transition: 'background 0.25s ease',
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: form[key] ? 25 : 3,
          width: 20, height: 20,
          borderRadius: '50%',
          background: form[key] ? '#0a0a0e' : '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          transition: 'left 0.25s ease',
        }} />
      </button>
    </div>
  );

  const sectionTitle = (text, hint) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ color: 'var(--gold)', fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>{text}</h3>
      {hint && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>{hint}</p>}
    </div>
  );

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Settings</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Full control over the live site. Changes apply instantly after saving.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 18px',
                background: tab === t.id ? 'linear-gradient(135deg, #C9A84C, #E0C06A)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${tab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '999px',
                color: tab === t.id ? '#000' : 'rgba(255,255,255,0.8)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                transition: 'all 0.25s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--gold)', fontSize: 14 }}>LOADING SETTINGS...</p>
          </div>
        ) : (
          <>
            <div style={{
              background: 'rgba(17,17,23,0.6)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: 900,
            }}>
              {tab === 'general' && (
                <>
                  {sectionTitle('Site Identity', 'Brand name shown across the site.')}
                  {field('siteName', 'Site Name')}
                  {field('siteSuffix', 'Site Suffix')}
                  {field('tagline', 'Tagline')}
                  {field('currency', 'Currency Code', { type: 'text' })}
                  {field('copyright', 'Copyright Text')}
                  {field('footerDescription', 'Footer Description')}
                </>
              )}

              {tab === 'content' && (
                <>
                  {sectionTitle('Hero Content', 'Text under the main brand mark on the homepage hero.')}
                  {field('heroEyebrowTop', 'Hero Eyebrow (top)')}
                  {field('heroEyebrowBottom', 'Hero Eyebrow (bottom)')}
                </>
              )}

              {tab === 'announcement' && (
                <>
                  {sectionTitle('Announcement Bar', 'A gold strip pinned to the very top of the site.')}
                  {toggle('announcementEnabled', 'Show announcement bar')}
                  {field('announcementText', 'Announcement Text')}
                </>
              )}

              {tab === 'contact' && (
                <>
                  {sectionTitle('Contact Information', 'Shown in the footer and WhatsApp button.')}
                  {field('phone', 'Phone')}
                  {field('whatsapp', 'WhatsApp Number (digits only)')}
                  {field('email', 'Email')}
                  {field('address', 'Address')}
                  {sectionTitle('Social Links', 'Handles without @ or domain.')}
                  {field('instagram', 'Instagram Handle')}
                  {field('facebook', 'Facebook Handle')}
                  {field('tiktok', 'TikTok Handle')}
                </>
              )}

              {tab === 'features' && (
                <>
                  {sectionTitle('Site Features', 'Enable or disable major parts of the site instantly.')}
                  {toggle('checkoutEnabled', 'Checkout', 'Disabling blocks the garage/checkout flow.')}
                  {toggle('loyaltyEnabled', 'Loyalty Program', 'Points stop being awarded while off.')}
                  {toggle('flashSaleEnabled', 'Flash Sale', 'Show a countdown offer.')}
                  {toggle('testDriveEnabled', 'Test Drive Booking', 'Visibility on car detail pages.')}
                  {toggle('reviewEnabled', 'Customer Reviews', 'Reviews section on cars.')}
                  {toggle('aiAssistantEnabled', 'AI Assistant', 'Floating assistant widget.')}
                  {field('carsPerPage', 'Cars Per Page', { type: 'number' })}
                </>
              )}

              {tab === 'loyalty' && (
                <>
                  {sectionTitle('Loyalty Points', 'Points awarded for real user actions.')}
                  {field('pointsView', 'View Car (points)', { type: 'number' })}
                  {field('pointsCart', 'Add To Cart (points)', { type: 'number' })}
                  {field('pointsWishlist', 'Save To Wishlist (points)', { type: 'number' })}
                  {field('pointsPerOrder', '$ Spent Per Point (orders)', { type: 'number' })}
                </>
              )}
            </div>

            {/* Save bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                style={{
                  padding: '14px 36px',
                  background: saving ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-ui)',
                  boxShadow: saving ? 'none' : '0 4px 16px rgba(201,168,76,0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                {saving ? 'SAVING...' : 'SAVE SETTINGS'}
              </button>
              {saved && (
                <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-ui)' }}>
                  Saved — changes are live ✓
                </span>
              )}
            </div>
          </>
        )}
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}