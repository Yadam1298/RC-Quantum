import React from 'react';

const EmployeeFormModal = ({
  open,
  editing,
  formData,
  setFormData,
  onClose,
  onSave,
}) => {
  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!formData.empID.trim()) return alert('Employee ID is required');
    if (!formData.cardUID.trim()) return alert('Card UID is required');
    if (!formData.name.trim()) return alert('Employee Name is required');
    if (!formData.phone.trim()) return alert('Phone Number is required');
    if (!formData.email.trim()) return alert('Email is required');

    if (!editing && !formData.password.trim())
      return alert('Password is required');

    if (!formData.designation.trim()) return alert('Designation is required');

    onSave();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>{editing ? 'Edit Employee' : 'Add Employee'}</h2>

          <button style={closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={bodyStyle}>
          <Input
            label="Employee ID"
            name="empID"
            value={formData.empID}
            onChange={handleChange}
            disabled={editing}
          />

          <Input
            label="RFID Card UID"
            name="cardUID"
            value={formData.cardUID}
            onChange={handleChange}
          />

          <Input
            label="Employee Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {!editing && (
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          )}

          <Input
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />

          <div style={field}>
            <label style={labelStyle}>Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={input}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>

        <div style={footerStyle}>
          <button style={cancelButton} onClick={onClose}>
            Cancel
          </button>

          <button style={saveButton} onClick={validate}>
            {editing ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, type = 'text', ...props }) => (
  <div style={field}>
    <label style={labelStyle}>{label}</label>

    <input
      type={type}
      placeholder={label}
      autoComplete="off"
      {...props}
      style={{
        ...input,
        background: props.disabled ? '#f1f5f9' : '#fff',
      }}
    />
  </div>
);

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.45)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalStyle = {
  width: 700,
  maxWidth: '95%',
  maxHeight: '90vh',
  overflowY: 'auto',
  background: '#fff',
  borderRadius: 15,
  boxShadow: '0 20px 50px rgba(0,0,0,.25)',
};

const headerStyle = {
  padding: '20px 25px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #eee',
};

const bodyStyle = {
  padding: 25,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
  gap: 18,
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
  padding: 20,
  borderTop: '1px solid #eee',
};

const field = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: 6,
  fontWeight: 600,
  fontSize: 14,
};

const input = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  outline: 'none',
  fontSize: 14,
};

const closeButton = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 22,
};

const cancelButton = {
  background: '#94a3b8',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  cursor: 'pointer',
};

const saveButton = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

export default EmployeeFormModal;
