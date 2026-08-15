import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Brand1M from '../components/Brand1M';
import API_BASE from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to home
        navigate('/');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050507 0%, #0a0a0e 50%, #050507 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          padding: '12px 24px',
          background: 'rgba(17,17,23,0.8)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '10px',
          color: 'var(--gold)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.3s ease',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
          e.currentTarget.style.border = '1px solid rgba(201,168,76,0.5)';
          e.currentTarget.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(17,17,23,0.8)';
          e.currentTarget.style.border = '1px solid rgba(201,168,76,0.3)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <span style={{ fontSize: 18 }}>←</span>
        <span>BACK TO HOME</span>
      </button>

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 2px 2px, var(--gold) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}/>

      {/* Register Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: 480,
          width: '100%',
          background: 'rgba(17,17,23,0.95)',
          borderRadius: '24px',
          border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gold accent line */}
        <div style={{
          height: 4,
          background: 'linear-gradient(to right, var(--gold), #E0C06A, var(--gold))',
          boxShadow: '0 0 20px rgba(201,168,76,0.6)',
        }}/>

        {/* Content */}
        <div style={{ padding: '48px 40px' }}>
          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
              borderRadius: '50%',
              marginBottom: 20,
              boxShadow: '0 8px 32px rgba(201,168,76,0.5)',
            }}>
              <Brand1M style={{ fontSize: 32, fontWeight: 900, color: '#000' }} />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 600,
              color: 'var(--white)',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}>
              <Brand1M style={{
                fontSize: 32,
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }} />
              <span>MOTORS</span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 4,
            }}>
              Create Account
            </p>

            <p style={{
              fontSize: 13,
              color: 'var(--white-40)',
            }}>
              Join the exclusive automotive experience
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--white)',
                marginBottom: 8,
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'var(--white)',
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid var(--gold)';
                  e.target.style.background = 'rgba(201,168,76,0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--white)',
                marginBottom: 8,
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'var(--white)',
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid var(--gold)';
                  e.target.style.background = 'rgba(201,168,76,0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--white)',
                marginBottom: 8,
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'var(--white)',
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid var(--gold)';
                  e.target.style.background = 'rgba(201,168,76,0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--white)',
                marginBottom: 8,
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'var(--white)',
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid var(--gold)';
                  e.target.style.background = 'rgba(201,168,76,0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: 13,
                  marginBottom: 24,
                  textAlign: 'center',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading
                  ? 'rgba(201,168,76,0.5)'
                  : 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading
                  ? 'none'
                  : '0 4px 16px rgba(201,168,76,0.3)',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.3)';
                }
              }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            marginTop: 24,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{
              fontSize: 13,
              color: 'var(--white-40)',
              marginBottom: 12,
            }}>
              Already have an account?
            </p>
            <Link
              to="/login"
              style={{
                color: 'var(--gold)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--gold-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--gold)';
              }}
            >
              SIGN IN →
            </Link>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: 24,
          }}>
            <p style={{ fontSize: 11, color: 'var(--white-20)' }}>
              © 2026 1M Motors. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
