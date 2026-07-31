const express = require('express');
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  updateProfileImage,
  getMyProfile,      
  updateMyProfile,   
} = require('../controllers/employeeController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// 1. All routes require authentication
router.use(protect);

// ==========================================
// EMPLOYEE SELF-SERVICE ROUTES (Must be FIRST)
// ==========================================
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// ==========================================
// ADMIN & SUPERADMIN RESTRICTED ROUTES
// ==========================================
router.use(authorizeRoles('superadmin', 'admin'));

router.get('/', getAllEmployees);
router.get('/:empID', getEmployeeById);
router.put('/:empID', updateEmployee);
router.delete('/:empID', deleteEmployee);
router.patch('/:empID/status', toggleEmployeeStatus);
router.patch('/:empID/profile-image', updateProfileImage);

module.exports = router;