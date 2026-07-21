import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AllEmployees from './pages/AllEmployees';
import PrivateRoute from './components/PrivateRoute';
import EmployeeProfile from './pages/EmployeeProfile';
import EditProfile from './pages/editEmployeeProfile';
import AttendancePage from './pages/AttendancePage';
import EmployeeAttendance from './components/attendance/EmployeeAttendance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="all-employees" replace />} />

          <Route path="all-employees" element={<AllEmployees />} />

          <Route path="attendance" element={<AttendancePage />} />

          <Route
            path="attendance/employee/:empID"
            element={<EmployeeAttendance />}
          />

          <Route path="employee/profile/:empID" element={<EmployeeProfile />} />

          <Route path="employee/edit/:empID" element={<EditProfile />} />
        </Route>

        <Route
          path="/"
          element={<Navigate to="/dashboard/all-employees" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard/all-employees" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
