const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  stage: {
    type: String,
    required: true,
    trim: true
  },
  domainTags: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  nextAfter: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
