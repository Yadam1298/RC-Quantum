const Employee = require('../models/Employee');

// ============================
// Get Logged-In User Profile
// ============================
exports.getMyProfile = async (req, res) => {
  try {
    // Check all possible ID structures attached by JWT protect middleware
    const userId = req.user?._id || req.user?.id || req.user?.empID;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user ID missing from token',
      });
    }

    let employee = null;
    
    // Check if it's a standard MongoDB ObjectId or custom string ID (like EMP0001)
    if (userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(userId).select('-password');
    } else {
      employee = await Employee.findOne({ empID: userId }).select('-password');
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found in database',
      });
    }

    res.json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error('❌ Server Error in getMyProfile:', error);
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
    const userId = req.user?._id || req.user?.id || req.user?.empID;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user ID missing from token',
      });
    }

    let employee = null;
    if (userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(userId);
    } else {
      employee = await Employee.findOne({ empID: userId });
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
    console.error('❌ Server Error in updateMyProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};