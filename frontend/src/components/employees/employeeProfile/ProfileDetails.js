import React from 'react';

const ProfileDetails = ({ employee, formatDate, formatDateTime }) => {
  const detailItems = [
    { label: 'Full Name', value: employee.name || 'N/A' },
    { label: 'Email Address', value: employee.email || 'N/A' },
    { label: 'Employee ID', value: employee.empID || 'N/A' },
    { label: 'Card UID', value: employee.cardUID || 'N/A' },
    { label: 'Phone Number', value: employee.phone || 'N/A' },
    { label: 'Designation', value: employee.designation || 'N/A' },
    {
      label: 'Role',
      value: employee.role || 'User',
      isBadge: true,
      badgeColor:
        employee.role === 'admin'
          ? '#2563eb'
          : employee.role === 'superadmin'
            ? '#dc2626'
            : '#16a34a',
    },
    {
      label: 'Status',
      value: employee.status || 'Inactive',
      isStatus: true,
      statusColor: employee.status === 'active' ? '#166534' : '#991B1B',
      statusBg: employee.status === 'active' ? '#DCFCE7' : '#FEE2E2',
    },
    { label: 'Date of Joining', value: formatDate(employee.createdAt) },
    { label: 'Last Updated', value: formatDateTime(employee.updatedAt) },
  ];

  return (
    <div style={styles.profileDetails}>
      <div style={styles.detailsGrid}>
        {detailItems.map((item, index) => (
          <div key={index} style={styles.detailItem}>
            <label style={styles.detailLabel}>{item.label}</label>
            {item.isBadge ? (
              <p style={styles.detailValue}>
                <span
                  style={{
                    ...styles.roleBadge,
                    background: item.badgeColor,
                  }}
                >
                  {item.value}
                </span>
              </p>
            ) : item.isStatus ? (
              <p style={styles.detailValue}>
                <span
                  style={{
                    ...styles.statusBadge,
                    background: item.statusBg,
                    color: item.statusColor,
                  }}
                >
                  {item.value}
                </span>
              </p>
            ) : (
              <p style={styles.detailValue}>{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  profileDetails: {
    padding: '0 0 20px 0',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
    gap: 'clamp(20px, 2vw, 25px)',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  detailLabel: {
    fontSize: 'clamp(11px, 1.2vw, 13px)',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    color: '#0f172a',
    margin: 0,
    fontWeight: 500,
    wordBreak: 'break-word',
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: 20,
    color: '#fff',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    display: 'inline-block',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 'clamp(12px, 1.5vw, 14px)',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
  },
};

export default ProfileDetails;
