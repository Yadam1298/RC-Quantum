// EditProfileForm.js
import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSelect from './FormSelect';
import FormActions from './FormActions';

const EditProfileForm = ({
  employee,
  onSubmit,
  onCancel,
  isSubmitting,
  isMobile = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    role: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        designation: employee.designation || '',
        role: employee.role || '',
        status: employee.status || '',
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formHeader}>
        <h2 style={styles.formTitle}>Personal Information</h2>
        <p style={styles.formSubtitle}>Update your personal details below</p>
      </div>

      <div style={styles.formGrid} className="edit-profile-form-grid">
        <div style={styles.formColumn}>
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : ''}
            required
            placeholder="Enter full name"
            maxLength={50}
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
            required
            placeholder="Enter email address"
            autoComplete="email"
          />

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : ''}
            placeholder="Enter phone number"
            maxLength={15}
          />
        </div>

        <div style={styles.formColumn}>
          <FormField
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.designation ? errors.designation : ''}
            required
            placeholder="Enter designation"
            maxLength={50}
          />

          <FormSelect
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            error={touched.role ? errors.role : ''}
            required
            placeholder="Select role"
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            error={touched.status ? errors.status : ''}
            required
            placeholder="Select status"
          />
        </div>
      </div>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isMobile={isMobile}
      />
    </form>
  );
};

const styles = {
  form: {
    padding: 'clamp(20px, 3vw, 30px)',
  },
  formHeader: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
  },
  formTitle: {
    fontSize: 'clamp(18px, 2vw, 22px)',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0,
    marginBottom: '5px',
  },
  formSubtitle: {
    fontSize: 'clamp(14px, 1.2vw, 15px)',
    color: '#64748b',
    margin: 0,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(20px, 2vw, 30px)',
    marginBottom: 30,
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(15px, 2vw, 20px)',
  },
};

// Add CSS for responsive design using a style element
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @media (max-width: 768px) {
    .edit-profile-form-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default EditProfileForm;
