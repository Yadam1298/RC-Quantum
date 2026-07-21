import React from 'react';

const ExportCSV = ({ employees, isMobile }) => {
  const exportCSV = () => {
    if (!employees.length) return;

    const headers = [
      'Employee ID',
      'Card UID',
      'Name',
      'Email',
      'Phone',
      'Designation',
      'Role',
      'Status',
      'Created',
    ];

    const rows = employees.map((emp) => [
      emp.empID,
      emp.cardUID,
      emp.name,
      emp.email,
      emp.phone,
      emp.designation,
      emp.role,
      emp.status,
      new Date(emp.createdAt).toLocaleDateString(),
    ]);

    let csv = headers.join(',') + '\n';

    rows.forEach((row) => {
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = 'Employees.csv';

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportCSV}
      style={{
        padding: isMobile ? '4px 8px' : '10px 15px',
        background: '#16a34a',
        color: '#fff',
        border: 'none',
        borderRadius: 2,
        cursor: 'pointer',
        fontSize: isMobile ? 8 : 15,
      }}
    >
      Export CSV
    </button>
  );
};

export default ExportCSV;
