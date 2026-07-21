import React from 'react';

const LoadingState = () => {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading employee details...</p>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    gap: 20,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 16,
  },
  spinner: {
    width: 50,
    height: 50,
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default LoadingState;
