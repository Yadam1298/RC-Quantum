import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

const API_BASE_URL = 'http://192.168.0.6:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically from Capacitor Preferences
api.interceptors.request.use(
  async (config) => {
    const { value: token } = await Preferences.get({ key: 'token' });
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
  async (error) => {
    if (error.response?.status === 401) {
      await Preferences.remove({ key: 'token' });
      await Preferences.remove({ key: 'employee' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// ==================== AUTH APIS ====================
export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
};

// ==================== ATTENDANCE APIS ====================
export const attendanceAPI = {
  markAttendance: (data: any) => api.post('/attendance/mark', data),
  getAttendanceLogs: (empID: string | number, params = {}) =>
    api.get(`/attendance/employee/${empID}`, { params }),
};

// ==================== EMPLOYEE APIS ====================
export const employeeAPI = {
  getAllEmployees: () => api.get('/employees'),
  getEmployee: (empID: string | number) => api.get(`/employees/${empID}`),
  addEmployee: (data: any) => api.post('/auth/register', data),
  updateEmployee: (empID: string | number, data: any) => api.put(`/employees/${empID}`, data),
  deleteEmployee: (empID: string | number) => api.delete(`/employees/${empID}`),
  toggleStatus: (empID: string | number) => api.patch(`/employees/${empID}/status`),
};

// ========== Extra Functions ==========
export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const getAttendanceLogs = async (params: any) => {
  const response = await api.get('/attendance/logs', { params });
  return response.data;
};

export const getEmployeeAttendanceByDate = async (employeeId: string | number, date: string) => {
  const response = await api.get(`/attendance/employee/${employeeId}`, {
    params: { date },
  });
  return response.data;
};

export const getEmployeeCalendar = async (employeeId: string | number, year: number, month: number) => {
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