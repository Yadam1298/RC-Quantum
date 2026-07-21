import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  EmployeeProfileHeader,
  ProfileTabs,
  ProfileDetails,
  AttendanceSection,
  HistorySection,
  LoadingState,
  ErrorState,
  NotFoundState,
} from '../components/employees/employeeProfile';

const EmployeeProfile = ({ isMobile }) => {
  const { empID } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [updating, setUpdating] = useState(false);

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
          console.log('Employee data:', response.data.employee);
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

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this employee?'))
      return;

    try {
      setUpdating(true);
      const response = await api.delete(
        `/employees/${empID}`,
        getAuthHeaders(),
      );

      if (response.data.success) {
        alert('Employee deleted successfully');
        navigate('/dashboard/all-employees');
      } else {
        alert(response.data.message || 'Failed to delete employee');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setUpdating(false);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async () => {
    try {
      setUpdating(true);
      const response = await api.patch(
        `/employees/${empID}/status`,
        {},
        getAuthHeaders(),
      );

      if (response.data.success) {
        setEmployee(response.data.employee);
        alert(`Employee ${response.data.employee.status}`);
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Status toggle error:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  // Handle edit navigation
  const handleEdit = () => {
    navigate(`/dashboard/employee/edit/${employee.empID}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
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

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileDetails
            employee={employee}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
          />
        );
      case 'attendance':
        return <AttendanceSection />;
      case 'history':
        return (
          <HistorySection employee={employee} formatDateTime={formatDateTime} />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with back button */}
      <div style={styles.header}>
        <button
          onClick={() => navigate('/dashboard/employees')}
          style={styles.backButton}
        >
          ← Back to Employees
        </button>
        <h1 style={styles.title}>Employee Profile</h1>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <EmployeeProfileHeader
          employee={employee}
          updating={updating}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div style={styles.tabContent}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '20px',
    maxWidth: 1200,
    margin: '0 auto',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#2563eb',
    fontSize: 'clamp(14px, 2vw, 16px)',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: 6,
    transition: 'all 0.2s',
    fontWeight: 500,
    ':hover': {
      background: '#eff6ff',
    },
  },
  profileCard: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  tabContent: {
    padding: 'clamp(20px, 3vw, 30px)',
  },
};

// Add keyframe animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Media Queries for better responsiveness */
  @media (max-width: 768px) {
    .desktop-actions {
      display: none !important;
    }
    .mobile-actions {
      display: block !important;
    }
    .profile-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .profile-info {
      text-align: center;
    }
    .action-buttons {
      justify-content: center;
    }
  }
  
  @media (min-width: 769px) {
    .desktop-actions {
      display: flex !important;
    }
    .mobile-actions {
      display: none !important;
    }
  }
  
  /* Touch-friendly interactions */
  @media (hover: none) {
    button:hover {
      transform: none !important;
    }
  }
  
  /* Tablet optimizations */
  @media (min-width: 768px) and (max-width: 1024px) {
    .details-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .attendance-stats {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .details-grid {
      grid-template-columns: 1fr !important;
    }
    .attendance-stats {
      grid-template-columns: 1fr 1fr !important;
    }
    .tabs-container {
      gap: 10px !important;
    }
    .tab-button {
      font-size: 13px !important;
      padding: 10px 0 !important;
    }
    .header {
      gap: 10px !important;
    }
    .container {
      padding: 10px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default EmployeeProfile;
