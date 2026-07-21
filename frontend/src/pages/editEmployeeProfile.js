// EditEmployeeProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  LoadingState,
  ErrorState,
  NotFoundState,
} from '../components/employees/employeeProfile';
import {
  EditProfileHeader,
  EditProfileForm,
} from '../components/employees/editEmployeeProfile';

const EditEmployeeProfile = ({ isMobile }) => {
  const { empID } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUpdating, setIsImageUpdating] = useState(false);

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/employees/${empID}`);

        if (response.data.success) {
          setEmployee(response.data.employee);
        } else {
          setError(response.data.message || 'Failed to load employee details');
        }
      } catch (err) {
        console.error('Error fetching employee:', err);
        if (err.response?.status === 404) {
          setError('Employee not found');
        } else if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError(
            err.response?.data?.message || 'Failed to load employee details',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (empID) {
      fetchEmployee();
    } else {
      setError('Invalid employee ID');
      setLoading(false);
    }
  }, [empID]);

  // Handle full form submission
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Use the main update endpoint
      const response = await api.put(
        `/employees/${empID}`,
        formData,
        getAuthHeaders(),
      );

      if (response.data.success) {
        alert('Employee profile updated successfully!');
        navigate(`/dashboard/employee/${empID}`);
      } else {
        setError(response.data.message || 'Failed to update employee profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.status === 400) {
        const serverErrors = err.response?.data?.errors;
        if (serverErrors) {
          setError('Please check the form for errors');
        } else {
          setError(err.response?.data?.message || 'Failed to update employee');
        }
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to update employee');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image only update - Use the same endpoint but only send image data
  const handleImageUpdate = async (base64Image) => {
    try {
      setIsImageUpdating(true);
      setError(null);

      // Send only the image data to the main update endpoint
      const response = await api.put(
        `/employees/${empID}`,
        {
          profileImage: base64Image,
          // Keep existing data to prevent overwriting other fields
          name: employee.name,
          email: employee.email,
          phone: employee.phone || '',
          designation: employee.designation,
          role: employee.role,
          status: employee.status,
        },
        getAuthHeaders(),
      );

      if (response.data.success) {
        // Update local state
        setEmployee((prev) => ({
          ...prev,
          profileImage: base64Image,
        }));
        alert('Profile image updated successfully!');
      } else {
        setError(response.data.message || 'Failed to update profile image');
      }
    } catch (err) {
      console.error('Image update error:', err);
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError(
          err.response?.data?.message || 'Failed to update profile image',
        );
      }
    } finally {
      setIsImageUpdating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (
      window.confirm(
        'Are you sure you want to cancel? Any changes will be lost.',
      )
    ) {
      navigate(`/dashboard/employee/${empID}`);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    if (error === 'Employee not found') {
      return <NotFoundState />;
    }
    return (
      <ErrorState error={error} onRetry={() => window.location.reload()} />
    );
  }

  // No employee found
  if (!employee) {
    return <NotFoundState />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <EditProfileHeader
          employee={employee}
          onImageUpdate={handleImageUpdate}
          isUpdating={isImageUpdating}
        />
        <EditProfileForm
          employee={employee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: 900,
    margin: '0 auto',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
};

export default EditEmployeeProfile;
