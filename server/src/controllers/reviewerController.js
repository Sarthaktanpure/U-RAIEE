const Submission = require('../models/Submission');
const Review = require('../models/Review');
const logEvent = require('../utils/logEvent');
const awardMerit = require('../utils/awardMerit');

// Get assigned progression queue for reviewer
exports.getQueue = async (req, res) => {
  try {
    const queue = await Submission.find({
      reviewer: req.user._id
    })
      .populate('owner', 'name email institution department')
      .populate('expert', 'name email institution')
      .sort({ createdAt: -1 });

    res.json({ queue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record progression decision
exports.decideProgression = async (req, res) => {
  try {
    const { decision, comments } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Anti-cheat verification
    if (submission.owner.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'Conflict of interest: You cannot review your own submission.' });
    }

    if (submission.expert && submission.expert.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'Conflict of interest: Reviewer cannot be the same person as the assigned Expert.' });
    }

    if (!submission.reviewer || submission.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You are not the assigned Reviewer for this submission.' });
    }

    if (!['approved', 'needs_work'].includes(decision)) {
      return res.status(400).json({ message: 'Decision must be either approved or needs_work.' });
    }

    if (!comments || comments.trim().length === 0) {
      return res.status(400).json({ message: 'Review comments are required.' });
    }

    const review = new Review({
      submission: submission._id,
      reviewer: req.user._id,
      kind: 'progression',
      decision,
      comments: comments.trim()
    });

    await review.save();

    if (decision === 'approved') {
      submission.status = 'progression_validated';
      await submission.save();

      // Log passport event
      await logEvent({
        user: submission.owner,
        submission: submission._id,
        step: 'progression_validated',
        title: 'Progression Validated by Reviewer',
        detail: `Reviewer approved progression: "${comments.trim()}"`
      });

      // Participant +30 Progression Merit
      await awardMerit({
        user: submission.owner,
        submission: submission._id,
        role: 'participant',
        points: 30,
        reason: 'Progression validated'
      });

      // Reviewer +15 Contribution Recognition
      await awardMerit({
        user: req.user._id,
        submission: submission._id,
        role: 'reviewer',
        points: 15,
        reason: 'Progression decision completed'
      });
    } else {
      submission.status = 'refinement';
      await submission.save();

      // Log passport event
      await logEvent({
        user: submission.owner,
        submission: submission._id,
        step: 'refinement',
        title: 'Refinement Requested by Reviewer',
        detail: `Reviewer requested further refinement: "${comments.trim()}"`
      });
    }

    res.json({
      message: `Progression decision '${decision}' recorded.`,
      review,
      submission
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
