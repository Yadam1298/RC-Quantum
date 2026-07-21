import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  maxLength,
  autoComplete = 'off',
}) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        style={{
          ...styles.input,
          ...(error ? styles.inputError : {}),
          ...(disabled ? styles.inputDisabled : {}),
        }}
      />
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

const styles = {
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: '100%',
  },
  label: {
    fontSize: 'clamp(13px, 1.2vw, 14px)',
    fontWeight: 600,
    color: '#0f172a',
  },
  required: {
    color: '#dc2626',
    marginLeft: 4,
  },
  input: {
    padding: '10px 14px',
    fontSize: 'clamp(14px, 1.2vw, 15px)',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    transition: 'all 0.2s',
    outline: 'none',
    background: '#fff',
    color: '#0f172a',
    fontFamily: 'inherit',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
  },
  inputError: {
    borderColor: '#dc2626',
    ':focus': {
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
    },
  },
  inputDisabled: {
    background: '#f1f5f9',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  errorText: {
    fontSize: 'clamp(12px, 1vw, 13px)',
    color: '#dc2626',
  },
};

export default FormField;
