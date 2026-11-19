const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['idea', 'project', 'research', 'prototype'],
    required: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  keywords: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  stage: {
    type: String,
    default: 'Concept Validation'
  },
  status: {
    type: String,
    enum: [
      'submitted',
      'under_evaluation',
      'evaluated',
      'refinement',
      'refined',
      'under_review',
      'progression_validated',
      'outcome_reported',
      'outcome_verified'
    ],
    default: 'submitted'
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  recommendedPathway: {
    type: [String],
    default: []
  },
  headlineRecommendation: {
    type: String,
    default: ''
  },
  recommendationSource: {
    type: String,
    default: 'Rule-based pathway recommendation (AI-assisted personalization is planned as the next layer)'
  },
  refinementNote: {
    type: String,
    default: ''
  },
  documentUrl: {
    type: String,
    default: null
  },
  documentName: {
    type: String,
    default: null
  },
  nextOpportunity: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Submission', submissionSchema);
