const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kind: {
    type: String,
    enum: ['expert', 'progression'],
    required: true
  },
  scores: {
    originality: { type: Number, min: 1, max: 5 },
    feasibility: { type: Number, min: 1, max: 5 },
    impact: { type: Number, min: 1, max: 5 },
    clarity: { type: Number, min: 1, max: 5 }
  },
  comments: {
    type: String,
    required: true,
    trim: true
  },
  decision: {
    type: String,
    enum: ['approved', 'needs_work']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
