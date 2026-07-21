import React from 'react';
import EmployeeAvatar from '../editEmployeeProfile/EmployeeAvatar';
import EmployeeInfo from './EmployeeInfo';
import ActionButtons from './ActionButtons';
import MobileMenu from './MobileMenu';

const EmployeeProfileHeader = ({
  employee,
  updating,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div style={styles.profileHeader}>
      <EmployeeAvatar
        name={employee.name}
        status={employee.status}
        profileImage={employee.profileImage}
      />

      <EmployeeInfo
        name={employee.name}
        email={employee.email}
        empID={employee.empID}
      />

      <div style={styles.desktopActions}>
        <ActionButtons
          empID={employee.empID}
          status={employee.status}
          updating={updating}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      </div>

      <MobileMenu
        empID={employee.empID}
        status={employee.status}
        updating={updating}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
      />
    </div>
  );
};

const styles = {
  profileHeader: {
    padding: 'clamp(20px, 3vw, 30px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(15px, 3vw, 30px)',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    position: 'relative',
  },
  desktopActions: {
    display: 'flex',
    gap: 10,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
};

export default EmployeeProfileHeader;
