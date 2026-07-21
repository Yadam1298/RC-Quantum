// FormActions.js
import React from 'react';

const FormActions = ({
  onCancel,
  isSubmitting,
  submitText = 'Save Changes',
  cancelText = 'Cancel',
  isMobile = false,
}) => {
  return (
    <div style={isMobile ? styles.mobileActions : styles.actions}>
      <button
        type="button"
        onClick={onCancel}
        style={styles.cancelButton}
        disabled={isSubmitting}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        style={{
          ...styles.submitButton,
          ...(isSubmitting ? styles.submitDisabled : {}),
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span style={styles.spinnerSmall}></span>
            Saving...
          </>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
};

const styles = {
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 10,
    flexWrap: 'wrap',
    paddingTop: 20,
    borderTop: '1px solid #e2e8f0',
  },
  mobileActions: {
    display: 'flex',
    gap: 10,
    flexDirection: 'column',
    marginTop: 10,
    width: '100%',
    paddingTop: 20,
    borderTop: '1px solid #e2e8f0',
  },
  cancelButton: {
    padding: '10px 24px',
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 'clamp(14px, 1.2vw, 15px)',
    transition: 'all 0.2s',
    ':hover': {
      background: '#f1f5f9',
      borderColor: '#94a3b8',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  submitButton: {
    padding: '10px 32px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 'clamp(14px, 1.2vw, 15px)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    minWidth: 140,
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    },
  },
  submitDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    ':hover': {
      transform: 'none',
      boxShadow: 'none',
    },
  },
  spinnerSmall: {
    display: 'inline-block',
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

export default FormActions;
