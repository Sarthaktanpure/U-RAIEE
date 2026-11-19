const MeritEntry = require('../models/MeritEntry');

// Get total progression merit and contribution recognition entries
exports.getMyMerit = async (req, res) => {
  try {
    const entries = await MeritEntry.find({ user: req.user._id })
      .populate('submission', 'title')
      .sort({ createdAt: -1 });

    let progressionTotal = 0;
    let contributionTotal = 0;

    entries.forEach(entry => {
      if (entry.role === 'participant') {
        progressionTotal += entry.points;
      } else {
        contributionTotal += entry.points;
      }
    });

    res.json({
      progressionTotal,
      contributionTotal,
      entries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
