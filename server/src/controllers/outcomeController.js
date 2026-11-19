const Outcome = require('../models/Outcome');
const Submission = require('../models/Submission');
const logEvent = require('../utils/logEvent');

// Report an outcome with evidence by the submission owner
exports.reportOutcome = async (req, res) => {
  try {
    const { title, description, evidenceLink, evidenceDocument, evidenceDocumentName } = req.body;
    const submission = await Submission.findById(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    if (submission.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the author can report an outcome for this work.' });
    }

    if (submission.status !== 'progression_validated') {
      return res.status(400).json({
        message: `Outcome can only be reported after progression is validated. Current status: ${submission.status}`
      });
    }

    if (!title || !description || (!evidenceLink && !evidenceDocument)) {
      return res.status(400).json({ message: 'Title, description, and proof of outcome (either an evidence link or uploaded document) are required.' });
    }

    const existingPending = await Outcome.findOne({
      submission: submission._id,
      status: 'pending'
    });

    if (existingPending) {
      return res.status(400).json({ message: 'An outcome verification is already pending for this submission.' });
    }

    const outcome = new Outcome({
      submission: submission._id,
      reportedBy: req.user._id,
      title: title.trim(),
      description: description.trim(),
      evidenceLink: (evidenceLink || '').trim(),
      evidenceDocument: evidenceDocument || null,
      evidenceDocumentName: evidenceDocumentName || null,
      status: 'pending'
    });

    await outcome.save();

    submission.status = 'outcome_reported';
    await submission.save();

    // Log passport event
    await logEvent({
      user: req.user._id,
      submission: submission._id,
      step: 'outcome_reported',
      title: 'Outcome Reported with Evidence',
      detail: `Reported achievement: "${title.trim()}". Evidence link submitted for administrative verification.`
    });

    res.status(201).json({
      message: 'Outcome reported successfully and forwarded to Administrator for verification.',
      outcome
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
