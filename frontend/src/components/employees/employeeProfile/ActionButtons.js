import React from 'react';

const ActionButtons = ({
  empID,
  status,
  updating,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div style={styles.actionButtons}>
      <button onClick={onEdit} style={styles.editButton} disabled={updating}>
        ✏️ Edit Profile
      </button>
      <button
        onClick={onToggleStatus}
        style={{
          ...styles.statusToggleButton,
          background: status === 'active' ? '#ea580c' : '#16a34a',
        }}
        disabled={updating}
      >
        {status === 'active' ? '🔴 Deactivate' : '🟢 Activate'}
      </button>
      <button
        onClick={onDelete}
        style={styles.deleteButton}
        disabled={updating}
      >
        🗑️ Delete
      </button>
    </div>
  );
};

const styles = {
  actionButtons: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  editButton: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    ':hover': {
      background: '#1d4ed8',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  statusToggleButton: {
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  deleteButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    ':hover': {
      background: '#b91c1c',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
};

export default ActionButtons;
