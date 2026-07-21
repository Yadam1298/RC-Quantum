import React, { useMemo, useState } from 'react';

const EmployeeList = ({ employees, onSelect }) => {
  const [search, setSearch] = useState('');

  // Filter employees based on search input
  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return employees.filter((emp) => {
      const empID = (emp.empID || '').toLowerCase();
      const name = (emp.name || '').toLowerCase();
      return empID.includes(searchLower) || name.includes(searchLower);
    });
  }, [employees, search]);

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Employee ID or Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* Employee Cards Grid */}
      <div style={styles.grid}>
        {filtered.map((emp) => (
          <div
            key={emp._id || emp.empID}
            onClick={() => onSelect && onSelect(emp.empID)}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow =
                '0 12px 28px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(0, 0, 0, 0.06)';
            }}
          >
            <img
              src={
                emp.profileImage || 'https://via.placeholder.com/80?text=User'
              }
              alt={emp.name || 'Employee'}
              style={styles.avatar}
            />
            <h3 style={styles.name}>{emp.name || 'Unknown Employee'}</h3>
            <p style={styles.id}>
              <strong>ID:</strong> {emp.empID || '-'}
            </p>
            <p style={styles.designation}>{emp.designation || '-'}</p>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filtered.length === 0 && (
        <div style={styles.noResults}>
          No employees found matching your search.
        </div>
      )}
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────

const styles = {
  container: {
    padding: '20px 0',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  searchInput: {
    padding: '12px 18px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '40px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    marginBottom: '28px',
    fontSize: '15px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '24px',
  },

  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px 16px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #eaedf2',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textAlign: 'center',
  },

  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '16px',
    border: '3px solid #f0f4fe',
  },

  name: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: 600,
    color: '#0b1a33',
    letterSpacing: '-0.3px',
  },

  id: {
    margin: '0 0 4px 0',
    color: '#5b6f87',
    fontSize: '14px',
  },

  designation: {
    margin: 0,
    color: '#8a9bb5',
    fontSize: '13px',
    fontWeight: 500,
  },

  noResults: {
    textAlign: 'center',
    marginTop: '48px',
    color: '#8a9bb5',
    fontSize: '16px',
  },
};

export default EmployeeList;
