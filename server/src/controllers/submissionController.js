const Submission = require('../models/Submission');
const Review = require('../models/Review');
const Outcome = require('../models/Outcome');
const { generateRecommendation } = require('../utils/recommend');
const logEvent = require('../utils/logEvent');
const awardMerit = require('../utils/awardMerit');

// Create new participant submission
exports.createSubmission = async (req, res) => {
  try {
    const { title, type, domain, keywords, description, documentUrl, documentName } = req.body;

    if (!title || !type || !domain || !description) {
      return res.status(400).json({ message: 'Title, type, domain, and description are required.' });
    }

    const validTypes = ['idea', 'project', 'research', 'prototype'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid submission type: ${type}` });
    }

    // Process keywords
    let kwArray = [];
    if (Array.isArray(keywords)) {
      kwArray = keywords;
    } else if (typeof keywords === 'string') {
      kwArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
    }

    // Generate rule-based recommendation
    const rec = generateRecommendation({
      type,
      domain,
      keywords: kwArray,
      stage: 'Concept Validation'
    });

    const submission = new Submission({
      owner: req.user._id,
      title: title.trim(),
      type,
      domain: domain.trim(),
      keywords: kwArray,
      description: description.trim(),
      stage: type === 'research' ? 'Research Validation' : (type === 'project' ? 'Technical Validation' : 'Concept Validation'),
      status: 'submitted',
      recommendedPathway: rec.pathway,
      headlineRecommendation: rec.headlineRecommendation,
      recommendationSource: rec.recommendationSource,
      documentUrl: documentUrl || null,
      documentName: documentName || null
    });

    await submission.save();

    // Log passport event
    await logEvent({
      user: req.user._id,
      submission: submission._id,
      step: 'submitted',
      title: 'Work Submitted',
      detail: `Submitted "${submission.title}" (${submission.type}) for institutional review.`
    });

    // Award +10 Progression Merit
    await awardMerit({
      user: req.user._id,
      submission: submission._id,
      role: 'participant',
      points: 10,
      reason: 'Submission created'
    });

    res.status(201).json({
      message: 'Work submitted successfully. Recommendation pathway generated.',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user's submissions
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ owner: req.user._id })
      .populate('expert', 'name email institution')
      .populate('reviewer', 'name email institution')
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single submission by ID with permission checks
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('owner', 'name email institution department')
      .populate('expert', 'name email institution')
      .populate('reviewer', 'name email institution');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    const userId = req.user._id.toString();
    const isOwner = submission.owner._id.toString() === userId;
    const isAssignedExpert = submission.expert && submission.expert._id.toString() === userId;
    const isAssignedReviewer = submission.reviewer && submission.reviewer._id.toString() === userId;
    const isAdmin = req.user.approvedRoles.includes('admin') || req.user.activeRole === 'admin';

    if (!isOwner && !isAssignedExpert && !isAssignedReviewer && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to view this submission.' });
    }

    // Retrieve related reviews and outcomes
    const reviews = await Review.find({ submission: submission._id })
      .populate('reviewer', 'name activeRole')
      .sort({ createdAt: 1 });

    const outcome = await Outcome.findOne({ submission: submission._id })
      .populate('reportedBy', 'name')
      .populate('verifiedBy', 'name');

    res.json({
      submission,
      reviews,
      outcome
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refine submission by owner
exports.refineSubmission = async (req, res) => {
  try {
    const { description, refinementNote, documentUrl, documentName } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    if (submission.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the author can refine this submission.' });
    }

    if (submission.status !== 'evaluated' && submission.status !== 'refinement') {
      return res.status(400).json({
        message: `Refinement is only allowed when status is 'evaluated' or 'refinement'. Current status: ${submission.status}`
      });
    }

    if (!refinementNote || refinementNote.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide a refinement note explaining the changes.' });
    }

    if (description) {
      submission.description = description.trim();
    }
    if (documentUrl) {
      submission.documentUrl = documentUrl;
      submission.documentName = documentName || 'Updated_Submission_Document';
    }
    submission.refinementNote = refinementNote.trim();
    submission.status = 'refined';

    await submission.save();

    // Log passport event
    await logEvent({
      user: req.user._id,
      submission: submission._id,
      step: 'refined',
      title: 'Refined Work Resubmitted',
      detail: refinementNote.trim()
    });

    // Award +10 Progression Merit
    await awardMerit({
      user: req.user._id,
      submission: submission._id,
      role: 'participant',
      points: 10,
      reason: 'Refined work resubmitted'
    });

    res.json({
      message: 'Refined work resubmitted successfully.',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommendations overview
exports.getRecommendations = async (req, res) => {
  try {
    const submissions = await Submission.find({ owner: req.user._id })
      .select('title type domain stage status recommendedPathway headlineRecommendation recommendationSource createdAt')
      .sort({ createdAt: -1 });

    res.json({ recommendations: submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
