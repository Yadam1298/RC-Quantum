// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerEmployee,
  loginEmployee,
  VerifyToken,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public Route
router.post('/login', loginEmployee);

// Protected Route - Only Super Admin can create new users (Admin or Employee)
router.post(
  '/register',
  protect,
  authorizeRoles('superadmin'),
  registerEmployee,
);

router.post('/verify-token', VerifyToken);

module.exports = router;
