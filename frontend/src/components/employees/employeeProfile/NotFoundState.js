import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundState = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>👤</div>
      <h3 style={styles.errorTitle}>Employee Not Found</h3>
      <p style={styles.errorMessage}>
        The employee you're looking for doesn't exist or has been removed.
      </p>
      <button
        onClick={() => navigate('/dashboard/employees')}
        style={styles.backButton}
      >
        Back to Employees
      </button>
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
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#2563eb',
    fontSize: 16,
    cursor: 'pointer',
    padding: '10px 24px',
    borderRadius: 6,
    fontWeight: 500,
  },
};

export default NotFoundState;
