import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profile Details' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={{
            ...styles.tabButton,
            ...(activeTab === tab.id ? styles.activeTab : {}),
          }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const styles = {
  tabsContainer: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 clamp(15px, 3vw, 30px)',
    gap: 'clamp(15px, 3vw, 30px)',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  tabButton: {
    background: 'transparent',
    border: 'none',
    padding: 'clamp(12px, 1.5vw, 15px) 0',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent',
    whiteSpace: 'nowrap',
    ':hover': {
      color: '#0f172a',
    },
  },
  activeTab: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
  },
};

export default ProfileTabs;
