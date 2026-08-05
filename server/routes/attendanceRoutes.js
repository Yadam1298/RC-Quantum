const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendanceLogs,
  getEmployeeAttendanceByDate,
  getEmployeeAttendanceDates,
  getAttendanceDashboard,
  markAttendanceMobile,
  getEmployeeLocationHistory,
  getEmployeeLiveLocation,
  getLocationLogsByAttendance,
  getLocationLogsByTimeRange,
} = require("../controllers/attendanceController");
const { addLocationLogs } = require("../controllers/LocationController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public route – no authentication required (RFID reader)
router.post("/mark", markAttendance);

// All routes below require authentication
router.use(protect);

// Location routes (Employee sees own; Admin/Superadmin sees any)
router.get("/location/history", getEmployeeLocationHistory);
router.get("/location/live/:employeeId", getEmployeeLiveLocation);
router.get("/location/attendance/:attendanceId", getLocationLogsByAttendance);
router.get("/location/range/:employeeId", getLocationLogsByTimeRange);

// Employee routes (Accessible by any authenticated user)
router.post("/location", addLocationLogs);
router.post("/mobile/mark", markAttendanceMobile);

// Attendance routes accessible by Employees (for self) and Admin/Superadmin (for all)
router.get("/logs", getAttendanceLogs);
router.get("/employee/:employeeId", getEmployeeAttendanceByDate);
router.get("/employee/:employeeId/calendar", getEmployeeAttendanceDates);

// Admin / Superadmin ONLY routes
router.use(authorizeRoles("admin", "superadmin"));

router.get("/dashboard", getAttendanceDashboard);

module.exports = router;