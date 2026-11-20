const User = require('../models/User');
const Submission = require('../models/Submission');
const MeritEntry = require('../models/MeritEntry');
const PassportEvent = require('../models/PassportEvent');
const Opportunity = require('../models/Opportunity');
const Outcome = require('../models/Outcome');

// Public ecosystem metrics for landing page
exports.getPublicMetrics = async (req, res) => {
  try {
    const participantsCount = await User.countDocuments({ approvedRoles: 'participant' });
    const submissionsCount = await Submission.countDocuments();
    const opportunitiesCount = await Opportunity.countDocuments();
    const verifiedOutcomesCount = await Outcome.countDocuments({ status: 'verified' });

    res.json({
      participantsCount,
      submissionsCount,
      opportunitiesCount,
      verifiedOutcomesCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard statistics and recent activity
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissionsCount = await Submission.countDocuments({ owner: userId });
    const pendingFeedbackCount = await Submission.countDocuments({
      owner: userId,
      status: { $in: ['submitted', 'under_evaluation', 'under_review', 'refinement'] }
    });

    const meritEntries = await MeritEntry.find({ user: userId });
    const meritPoints = meritEntries.reduce((sum, item) => sum + item.points, 0);

    const passportEntriesCount = await PassportEvent.countDocuments({ user: userId });

    const recentSubmissions = await Submission.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      submissionsCount,
      pendingFeedbackCount,
      meritPoints,
      passportEntriesCount,
      recentSubmissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
