const mongoose = require('mongoose');

const meritEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    default: null
  },
  role: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MeritEntry', meritEntrySchema);
