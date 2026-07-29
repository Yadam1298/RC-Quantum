const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const employee = await Employee.findById(decoded.id).select('-password');

      if (!employee) {
        return res.status(401).json({ message: 'Not authorized, user not found.' });
      }

      // Check if the current token matches the active session token stored in DB
      if (employee.activeSessionToken !== token) {
        return res.status(401).json({
          code: 'LOGGED_IN_ELSEWHERE',
          message: 'Your account was logged in from another device.',
        });
      }

      req.employee = employee;
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Not authorized, token invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing.' });
  }
};

module.exports = { protect };