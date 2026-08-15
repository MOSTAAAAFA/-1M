import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });

    // Log to analytics/monitoring service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.content}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h1 style={styles.title}>Something Went Wrong</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Dev Only)</summary>
                <pre style={styles.pre}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.actions}>
              <button onClick={this.handleReload} style={styles.btnPrimary}>
                Reload Page
              </button>
              <button onClick={this.handleGoHome} style={styles.btnSecondary}>
                Go to Home
              </button>
            </div>

            <p style={styles.support}>
              If this problem persists, please contact{' '}
              <a href="mailto:support@1mmotors.com" style={styles.link}>
                support@1mmotors.com
              </a>
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--black)',
    padding: '24px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  icon: {
    fontSize: '72px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--white)',
    marginBottom: '16px',
  },
  message: {
    fontSize: '16px',
    color: 'var(--white-70)',
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  details: {
    textAlign: 'left',
    background: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '32px',
  },
  summary: {
    color: 'var(--gold)',
    cursor: 'pointer',
    marginBottom: '12px',
    fontWeight: 600,
  },
  pre: {
    color: '#ff6b6b',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '200px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  btnPrimary: {
    background: 'var(--gold)',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    background: 'transparent',
    color: 'var(--white)',
    border: '1px solid var(--border)',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  support: {
    fontSize: '14px',
    color: 'var(--white-40)',
  },
  link: {
    color: 'var(--gold)',
    textDecoration: 'none',
  },
};

export default ErrorBoundary;
