import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO, isSameDay } from 'date-fns';

const EmployeeCalendar = ({
  selectedDate,
  onDateChange,
  onMonthChange,
  calendarData,
}) => {
  // Build a map of date strings -> total minutes
  const dateMap = {};
  calendarData.forEach((item) => {
    const dateStr = format(parseISO(item.date), 'yyyy-MM-dd');
    dateMap[dateStr] = item.totalMinutes;
  });

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      const minutes = dateMap[dateStr];
      if (minutes !== undefined) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return (
          <div
            style={{ fontSize: '0.6rem', color: '#2c3e50', marginTop: '2px' }}
          >
            {hours > 0 ? `${hours}h ` : ''}
            {mins > 0 ? `${mins}m` : ''}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (dateMap[dateStr] !== undefined) {
        return 'attendance-marked';
      }
    }
    return null;
  };

  return (
    <div>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          onMonthChange(activeStartDate)
        }
        tileContent={tileContent}
        tileClassName={tileClassName}
        maxDetail="month"
        minDetail="month"
        calendarType="gregory"
      />
      <style>
        {`
          .attendance-marked {
            background-color: #e8f5e9 !important;
            border-radius: 50%;
          }
          .attendance-marked:hover {
            background-color: #c8e6c9 !important;
          }
        `}
      </style>
    </div>
  );
};

export default EmployeeCalendar;
