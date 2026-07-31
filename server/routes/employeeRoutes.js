const express = require('express');
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  updateProfileImage,
  getMyProfile,       // New self-service controller
  updateMyProfile,    // New self-service controller
} = require('../controllers/employeeController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// 1. All routes require the user to be logged in (have a valid token)
router.use(protect);

// ==========================================
// EMPLOYEE SELF-SERVICE ROUTES (Any Role)
// ==========================================
// Employees can view and edit their own information
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// ==========================================
// ADMIN & SUPERADMIN RESTRICTED ROUTES
// ==========================================
// Apply role authorization middleware only for routes below this line
router.use(authorizeRoles('superadmin', 'admin'));

router.get('/', getAllEmployees);
router.get('/:empID', getEmployeeById);
router.put('/:empID', updateEmployee);
router.delete('/:empID', deleteEmployee);
router.patch('/:empID/status', toggleEmployeeStatus);
router.patch('/:empID/profile-image', updateProfileImage);

module.exports = router;