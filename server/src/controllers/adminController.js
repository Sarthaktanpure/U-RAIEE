const User = require('../models/User');
const RoleRequest = require('../models/RoleRequest');
const Submission = require('../models/Submission');
const Outcome = require('../models/Outcome');
const Opportunity = require('../models/Opportunity');
const logEvent = require('../utils/logEvent');
const awardMerit = require('../utils/awardMerit');

// Get all role requests
exports.getRoleRequests = async (req, res) => {
  try {
    const requests = await RoleRequest.find()
      .populate('user', 'name email institution department')
      .populate('decidedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decide on a role request (approve / reject)
exports.decideRoleRequest = async (req, res) => {
  try {
    const { action } = req.body;
    const request = await RoleRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Role request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `This request has already been ${request.status}.` });
    }

    if (action === 'approve') {
      request.status = 'approved';
      request.decidedBy = req.user._id;
      request.decidedAt = new Date();
      await request.save();

      // Add to user approvedRoles
      await User.findByIdAndUpdate(request.user, {
        $addToSet: { approvedRoles: request.role }
      });

      return res.json({
        message: `Role request approved. ${request.role} added to user.`,
        request
      });
    } else if (action === 'reject') {
      request.status = 'rejected';
      request.decidedBy = req.user._id;
      request.decidedAt = new Date();
      await request.save();

      return res.json({
        message: 'Role request rejected.',
        request
      });
    } else {
      return res.status(400).json({ message: 'Invalid action. Must be approve or reject.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available candidates for Expert and Reviewer assignments, plus all users
exports.getUsersByRole = async (req, res) => {
  try {
    const experts = await User.find({ approvedRoles: 'expert' }).select('name email institution department approvedRoles');
    const reviewers = await User.find({ approvedRoles: 'reviewer' }).select('name email institution department approvedRoles');
    const allUsers = await User.find().select('name email institution department approvedRoles activeRole createdAt').sort({ createdAt: -1 });

    res.json({ experts, reviewers, allUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign expert or reviewer to a submission with strict anti-cheat rules
exports.assignSubmission = async (req, res) => {
  try {
    const { expertId, reviewerId } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Assigning Expert
    if (expertId) {
      if (submission.owner.toString() === expertId.toString()) {
        return res.status(400).json({ message: 'Conflict of interest: The author cannot be assigned as Expert for their own work.' });
      }

      const expertUser = await User.findById(expertId);
      if (!expertUser || !expertUser.approvedRoles.includes('expert')) {
        return res.status(400).json({ message: 'Selected user does not have an approved Expert role.' });
      }

      submission.expert = expertId;
      submission.status = 'under_evaluation';
      await submission.save();

      await logEvent({
        user: submission.owner,
        submission: submission._id,
        step: 'under_evaluation',
        title: 'Assigned to Expert',
        detail: `Submission assigned to Expert ${expertUser.name} for technical evaluation.`
      });

      return res.json({
        message: `Expert ${expertUser.name} assigned successfully. Status updated to under_evaluation.`,
        submission
      });
    }

    // Assigning Reviewer
    if (reviewerId) {
      if (submission.owner.toString() === reviewerId.toString()) {
        return res.status(400).json({ message: 'Conflict of interest: The author cannot be assigned as Reviewer for their own work.' });
      }

      if (submission.expert && submission.expert.toString() === reviewerId.toString()) {
        return res.status(400).json({ message: 'Conflict of interest: The assigned Reviewer must be a different person than the assigned Expert.' });
      }

      const reviewerUser = await User.findById(reviewerId);
      if (!reviewerUser || !reviewerUser.approvedRoles.includes('reviewer')) {
        return res.status(400).json({ message: 'Selected user does not have an approved Reviewer role.' });
      }

      submission.reviewer = reviewerId;
      submission.status = 'under_review';
      await submission.save();

      await logEvent({
        user: submission.owner,
        submission: submission._id,
        step: 'under_review',
        title: 'Assigned to Progression Reviewer',
        detail: `Submission assigned to Reviewer ${reviewerUser.name} for progression review.`
      });

      return res.json({
        message: `Reviewer ${reviewerUser.name} assigned successfully. Status updated to under_review.`,
        submission
      });
    }

    res.status(400).json({ message: 'Either expertId or reviewerId must be provided.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reported outcomes for admin review
exports.getAdminOutcomes = async (req, res) => {
  try {
    const outcomes = await Outcome.find()
      .populate('submission', 'title type domain status owner')
      .populate('reportedBy', 'name email institution')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ outcomes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify or reject an outcome with Next Opportunity generation
exports.decideOutcome = async (req, res) => {
  try {
    const { action, remark } = req.body;
    const outcome = await Outcome.findById(req.params.id).populate('submission');

    if (!outcome) {
      return res.status(404).json({ message: 'Outcome record not found.' });
    }

    if (outcome.status !== 'pending') {
      return res.status(400).json({ message: `This outcome has already been ${outcome.status}.` });
    }

    const submission = await Submission.findById(outcome.submission._id);

    if (action === 'verify') {
      outcome.status = 'verified';
      outcome.verifiedBy = req.user._id;
      outcome.verifiedAt = new Date();
      outcome.remark = remark || 'Verified by institutional administrator.';
      await outcome.save();

      submission.status = 'outcome_verified';

      // Find next opportunity from Opportunity catalog
      const currentStage = submission.stage || 'Research Validation';
      const opp = await Opportunity.findOne({
        $or: [
          { stage: currentStage },
          { title: { $regex: new RegExp(currentStage, 'i') } }
        ]
      });

      let nextOppString = 'Prototype Development, followed by IP Support';
      if (opp && opp.nextAfter) {
        const nextOpp = await Opportunity.findOne({ title: opp.nextAfter });
        if (nextOpp && nextOpp.nextAfter) {
          nextOppString = `${opp.nextAfter}, followed by ${nextOpp.nextAfter}`;
        } else {
          nextOppString = opp.nextAfter;
        }
      }

      submission.nextOpportunity = nextOppString;
      await submission.save();

      // Log passport event
      await logEvent({
        user: submission.owner,
        submission: submission._id,
        step: 'outcome_verified',
        title: 'Outcome Verified by Admin',
        detail: `Verified achievement: "${outcome.title}". Next Opportunity Unlocked: ${nextOppString}.`
      });

      // Award +50 Progression Merit to author
      await awardMerit({
        user: submission.owner,
        submission: submission._id,
        role: 'participant',
        points: 50,
        reason: 'Outcome verified by administrator'
      });

      return res.json({
        message: 'Outcome verified successfully and next opportunity unlocked.',
        outcome,
        submission
      });
    } else if (action === 'reject') {
      outcome.status = 'rejected';
      outcome.verifiedBy = req.user._id;
      outcome.verifiedAt = new Date();
      outcome.remark = remark || 'Evidence insufficient. Please review requirements and resubmit.';
      await outcome.save();

      return res.json({
        message: 'Outcome rejected. The author may report with updated evidence.',
        outcome
      });
    } else {
      return res.status(400).json({ message: 'Invalid action. Must be verify or reject.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin directly assigns or revokes any role to any user (including promoting to Admin)
exports.assignUserRole = async (req, res) => {
  try {
    const { role, action = 'grant' } = req.body;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const validRoles = ['participant', 'mentor', 'reviewer', 'expert', 'jury', 'editor', 'coordinator', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role: ${role}` });
    }

    if (action === 'grant') {
      if (!targetUser.approvedRoles.includes(role)) {
        targetUser.approvedRoles.push(role);
      }
      await targetUser.save();

      const safeUser = targetUser.toObject();
      delete safeUser.passwordHash;

      return res.json({
        message: `Role '${role}' successfully assigned to ${targetUser.name}.`,
        user: safeUser
      });
    } else if (action === 'revoke') {
      if (role === 'participant') {
        return res.status(400).json({ message: 'Cannot revoke base Participant role.' });
      }

      targetUser.approvedRoles = targetUser.approvedRoles.filter(r => r !== role);
      if (targetUser.activeRole === role) {
        targetUser.activeRole = 'participant';
      }
      await targetUser.save();

      const safeUser = targetUser.toObject();
      delete safeUser.passwordHash;

      return res.json({
        message: `Role '${role}' revoked from ${targetUser.name}.`,
        user: safeUser
      });
    } else {
      return res.status(400).json({ message: 'Action must be grant or revoke.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all submissions across the entire ecosystem for Admin assignment & tracking
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('owner', 'name email institution department')
      .populate('expert', 'name email')
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
