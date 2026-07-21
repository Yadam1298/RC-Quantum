const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceLogs,
  getEmployeeAttendanceByDate,
  getEmployeeAttendanceDates,
  getAttendanceDashboard,
  markAttendanceMobile, // new
} = require('../controllers/AttendanceController');
const { addLocationLogs } = require('../controllers/LocationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public route – no authentication required (RFID reader)
router.post('/mark', markAttendance);

// All routes below require authentication
router.use(protect);

// Employee routes (accessible by any authenticated user)
router.post('/location', addLocationLogs);
router.post('/mobile/mark', markAttendanceMobile);

// Admin / Superadmin only
router.use(authorizeRoles('admin', 'superadmin'));

router.get('/dashboard', getAttendanceDashboard);
router.get('/logs', getAttendanceLogs);
router.get('/employee/:employeeId', getEmployeeAttendanceByDate);
router.get('/employee/:employeeId/calendar', getEmployeeAttendanceDates);

module.exports = router;
