const Task = require('../models/Task');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// ---------- Helper: resolve employee _id from empID or ObjectId ----------
const resolveEmployeeId = async (identifier) => {
  if (!identifier) return null;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const employee = await Employee.findById(identifier).select('_id');
    if (employee) return employee._id;
  }

  const employee = await Employee.findOne({
    empID: identifier.toUpperCase(),
  }).select('_id');
  return employee ? employee._id : null;
};

// =====================================================================
// 1. CREATE TASK (Admin / SuperAdmin only)
// =====================================================================
exports.createTask = async (req, res) => {
  try {
    const {
      employeeId,          // can be empID string or ObjectId
      customerName,
      customerPhone,
      customerVehicleNumber,
      customerAddress,
      recoveryLocation,    // optional: { lat, lng, address }
    } = req.body;

    // Validate required fields
    if (!employeeId || !customerName || !customerPhone || !customerVehicleNumber || !customerAddress) {
      return res.status(400).json({
        message: 'employeeId, customerName, customerPhone, customerVehicleNumber, and customerAddress are required',
      });
    }

    // Resolve employee
    const employeeObjectId = await resolveEmployeeId(employeeId);
    if (!employeeObjectId) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check that assignedBy (current user) is admin/superadmin – already enforced by route middleware

    const task = new Task({
      employee: employeeObjectId,
      assignedBy: req.employee._id,
      customerName,
      customerPhone,
      customerVehicleNumber,
      customerAddress,
      recoveryLocation: recoveryLocation || undefined,
    });

    await task.save();

    // Populate employee and assignedBy fields for response
    const populatedTask = await Task.findById(task._id)
      .populate('employee', 'empID name email phone designation profileImage')
      .populate('assignedBy', 'empID name');

    res.status(201).json({
      message: 'Task assigned successfully',
      task: populatedTask,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =====================================================================
// 2. GET TASKS (with filtering and pagination)
// =====================================================================
exports.getTasks = async (req, res) => {
  try {
    const { employeeId, status, page = 1, limit = 50 } = req.query;
    const filter = {};

    const isAdmin = ['admin', 'superadmin'].includes(req.employee.role);

    if (isAdmin) {
      // Admin can filter by employee or see all
      if (employeeId) {
        const empObjectId = await resolveEmployeeId(employeeId);
        if (!empObjectId) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        filter.employee = empObjectId;
      }
    } else {
      // Employee sees only their own tasks
      filter.employee = req.employee._id;
    }

    if (status) {
      if (['pending', 'completed', 'not_recovered', 'not_available'].includes(status)) {
        filter.status = status;
      } else {
        return res.status(400).json({ message: 'Invalid status value' });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { assignedAt: -1 };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('employee', 'empID name email phone designation profileImage')
        .populate('assignedBy', 'empID name')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Task.countDocuments(filter),
    ]);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =====================================================================
// 3. GET SINGLE TASK BY ID
// =====================================================================
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id)
      .populate('employee', 'empID name email phone designation profileImage')
      .populate('assignedBy', 'empID name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization: employee can see only their own tasks; admin can see any
    const isAdmin = ['admin', 'superadmin'].includes(req.employee.role);
    if (!isAdmin && task.employee._id.toString() !== req.employee._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =====================================================================
// 4. UPDATE TASK STATUS (Employee or Admin)
// =====================================================================
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, recoveryLocation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization
    const isAdmin = ['admin', 'superadmin'].includes(req.employee.role);
    const isAssignedEmployee = task.employee.toString() === req.employee._id.toString();

    if (!isAdmin && !isAssignedEmployee) {
      return res.status(403).json({ message: 'Access denied. You can only update your own tasks.' });
    }

    // If status is provided, validate it
    if (status) {
      const validStatuses = ['pending', 'completed', 'not_recovered', 'not_available'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      task.status = status;

      // If status is set to completed, set completedAt
      if (status === 'completed') {
        task.completedAt = new Date();
      } else {
        task.completedAt = null; // reset if not completed
      }
    }

    if (notes !== undefined) {
      task.notes = notes;
    }

    if (recoveryLocation) {
      task.recoveryLocation = {
        lat: recoveryLocation.lat,
        lng: recoveryLocation.lng,
        address: recoveryLocation.address || '',
      };
    }

    await task.save();

    // Fetch populated task for response
    const updatedTask = await Task.findById(task._id)
      .populate('employee', 'empID name email phone designation profileImage')
      .populate('assignedBy', 'empID name');

    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =====================================================================
// 5. UPDATE FULL TASK (Admin only)
// =====================================================================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeId,
      customerName,
      customerPhone,
      customerVehicleNumber,
      customerAddress,
      status,
      notes,
      recoveryLocation,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admin only – already enforced by route middleware, but double-check
    if (!['admin', 'superadmin'].includes(req.employee.role)) {
      return res.status(403).json({ message: 'Only admins can fully update tasks' });
    }

    // Update fields if provided
    if (employeeId) {
      const empObjectId = await resolveEmployeeId(employeeId);
      if (!empObjectId) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      task.employee = empObjectId;
    }

    if (customerName) task.customerName = customerName;
    if (customerPhone) task.customerPhone = customerPhone;
    if (customerVehicleNumber) task.customerVehicleNumber = customerVehicleNumber;
    if (customerAddress) task.customerAddress = customerAddress;

    if (status) {
      const validStatuses = ['pending', 'completed', 'not_recovered', 'not_available'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }

    if (notes !== undefined) task.notes = notes;

    if (recoveryLocation) {
      task.recoveryLocation = {
        lat: recoveryLocation.lat,
        lng: recoveryLocation.lng,
        address: recoveryLocation.address || '',
      };
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('employee', 'empID name email phone designation profileImage')
      .populate('assignedBy', 'empID name');

    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =====================================================================
// 6. DELETE TASK (Admin only)
// =====================================================================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admin only
    if (!['admin', 'superadmin'].includes(req.employee.role)) {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }

    await task.deleteOne();

    res.json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};