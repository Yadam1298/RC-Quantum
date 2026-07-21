import React, { useState } from 'react';

const MobileMenu = ({
  empID,
  status,
  updating,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = (action) => {
    action();
    setShowMenu(false);
  };

  return (
    <div style={styles.mobileActions}>
      <button style={styles.menuButton} onClick={() => setShowMenu(!showMenu)}>
        ⋮
      </button>
      {showMenu && (
        <div style={styles.mobileMenu}>
          <button
            onClick={() => handleAction(onEdit)}
            style={styles.mobileMenuItem}
            disabled={updating}
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={() => handleAction(onToggleStatus)}
            style={{
              ...styles.mobileMenuItem,
              color: status === 'active' ? '#ea580c' : '#16a34a',
            }}
            disabled={updating}
          >
            {status === 'active' ? '🔴 Deactivate' : '🟢 Activate'}
          </button>
          <button
            onClick={() => handleAction(onDelete)}
            style={{ ...styles.mobileMenuItem, color: '#dc2626' }}
            disabled={updating}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  mobileActions: {
    display: 'none',
    position: 'relative',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  menuButton: {
    background: '#f1f5f9',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 24,
    cursor: 'pointer',
    fontWeight: 600,
    color: '#0f172a',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    minWidth: 180,
    zIndex: 1000,
    marginTop: 8,
    overflow: 'hidden',
  },
  mobileMenuItem: {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background 0.2s',
    ':hover': {
      background: '#f1f5f9',
    },
  },
};

export default MobileMenu;
