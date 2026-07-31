const Employee = require('../models/Employee');

// ============================
// Get Logged-In User Profile
// ============================
exports.getMyProfile = async (req, res) => {
  try {
    // Fallback search criteria matching common JWT payload conventions
    const identifier = req.user._id || req.user.id || req.user.empID;
    
    let employee = null;
    if (identifier.toString().startsWith('EMP') || !identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // If it looks like an empID string instead of a MongoDB ObjectId
      employee = await Employee.findOne({ empID: identifier }).select('-password');
    } else {
      employee = await Employee.findById(identifier).select('-password');
    }

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
    console.error("Error in getMyProfile:", error.message);
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
    const identifier = req.user._id || req.user.id || req.user.empID;
    
    let employee = null;
    if (identifier.toString().startsWith('EMP') || !identifier.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findOne({ empID: identifier });
    } else {
      employee = await Employee.findById(identifier);
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found',
      });
    }

    employee.name = req.body.name ?? employee.name;
    employee.phone = req.body.phone ?? employee.phone;
    employee.email = req.body.email ?? employee.email;

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

    const updatedEmployee = await Employee.findById(employee._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error in updateMyProfile:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};