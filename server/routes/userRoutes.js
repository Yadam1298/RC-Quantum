const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication token
router.use(protect);

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);

module.exports = router;