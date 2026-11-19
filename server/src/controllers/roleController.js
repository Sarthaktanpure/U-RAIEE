const User = require('../models/User');
const RoleRequest = require('../models/RoleRequest');

// Get current user's roles and role requests
exports.getMyRoles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    const requests = await RoleRequest.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      approvedRoles: user.approvedRoles,
      activeRole: user.activeRole,
      requests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request an extra institutional role
exports.requestRole = async (req, res) => {
  try {
    const { role, reason } = req.body;

    const validRoles = ['mentor', 'reviewer', 'expert', 'jury', 'editor', 'coordinator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role request: ${role}` });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide a clear reason for requesting this role.' });
    }

    const user = await User.findById(req.user._id);

    // Check if already approved
    if (user.approvedRoles.includes(role)) {
      return res.status(400).json({ message: `You already have the ${role} role approved.` });
    }

    // Check for existing pending request
    const existingPending = await RoleRequest.findOne({
      user: req.user._id,
      role,
      status: 'pending'
    });

    if (existingPending) {
      return res.status(400).json({ message: `You already have a pending request for the ${role} role.` });
    }

    const roleRequest = new RoleRequest({
      user: req.user._id,
      role,
      reason: reason.trim()
    });

    await roleRequest.save();

    res.status(201).json({
      message: 'Role request submitted for Admin review.',
      roleRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Switch active role
exports.switchRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.approvedRoles.includes(role)) {
      return res.status(403).json({
        message: `Cannot switch to ${role}. You have not been approved for this role.`
      });
    }

    user.activeRole = role;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.passwordHash;

    res.json({
      message: `Active role switched to ${role}.`,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
