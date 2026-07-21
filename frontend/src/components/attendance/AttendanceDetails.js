import React from 'react';
import { format } from 'date-fns';

const AttendanceDetails = ({ data }) => {
  const { employee, date, pairs, totalMinutes } = data;

  const formatTime = (isoDate) => {
    return isoDate ? format(new Date(isoDate), 'hh:mm a') : '—';
  };

  const formatDuration = (minutes) => {
    if (minutes === null) return '—';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div
      style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}
    >
      <h3>
        {employee?.name} ({employee?.empID})
      </h3>
      <p>
        <strong>Date:</strong> {format(new Date(date), 'PPP')}
      </p>
      <p>
        <strong>Total hours:</strong> {formatDuration(totalMinutes)}
      </p>
      <hr />
      <h4>Check‑in / Check‑out</h4>
      {pairs.length === 0 ? (
        <p>No complete pairs for this day.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Check‑In</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Check‑Out</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{idx + 1}</td>
                <td style={{ padding: '8px' }}>{formatTime(pair.checkIn)}</td>
                <td style={{ padding: '8px' }}>{formatTime(pair.checkOut)}</td>
                <td style={{ padding: '8px' }}>
                  {formatDuration(pair.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceDetails;
