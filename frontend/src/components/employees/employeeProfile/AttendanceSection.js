import React from 'react';

const AttendanceSection = () => {
  const stats = [
    { number: '95%', label: 'Attendance Rate' },
    { number: '22', label: 'Present Days' },
    { number: '3', label: 'Absent Days' },
    { number: '2', label: 'Late Arrivals' },
  ];

  return (
    <div style={styles.attendanceSection}>
      <h3 style={styles.sectionTitle}>Attendance Records</h3>
      <div style={styles.attendanceStats}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statNumber}>{stat.number}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={styles.attendanceTableContainer}>
        <table style={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: 'center',
                  padding: '40px 0',
                  color: '#94a3b8',
                }}
              >
                No attendance records found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  attendanceSection: {
    padding: '20px 0',
  },
  sectionTitle: {
    fontSize: 'clamp(18px, 2vw, 20px)',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 20,
  },
  attendanceStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(130px, 100%), 1fr))',
    gap: 'clamp(15px, 2vw, 20px)',
    marginBottom: 30,
  },
  statCard: {
    background: '#f8fafc',
    padding: 'clamp(15px, 2vw, 20px)',
    borderRadius: 8,
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 'clamp(24px, 3vw, 28px)',
    fontWeight: 700,
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    color: '#64748b',
    marginTop: 5,
  },
  attendanceTableContainer: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  attendanceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 400,
  },
};

export default AttendanceSection;
