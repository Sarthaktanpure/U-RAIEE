// Ensures the user's current activeRole has permission to access the route
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.activeRole)) {
      return res.status(403).json({
        message: `Action restricted. Required active role: ${allowedRoles.join(' or ')}. Your current role is: ${req.user.activeRole}.`
      });
    }

    next();
  };
};

module.exports = requireRole;
