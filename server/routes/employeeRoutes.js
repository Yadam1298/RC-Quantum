const express = require('express');

const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  updateProfileImage, // Import the new function
} = require('../controllers/employeeController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.use(authorizeRoles('superadmin', 'admin'));

router.get('/', getAllEmployees);

router.get('/:empID', getEmployeeById);

router.put('/:empID', updateEmployee);

router.delete('/:empID', deleteEmployee);

router.patch('/:empID/status', toggleEmployeeStatus);

// New route for profile image update
router.patch('/:empID/profile-image', updateProfileImage);

module.exports = router;
