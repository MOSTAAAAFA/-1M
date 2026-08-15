import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// PWA Install Prompt
export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      const installDismissed = localStorage.getItem('pwaInstallDismissed');
      if (!installDismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwaInstallDismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            maxWidth: '400px',
            width: '90%',
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(17,17,23,0.98) 0%, rgba(25,25,33,0.98) 100%)',
            border: '1px solid rgba(201,168,76,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            onClick={handleDismiss}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(240,237,232,0.6)',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: '#000',
            }}>
              1M
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--white)',
              }}>
                Install 1M Motors
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                color: 'rgba(240,237,232,0.6)',
              }}>
                Quick access from your home screen
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleInstall}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
              color: '#000',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'none',
            }}
          >
            Install App
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Push Notification Manager
export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
  }, []);

  const subscribeToPush = async () => {
    if (!isSupported) {
      console.error('Push notifications not supported');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY',
      });

      setSubscription(sub);

      // Send subscription to backend
      await fetch('/api/v1/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      return sub;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);

      await fetch('/api/v1/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  return {
    isSupported,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
  };
};

export default PWAInstallPrompt;
