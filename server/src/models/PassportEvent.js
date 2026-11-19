const mongoose = require('mongoose');

const passportEventSchema = new mongoose.Schema({
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
  step: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  detail: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PassportEvent', passportEventSchema);
