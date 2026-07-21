import React from 'react';

const EmployeeInfo = ({ name, email, empID }) => {
  return (
    <div style={styles.profileInfo}>
      <h2 style={styles.employeeName}>{name}</h2>
      <p style={styles.employeeEmail}>{email}</p>
      <p style={styles.employeeId}>Employee ID: {empID}</p>
    </div>
  );
};

const styles = {
  profileInfo: {
    flex: 1,
    minWidth: 180,
  },
  employeeName: {
    fontSize: 'clamp(20px, 3vw, 24px)',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
    wordBreak: 'break-word',
  },
  employeeEmail: {
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    color: '#64748b',
    margin: '5px 0',
    wordBreak: 'break-word',
  },
  employeeId: {
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    color: '#64748b',
    margin: 0,
  },
};

export default EmployeeInfo;
