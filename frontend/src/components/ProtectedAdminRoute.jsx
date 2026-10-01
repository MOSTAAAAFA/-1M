import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API_BASE from '../utils/api';

export default function ProtectedAdminRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // Quick check: if user explicitly marked as not admin, reject immediately
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.isAdmin === false) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // Invalid JSON, proceed to token verification
        }
      }

      try {
        // Verify token with backend (token is in httpOnly cookie)
        const response = await fetch(`${API_BASE}/admin/verify`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include httpOnly cookie
        });

        if (response.ok) {
          const data = await response.json();
          // Verify admin role from response
          if (data.user && data.user.role === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            setIsAuthenticated(true);
          } else {
            // Not an admin
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('isAdmin');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        // On network error, deny access for security - backend verification is required
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050507',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(201,168,76,0.2)',
            borderTop: '4px solid var(--gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}/>
          <p style={{
            color: 'var(--gold)',
            fontSize: 14,
            fontFamily: 'var(--font-ui)',
            letterSpacing: '2px',
          }}>
            VERIFYING ACCESS...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not authenticated
  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated
  return children;
}
