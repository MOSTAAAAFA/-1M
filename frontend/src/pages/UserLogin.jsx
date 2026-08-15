import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Brand1M from '../components/Brand1M';
import API_BASE from '../utils/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Real-time validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear errors on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    setServerError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email') {
      if (!value) {
        error = 'Email is required';
      } else if (!validateEmail(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (!validatePassword(value)) {
        error = 'Password must be at least 6 characters';
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validate all fields
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Redirect to home
        navigate('/');
      } else {
        setServerError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('Connection error. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050507 0%, #0a0a0e 50%, #050507 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 2px 2px, var(--gold) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}/>

      {/* Header Section - Stacked Vertically */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px 32px',
        gap: '20px',
        zIndex: 10,
      }}>
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            background: 'rgba(17,17,23,0.8)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '10px',
            color: 'var(--gold)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s ease',
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
          <span style={{ fontSize: 16 }}>←</span>
          <span>BACK TO HOME</span>
        </button>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 50%, #F4D03F 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(201,168,76,0.4)',
          }}>
            <Brand1M style={{ fontSize: 22, fontWeight: 900, color: '#000' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '1.5px',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Brand1M style={{
              fontSize: 20,
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }} />
            <span>MOTORS</span>
          </span>
        </Link>
      </div>

      {/* Login Box */}
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
          marginTop: '80px',
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
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 600,
              color: 'var(--white)',
              marginBottom: 8,
            }}>
              Welcome Back
            </h1>

            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 4,
            }}>
              Customer Login
            </p>

            <p style={{
              fontSize: 13,
              color: 'var(--white-40)',
            }}>
              Sign in to access your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
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
                placeholder="john@example.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'var(--white)',
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.border = '1px solid var(--gold)';
                    e.target.style.background = 'rgba(201,168,76,0.05)';
                  }
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  if (!errors.email) {
                    e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
              />
              {errors.email && (
                <p style={{
                  fontSize: 12,
                  color: '#ef4444',
                  marginTop: 6,
                  fontFamily: 'var(--font-ui)',
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
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
                placeholder="••••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'var(--white)',
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.target.style.border = '1px solid var(--gold)';
                    e.target.style.background = 'rgba(201,168,76,0.05)';
                  }
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  if (!errors.password) {
                    e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
              />
              {errors.password && (
                <p style={{
                  fontSize: 12,
                  color: '#ef4444',
                  marginTop: 6,
                  fontFamily: 'var(--font-ui)',
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                fontSize: 13,
                color: 'var(--white-70)',
              }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: 'pointer',
                    accentColor: 'var(--gold)',
                  }}
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                style={{
                  fontSize: 13,
                  color: 'var(--gold)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-light)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold)'}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Server Error */}
            {serverError && (
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
                {serverError}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
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
              {loading && (
                <div style={{
                  width: 16,
                  height: 16,
                  border: '2px solid #000',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}/>
              )}
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Register Link */}
          <div style={{
            textAlign: 'center',
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{
              fontSize: 13,
              color: 'var(--white-40)',
              marginBottom: 12,
            }}>
              Don't have an account?
            </p>
            <Link
              to="/register"
              style={{
                color: 'var(--gold)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-light)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold)'}
            >
              CREATE ACCOUNT →
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

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
