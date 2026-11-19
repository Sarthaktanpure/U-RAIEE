const PassportEvent = require('../models/PassportEvent');

// Automatically logs academic journey events into the participant's Academic Passport
async function logEvent({ user, submission = null, step, title, detail }) {
  try {
    const event = new PassportEvent({
      user,
      submission,
      step,
      title,
      detail
    });
    await event.save();
    return event;
  } catch (error) {
    console.error('Failed to log passport event:', error.message);
  }
}

module.exports = logEvent;
