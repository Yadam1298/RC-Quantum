// FormSelect.js
import React from 'react';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
}) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label} htmlFor={name}>
        {label}
        {required && <span style={styles.required}>*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        style={{
          ...styles.select,
          ...(error ? styles.selectError : {}),
          ...(disabled ? styles.selectDisabled : {}),
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
  select: {
    padding: '10px 14px',
    fontSize: 'clamp(14px, 1.2vw, 15px)',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    transition: 'all 0.2s',
    outline: 'none',
    background: '#fff',
    color: '#0f172a',
    fontFamily: 'inherit',
    cursor: 'pointer',
    appearance: 'auto',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
  },
  selectError: {
    borderColor: '#dc2626',
    ':focus': {
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
    },
  },
  selectDisabled: {
    background: '#f1f5f9',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  errorText: {
    fontSize: 'clamp(12px, 1vw, 13px)',
    color: '#dc2626',
    marginTop: '2px',
  },
};

export default FormSelect;
