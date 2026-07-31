const Employee = require('../models/Employee');

// ============================
// Get Logged-In User Profile
// ============================
exports.getMyProfile = async (req, res) => {
  try {
    // req.user comes from your 'protect' authentication middleware
    const employee = await Employee.findById(req.user._id).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found',
      });
    }

    res.json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Update Logged-In User Profile
// ============================
exports.updateMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found',
      });
    }

    // Allow employees to update personal fields (prevent updating role, status, or empID directly)
    employee.name = req.body.name ?? employee.name;
    employee.phone = req.body.phone ?? employee.phone;
    employee.email = req.body.email ?? employee.email;

    // Optional profile image update validation
    if (req.body.profileImage) {
      const base64Regex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
      if (base64Regex.test(req.body.profileImage)) {
        employee.profileImage = req.body.profileImage;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid image format. Please provide a valid base64 image string',
        });
      }
    }

    await employee.save();

    // Return updated profile without password
    const updatedEmployee = await Employee.findById(employee._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};