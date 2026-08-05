const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

// =====================================================================
// Employee & Admin shared routes (with role-based filtering)
// =====================================================================
router.get('/', getTasks);                      // Employee sees own, admin sees all
router.get('/:id', getTaskById);               // Employee sees own, admin sees any

// =====================================================================
// Routes that employees can use to update status (their own tasks)
// =====================================================================
router.put('/:id/status', updateTaskStatus);    // Employee or admin can update status

// =====================================================================
// Admin / SuperAdmin only routes
// =====================================================================
router.use(authorizeRoles('admin', 'superadmin'));

router.post('/', createTask);                   // Create task
router.put('/:id', updateTask);                // Full update (reassign, edit details)
router.delete('/:id', deleteTask);             // Delete task

module.exports = router;