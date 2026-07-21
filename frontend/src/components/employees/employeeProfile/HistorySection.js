import React from 'react';

const HistorySection = ({ employee, formatDateTime }) => {
  const historyItems = [
    {
      icon: '📝',
      title: 'Last Updated',
      description: 'Employee details were updated',
      time: employee.updatedAt,
    },
    {
      icon: '✅',
      title: 'Current Status',
      description: `Employee is ${employee.status}`,
      time: employee.updatedAt || employee.createdAt,
    },
    {
      icon: '👤',
      title: 'Employee Created',
      description: 'New employee account created',
      time: employee.createdAt,
    },
  ];

  return (
    <div style={styles.historySection}>
      <h3 style={styles.sectionTitle}>Activity History</h3>
      <div style={styles.historyList}>
        {historyItems.map((item, index) => (
          <div key={index} style={styles.historyItem}>
            <div style={styles.historyIcon}>{item.icon}</div>
            <div style={styles.historyContent}>
              <p style={styles.historyTitle}>{item.title}</p>
              <p style={styles.historyDesc}>{item.description}</p>
              <p style={styles.historyTime}>{formatDateTime(item.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  historySection: {
    padding: '20px 0',
  },
  sectionTitle: {
    fontSize: 'clamp(18px, 2vw, 20px)',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 20,
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  historyItem: {
    display: 'flex',
    gap: 15,
    padding: 'clamp(12px, 2vw, 15px)',
    background: '#f8fafc',
    borderRadius: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  historyIcon: {
    fontSize: 'clamp(20px, 2.5vw, 24px)',
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0,
  },
  historyDesc: {
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    color: '#64748b',
    margin: '5px 0',
  },
  historyTime: {
    fontSize: 'clamp(11px, 1vw, 12px)',
    color: '#94a3b8',
    margin: 0,
  },
};

export default HistorySection;
