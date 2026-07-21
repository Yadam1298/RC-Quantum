import React from 'react';

const DeleteDialog = ({ open, employee, onClose, onConfirm }) => {
  if (!open || !employee) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 55,
            }}
          >
            🗑️
          </div>

          <h2
            style={{
              color: '#dc2626',
              marginBottom: 10,
            }}
          >
            Delete Employee
          </h2>

          <p
            style={{
              color: '#64748b',
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to permanently delete
            <br />
            <strong>{employee.name}</strong>
            <br />({employee.empID}) ?
          </p>

          <p
            style={{
              color: '#dc2626',
              fontWeight: 600,
            }}
          >
            This action cannot be undone.
          </p>
        </div>

        <div style={footer}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button style={deleteBtn} onClick={onConfirm}>
            Delete Employee
          </button>
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.45)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modal = {
  width: 420,
  maxWidth: '95%',
  background: '#fff',
  borderRadius: 15,
  padding: 30,
  boxShadow: '0 20px 50px rgba(0,0,0,.25)',
};

const footer = {
  marginTop: 25,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
};

const cancelBtn = {
  background: '#94a3b8',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  cursor: 'pointer',
};

const deleteBtn = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

export default DeleteDialog;
