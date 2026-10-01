import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Brand1M from './Brand1M';

export default function AdminLayout({ children }) {  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const adminUser = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
  const adminName = adminUser?.name || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: 'chart', label: 'Dashboard' },
    { path: '/admin/cars', icon: 'car', label: 'Cars' },
    { path: '/admin/orders', icon: 'box', label: 'Orders' },
    { path: '/admin/users', icon: 'users', label: 'Users' },
    { path: '/admin/reviews', icon: 'star', label: 'Reviews' },
    { path: '/admin/settings', icon: 'gear', label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050507',
      display: 'flex',
    }}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'rgba(17,17,23,0.98)',
          borderRight: '1px solid rgba(201,168,76,0.2)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Logo Section */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          gap: 12,
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                background: 'linear-gradient(135deg, #C9A84C, #E0C06A, #F4D03F)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(201,168,76,0.4)',
              }}>
                <Brand1M style={{ fontSize: 20, fontWeight: 900, color: '#000' }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                }}>
                  <Brand1M style={{
                    background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }} /> MOTORS
                </h2>
                <p style={{
                  fontSize: 9,
                  color: '#C9A84C',
                  margin: 0,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-ui)',
                }}>
                  Admin Panel
                </p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div style={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #C9A84C, #E0C06A, #F4D03F)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(201,168,76,0.4)',
            }}>
              <Brand1M style={{ fontSize: 20, fontWeight: 900, color: '#000' }} />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{
          flex: 1,
          padding: '24px 0',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: sidebarCollapsed ? '16px 0' : '16px 24px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'var(--font-ui)',
                borderLeft: isActive(item.path) ? '3px solid var(--gold)' : '3px solid transparent',
                background: isActive(item.path) ? 'rgba(201,168,76,0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--gold)' }}><AdminIcon name={item.icon} /></span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            padding: '16px',
            background: 'rgba(201,168,76,0.1)',
            border: 'none',
            borderTop: '1px solid rgba(201,168,76,0.15)',
            color: 'var(--gold)',
            fontSize: 20,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? 80 : 280,
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Top Bar */}
        <header style={{
          background: 'rgba(17,17,23,0.95)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(10px)',
        }}>
          {/* Page Title */}
          <div>
            <h1 style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#fff',
              margin: 0,
              fontFamily: 'var(--font-display)',
            }}>
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h1>
            <p style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              margin: '4px 0 0 0',
            }}>
              Welcome back, {adminName.toUpperCase()}
            </p>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Back to Site */}
            <Link
              to="/"
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '1px',
                fontFamily: 'var(--font-ui)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>BACK TO SITE</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '1px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                boxShadow: '0 4px 12px rgba(201,168,76,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(201,168,76,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201,168,76,0.3)';
              }}
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
        }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          background: 'rgba(17,17,23,0.5)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            margin: 0,
          }}>
            © 2026 1M Motors Admin Panel. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

function AdminIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (name === 'chart') return (
    <svg {...common}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
  if (name === 'car') return (
    <svg {...common}>
      <path d="M5 17H3v-6l2-5h14l2 5v6h-2" />
      <path d="M3 17h18" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  );
  if (name === 'box') return (
    <svg {...common}>
      <path d="M21 8v13H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  );
  if (name === 'users') return (
    <svg {...common}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  if (name === 'star') return (
    <svg {...common}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
  if (name === 'gear') return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
  return null;
}
