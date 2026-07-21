// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.6:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('employee');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// ==================== AUTH APIS ====================
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ==================== ATTENDANCE APIS ====================
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getAttendanceLogs: (empID, params = {}) =>
    api.get(`/attendance/employee/${empID}`, { params }),
};

// ==================== EMPLOYEE APIS ====================

export const employeeAPI = {
  // Get All Employees
  getAllEmployees: () => api.get('/employees'),

  // Get Single Employee
  getEmployee: (empID) => api.get(`/employees/${empID}`),

  // Register Employee
  addEmployee: (data) => api.post('/auth/register', data),

  // Update Employee
  updateEmployee: (empID, data) => api.put(`/employees/${empID}`, data),

  // Delete Employee
  deleteEmployee: (empID) => api.delete(`/employees/${empID}`),

  // Activate / Deactivate Employee
  // Activate / Deactivate Employee
  toggleStatus: (empID) => api.patch(`/employees/${empID}/status`),
};

// ========== Employees ==========
export const getEmployees = async () => {
  const response = await api.get('/employees'); // Assuming you have a /employees route
  return response.data;
};

// ========== Attendance ==========
export const getAttendanceLogs = async (params) => {
  const response = await api.get('/attendance/logs', { params });
  return response.data;
};

export const getEmployeeAttendanceByDate = async (employeeId, date) => {
  const response = await api.get(`/attendance/employee/${employeeId}`, {
    params: { date },
  });
  return response.data;
};

export const getEmployeeCalendar = async (employeeId, year, month) => {
  const response = await api.get(
    `/attendance/employee/${employeeId}/calendar`,
    {
      params: { year, month },
    },
  );
  return response.data;
};

export const getAttendanceDashboard = async () => {
  const res = await api.get('/attendance/dashboard');

  return res.data;
};

export default api;
