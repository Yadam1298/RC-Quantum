const Employee = require('../models/Employee');

// ============================
// [ADMIN] Get All Employees
// ============================
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// [ADMIN] Get Employee By ID
// ============================
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      empID: req.params.empID,
    }).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
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
// [ADMIN] Update Employee
// ============================
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      empID: req.params.empID,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    employee.cardUID = req.body.cardUID ?? employee.cardUID;
    employee.name = req.body.name ?? employee.name;
    employee.phone = req.body.phone ?? employee.phone;
    employee.email = req.body.email ?? employee.email;
    employee.designation = req.body.designation ?? employee.designation;
    employee.role = req.body.role ?? employee.role;

    if (req.body.profileImage) {
      const base64Regex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
      if (base64Regex.test(req.body.profileImage)) {
        employee.profileImage = req.body.profileImage;
      } else {
        return res.status(400).json({
          success: false,
          message:
            'Invalid image format. Please provide a valid base64 image string',
        });
      }
    }

    await employee.save();

    res.json({
      success: true,
      message: 'Employee updated successfully',
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
// [ADMIN] Delete Employee
// ============================
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      empID: req.params.empID,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await employee.deleteOne();

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// [ADMIN] Toggle Active / Inactive
// ============================
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      empID: req.params.empID,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    employee.status = employee.status === 'active' ? 'inactive' : 'active';

    await employee.save();

    res.json({
      success: true,
      message: `Employee ${employee.status}`,
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
// [ADMIN] Update Profile Image with Validation
// ============================
exports.updateProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: 'Profile image is required',
      });
    }

    const base64Regex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
    if (!base64Regex.test(profileImage)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid image format. Supported formats: jpeg, png, gif, bmp, webp',
      });
    }

    const base64Data = profileImage.split(',')[1];
    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 image data',
      });
    }

    const imageSizeInBytes = Buffer.from(base64Data, 'base64').length;
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (imageSizeInBytes > maxSizeInBytes) {
      return res.status(400).json({
        success: false,
        message: `Image size exceeds 5MB limit`,
      });
    }

    const employee = await Employee.findOne({
      empID: req.params.empID,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    employee.profileImage = profileImage;
    await employee.save();

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      employee: {
        empID: employee.empID,
        name: employee.name,
        profileImage: employee.profileImage.substring(0, 100) + '...',
        imageSize: `${(imageSizeInBytes / 1024 / 1024).toFixed(2)}MB`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// [EMPLOYEE SELF-SERVICE] Get Own Profile Details
// ==========================================================
exports.getMyProfile = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware using JWT token
    const employee = await Employee.findOne({
      empID: req.user.empID,
    }).select('-password');

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

// ==========================================================
// [EMPLOYEE SELF-SERVICE] Update Own Profile Details
// ==========================================================
exports.updateMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      empID: req.user.empID,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found',
      });
    }

    // Employees can typically update non-sensitive fields like name, phone, email, profile image.
    // Restrict editing role, designation, cardUID, or status to admins.
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
          message: 'Invalid base64 image format',
        });
      }
    }

    await employee.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};