import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import EmployeeCalendar from './EmployeeCalendar';
import AttendanceDetails from './AttendanceDetails';
import {
  getEmployeeAttendanceByDate,
  getEmployeeCalendar,
} from '../../services/api';

const EmployeeAttendance = () => {
  const { empID } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch monthly calendar data
  const fetchCalendar = async (year, month) => {
    try {
      const data = await getEmployeeCalendar(empID, year, month);
      setCalendarData(data);
    } catch (err) {
      console.error('Error fetching calendar:', err);
    }
  };

  // Fetch attendance for selected date
  const fetchAttendanceForDate = async (date) => {
    setLoading(true);
    try {
      const formatted = format(date, 'yyyy-MM-dd');
      const data = await getEmployeeAttendanceByDate(empID, formatted);
      setAttendanceData(data);
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setAttendanceData(null); // No attendance for that date
        setError('');
      } else {
        setError('Failed to load attendance for this date');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // On mount or empID change, fetch calendar for current month and today's attendance
  useEffect(() => {
    const now = new Date();
    fetchCalendar(now.getFullYear(), now.getMonth() + 1);
    fetchAttendanceForDate(now);
  }, [empID]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAttendanceForDate(date);
  };

  const handleMonthChange = (activeStartDate) => {
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth() + 1;
    fetchCalendar(year, month);
  };

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => navigate('/dashboard/attendance')}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Employees
      </button>
      <h2>Attendance for Employee: {empID}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <EmployeeCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onMonthChange={handleMonthChange}
            calendarData={calendarData}
          />
        </div>
        <div style={{ flex: '2 1 500px' }}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : attendanceData ? (
            <AttendanceDetails data={attendanceData} />
          ) : (
            <p>No attendance records for {format(selectedDate, 'PPP')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
