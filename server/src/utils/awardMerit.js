const MeritEntry = require('../models/MeritEntry');

// Awards progression merit points or contribution recognition points
async function awardMerit({ user, submission = null, role, points, reason }) {
  try {
    const entry = new MeritEntry({
      user,
      submission,
      role,
      points,
      reason
    });
    await entry.save();
    return entry;
  } catch (error) {
    console.error('Failed to award merit:', error.message);
  }
}

module.exports = awardMerit;
