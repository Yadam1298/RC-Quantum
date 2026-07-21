// controllers/authController.js
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User - Can be used by Super Admin (we'll protect route later)
exports.registerEmployee = async (req, res) => {
  const { empID, cardUID, name, phone, email, password, designation, role } =
    req.body;

  try {
    const employeeExists = await Employee.findOne({
      $or: [{ email }, { empID }, { cardUID }],
    });

    if (employeeExists) {
      return res.status(400).json({
        message:
          'Registration failed. empID, cardUID, or Email already registered.',
      });
    }

    const employee = await Employee.create({
      empID,
      cardUID,
      name,
      phone,
      email,
      password,
      designation,
      role: role || 'employee', // Accept role from superadmin
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(employee._id),
      employee: {
        id: employee._id,
        empID: employee.empID,
        name: employee.name,
        role: employee.role,
        designation: employee.designation,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Login (Unchanged - works for all roles)
exports.loginEmployee = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Please provide identifier (email or empID) and password',
      });
    }

    const employee = await Employee.findOne({
      $or: [{ email: identifier.toLowerCase() }, { empID: identifier }],
    });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    return res.json({
      message: 'Login successful',
      token: generateToken(employee._id),
      employee: {
        id: employee._id,
        empID: employee.empID,
        name: employee.name,
        role: employee.role,
        designation: employee.designation,
        email: employee.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
