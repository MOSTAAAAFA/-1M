import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API_BASE from '../utils/api';

export default function ProtectedAdminRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch(`${API_BASE}/admin/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        // On network error, allow access if token exists (offline tolerance)
        setIsAuthenticated(true);
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
