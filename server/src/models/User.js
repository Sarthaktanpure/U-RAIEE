const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    default: '',
    trim: true
  },
  department: {
    type: String,
    default: '',
    trim: true
  },
  approvedRoles: {
    type: [String],
    enum: ['participant', 'mentor', 'reviewer', 'expert', 'jury', 'editor', 'coordinator', 'admin'],
    default: ['participant']
  },
  activeRole: {
    type: String,
    enum: ['participant', 'mentor', 'reviewer', 'expert', 'jury', 'editor', 'coordinator', 'admin'],
    default: 'participant'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
