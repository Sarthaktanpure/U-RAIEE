const Submission = require('../models/Submission');
const Review = require('../models/Review');
const logEvent = require('../utils/logEvent');
const awardMerit = require('../utils/awardMerit');

// Get assigned submissions queue for the current expert
exports.getQueue = async (req, res) => {
  try {
    const queue = await Submission.find({
      expert: req.user._id
    })
      .populate('owner', 'name email institution department')
      .sort({ createdAt: -1 });

    res.json({ queue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit structured expert evaluation
exports.evaluateSubmission = async (req, res) => {
  try {
    const { scores, comments } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Anti-cheat verification
    if (submission.owner.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'Conflict of interest: You cannot evaluate your own submission.' });
    }

    if (!submission.expert || submission.expert.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You are not the assigned Expert for this submission.' });
    }

    if (!scores || !comments) {
      return res.status(400).json({ message: 'Structured scores and comments are required.' });
    }

    const { originality, feasibility, impact, clarity } = scores;
    const validScore = (s) => Number.isInteger(Number(s)) && s >= 1 && s <= 5;

    if (!validScore(originality) || !validScore(feasibility) || !validScore(impact) || !validScore(clarity)) {
      return res.status(400).json({ message: 'All 4 scores (originality, feasibility, impact, clarity) must be integers from 1 to 5.' });
    }

    const review = new Review({
      submission: submission._id,
      reviewer: req.user._id,
      kind: 'expert',
      scores: {
        originality: Number(originality),
        feasibility: Number(feasibility),
        impact: Number(impact),
        clarity: Number(clarity)
      },
      comments: comments.trim()
    });

    await review.save();

    submission.status = 'evaluated';
    await submission.save();

    // Log passport event for the submission author
    await logEvent({
      user: submission.owner,
      submission: submission._id,
      step: 'evaluated',
      title: 'Expert Evaluation Completed',
      detail: `Expert evaluated work. Scores: Originality ${originality}/5, Feasibility ${feasibility}/5, Impact ${impact}/5, Clarity ${clarity}/5.`
    });

    // Award +15 Contribution Recognition points to Expert
    await awardMerit({
      user: req.user._id,
      submission: submission._id,
      role: 'expert',
      points: 15,
      reason: 'Expert evaluation completed'
    });

    res.status(201).json({
      message: 'Evaluation saved successfully and merit awarded.',
      review,
      submission
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
