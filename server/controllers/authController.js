const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

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
      role: role || 'employee',
    });

    const token = generateToken(employee._id);
    employee.activeSessionToken = token;
    await employee.save();

    return res.status(201).json({
      message: 'User registered successfully',
      token,
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

    // Generate new token & overwrite active session token (terminates other device's sessions)
    const token = generateToken(employee._id);
    employee.activeSessionToken = token;
    await employee.save();

    return res.json({
      message: 'Login successful',
      token,
      employee: {
        id: employee._id,
        empID: employee.empID,
        name: employee.name,
        role: employee.role,
        designation: employee.designation,
        email: employee.email,
        profileImage: employee.profileImage,
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

exports.VerifyToken = async (req, res) => {
  try {
    // Expects an authentication middleware that extracts the token and attaches user ID to req.user or req.employeeId
    // If you are using standard middleware, req.employee or req.user contains the decoded token payload.
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    // Verify JWT validity & expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find employee by ID from the token
    const employee = await Employee.findById(decoded.id);

    if (!employee) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    // Single-device check: Compare incoming token with the activeSessionToken in DB
    if (employee.activeSessionToken !== token) {
      return res.status(401).json({ 
        message: 'You are logged in somewhere else. This session has been terminated.' 
      });
    }

    // Token is fully valid and active
    return res.status(200).json({
      valid: true,
      message: 'Token is valid',
      employee: {
        id: employee._id,
        empID: employee.empID,
        name: employee.name,
        role: employee.role,
        designation: employee.designation,
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};