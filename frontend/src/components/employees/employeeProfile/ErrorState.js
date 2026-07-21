import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorState = ({ error, onRetry }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>⚠️</div>
      <h3 style={styles.errorTitle}>Error</h3>
      <p style={styles.errorMessage}>{error}</p>
      <div style={styles.errorActions}>
        <button onClick={onRetry} style={styles.retryButton}>
          Retry
        </button>
        <button
          onClick={() => navigate('/dashboard/employees')}
          style={styles.backButton}
        >
          Back to Employees
        </button>
      </div>
    </div>
  );
};

const styles = {
  errorContainer: {
    textAlign: 'center',
    padding: 'clamp(30px, 5vw, 60px)',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: 500,
    margin: '40px auto',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    color: '#0f172a',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#64748b',
    marginBottom: 24,
  },
  errorActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  retryButton: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#2563eb',
    fontSize: 14,
    cursor: 'pointer',
    padding: '10px 24px',
    borderRadius: 6,
    fontWeight: 500,
  },
};

export default ErrorState;
