// middleware/roleMiddleware.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.employee || !allowedRoles.includes(req.employee.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${allowedRoles.join(', ')} can access this route.`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
