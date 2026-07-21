import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EmployeeList from '../components/attendance/EmployeeList';
import AttendanceHeader from '../components/attendance/AttendanceHeader';

import { getAttendanceDashboard, employeeAPI } from '../services/api';

const AttendancePage = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
    workingNow: 0,
    checkedOut: 0,
    attendanceRate: 0,
    averageWorkingHours: 0,
    totalPunches: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getAttendanceDashboard();

      setMetrics(response.summary || {});

      const employeeResponse = await employeeAPI.getAllEmployees();
      setEmployees(employeeResponse.data.employees || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load attendance dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = (empID) => {
    navigate(`/dashboard/attendance/employee/${empID}`);
  };

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        <h3>Loading Attendance Dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 30 }}>
        <h3 style={{ color: 'red' }}>{error}</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 25,
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <AttendanceHeader metrics={metrics} />
      <p>{employees.length} employees found.</p>
      <EmployeeList employees={employees} onSelect={handleSelectEmployee} />
    </div>
  );
};

export default AttendancePage;
