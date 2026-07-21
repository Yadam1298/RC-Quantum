// EditProfileHeader.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeAvatar from './EmployeeAvatar';

const EditProfileHeader = ({ employee, onImageUpdate, isUpdating }) => {
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageUpload = async (base64Image) => {
    if (onImageUpdate) {
      try {
        await onImageUpdate(base64Image);
        setShowImageModal(false);
      } catch (error) {
        console.error('Image update failed:', error);
        // Error is already handled in the parent component
      }
    }
  };

  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <button
          onClick={() => navigate(`/dashboard/employee/${employee?.empID}`)}
          style={styles.backButton}
        >
          ← Back to Profile
        </button>
        <h1 style={styles.title}>Edit Employee Profile</h1>
      </div>
      <div style={styles.employeeInfo}>
        <div style={styles.avatarWrapper}>
          <EmployeeAvatar
            name={employee?.name || 'Employee'}
            status={employee?.status || 'active'}
            profileImage={employee?.profileImage}
            isEditing={true}
            onImageUpload={handleImageUpload}
            size="large"
          />
          {isUpdating && <div style={styles.updatingBadge}>Updating...</div>}
        </div>
        <div style={styles.employeeDetails}>
          <p style={styles.employeeName}>{employee?.name || 'Employee'}</p>
          <p style={styles.employeeId}>ID: {employee?.empID || 'N/A'}</p>
          <p style={styles.employeeDesignation}>
            {employee?.designation || 'No designation'}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'clamp(20px, 3vw, 30px)',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: 15,
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#2563eb',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: 6,
    transition: 'all 0.2s',
    fontWeight: 500,
    ':hover': {
      background: '#eff6ff',
    },
  },
  title: {
    fontSize: 'clamp(20px, 3vw, 26px)',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  employeeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  updatingBadge: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#2563eb',
    color: 'white',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: '10px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  employeeDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  employeeName: {
    fontSize: 'clamp(16px, 1.5vw, 18px)',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0,
  },
  employeeId: {
    fontSize: 'clamp(12px, 1vw, 13px)',
    color: '#64748b',
    margin: 0,
  },
  employeeDesignation: {
    fontSize: 'clamp(12px, 1vw, 13px)',
    color: '#2563eb',
    margin: 0,
    fontWeight: 500,
  },
};

export default EditProfileHeader;
