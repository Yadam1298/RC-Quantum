import React from 'react';

const DeactivateDialog = ({ open, employee, onClose, onConfirm }) => {
  if (!open || !employee) return null;

  const active = employee.status === 'active';

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 55 }}>{active ? '🔒' : '🔓'}</div>

          <h2
            style={{
              color: active ? '#ea580c' : '#16a34a',
            }}
          >
            {active ? 'Deactivate Employee' : 'Activate Employee'}
          </h2>

          <p
            style={{
              lineHeight: 1.7,
              color: '#64748b',
            }}
          >
            Are you sure you want to
            <strong>{active ? ' deactivate ' : ' activate '}</strong>
            <br />
            <strong>{employee.name}</strong>
            <br />({employee.empID})
          </p>

          <p
            style={{
              color: active ? '#ea580c' : '#16a34a',
              fontWeight: 600,
            }}
          >
            {active
              ? 'Employee will no longer be able to login.'
              : 'Employee account will become active again.'}
          </p>
        </div>

        <div style={footer}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={active ? deactivateBtn : activateBtn}
            onClick={onConfirm}
          >
            {active ? 'Deactivate' : 'Activate'}
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
  background: '#fff',
  borderRadius: 15,
  padding: 30,
  boxShadow: '0 20px 50px rgba(0,0,0,.25)',
};

const footer = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 25,
};

const cancelBtn = {
  padding: '10px 20px',
  border: 'none',
  background: '#94a3b8',
  color: '#fff',
  borderRadius: 8,
  cursor: 'pointer',
};

const deactivateBtn = {
  padding: '10px 20px',
  border: 'none',
  background: '#ea580c',
  color: '#fff',
  borderRadius: 8,
  cursor: 'pointer',
};

const activateBtn = {
  padding: '10px 20px',
  border: 'none',
  background: '#16a34a',
  color: '#fff',
  borderRadius: 8,
  cursor: 'pointer',
};

export default DeactivateDialog;
