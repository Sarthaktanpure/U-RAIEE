const PassportEvent = require('../models/PassportEvent');
const Submission = require('../models/Submission');
const Outcome = require('../models/Outcome');

// Get full verified academic passport history for the current user
exports.getPassport = async (req, res) => {
  try {
    const events = await PassportEvent.find({ user: req.user._id })
      .populate('submission', 'title type domain status nextOpportunity')
      .sort({ createdAt: 1 });

    const submissions = await Submission.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    const verifiedOutcomes = await Outcome.find({
      reportedBy: req.user._id,
      status: 'verified'
    })
      .populate('submission', 'title')
      .sort({ verifiedAt: -1 });

    res.json({
      participant: {
        name: req.user.name,
        email: req.user.email,
        institution: req.user.institution,
        department: req.user.department
      },
      events,
      submissions,
      verifiedOutcomes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
