import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load notifications');
      }
    }
  }, []);

  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });

    return newNotif.id;
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Center Component
export const NotificationCenter = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll, unreadCount } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      case 'order':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'relative',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.3)',
          background: 'linear-gradient(135deg, rgba(17,17,23,0.9) 0%, rgba(25,25,33,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          cursor: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              background: '#FF4444',
              color: '#FFF',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
              boxShadow: '0 2px 8px rgba(255,68,68,0.4)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '420px',
                maxWidth: '100vw',
                zIndex: 9999,
                background: 'linear-gradient(135deg, rgba(17,17,23,0.98) 0%, rgba(25,25,33,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(201,168,76,0.3)',
                boxShadow: '-10px 0 60px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid rgba(201,168,76,0.15)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    margin: 0,
                  }}>
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid rgba(201,168,76,0.2)',
                      background: 'transparent',
                      color: 'rgba(240,237,232,0.6)',
                      cursor: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                {notifications.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(201,168,76,0.2)',
                          background: 'transparent',
                          color: 'rgba(240,237,232,0.7)',
                          fontFamily: 'var(--font-ui)',
                          fontSize: '12px',
                          cursor: 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,68,68,0.2)',
                        background: 'transparent',
                        color: 'rgba(255,68,68,0.7)',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '12px',
                        cursor: 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
              }}>
                {notifications.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '40px',
                    textAlign: 'center',
                  }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '14px',
                      color: 'rgba(240,237,232,0.5)',
                    }}>
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        whileHover={{ x: -4 }}
                        onClick={() => !notif.read && markAsRead(notif.id)}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: notif.read ? 'rgba(201,168,76,0.03)' : 'rgba(201,168,76,0.08)',
                          border: `1px solid ${notif.read ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.2)'}`,
                          cursor: 'none',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {/* Unread Indicator */}
                        {!notif.read && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--gold)',
                            boxShadow: '0 0 8px var(--gold)',
                          }} />
                        )}

                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          marginBottom: '8px',
                        }}>
                          <div style={{ flexShrink: 0 }}>
                            {getIcon(notif.type)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontFamily: 'var(--font-ui)',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'rgba(240,237,232,0.9)',
                              marginBottom: '4px',
                            }}>
                              {notif.title}
                            </h4>
                            <p style={{
                              fontFamily: 'var(--font-ui)',
                              fontSize: '13px',
                              color: 'rgba(240,237,232,0.6)',
                              lineHeight: 1.5,
                              margin: 0,
                            }}>
                              {notif.message}
                            </p>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '8px',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-ui)',
                            fontSize: '11px',
                            color: 'rgba(240,237,232,0.4)',
                          }}>
                            {formatTime(notif.timestamp)}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            style={{
                              padding: '4px 8px',
                              border: 'none',
                              borderRadius: '4px',
                              background: 'transparent',
                              color: 'rgba(240,237,232,0.4)',
                              fontFamily: 'var(--font-ui)',
                              fontSize: '11px',
                              cursor: 'none',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
