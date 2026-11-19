const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'uraiee_secret', {
    expiresIn: '7d'
  });
};

// Register new participant
exports.register = async (req, res) => {
  try {
    const { name, email, password, institution, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      institution: institution || 'Default College of Engineering',
      department: department || 'General Engineering',
      approvedRoles: ['participant'],
      activeRole: 'participant'
    });

    await user.save();

    const token = generateToken(user._id);

    const safeUser = user.toObject();
    delete safeUser.passwordHash;

    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    const safeUser = user.toObject();
    delete safeUser.passwordHash;

    res.json({
      message: 'Signed in successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current logged-in profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
