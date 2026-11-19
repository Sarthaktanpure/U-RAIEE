const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const RoleRequest = require('../models/RoleRequest');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const MeritEntry = require('../models/MeritEntry');
const Outcome = require('../models/Outcome');
const PassportEvent = require('../models/PassportEvent');
const Opportunity = require('../models/Opportunity');

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // Clear existing collections
    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      RoleRequest.deleteMany({}),
      Submission.deleteMany({}),
      Review.deleteMany({}),
      MeritEntry.deleteMany({}),
      Outcome.deleteMany({}),
      PassportEvent.deleteMany({}),
      Opportunity.deleteMany({})
    ]);

    console.log('Creating standard users...');
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('Demo@1234', salt);

    // 1. Admin
    const admin = await User.create({
      name: 'Dr. Ramesh Kulkarni',
      email: 'admin@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'Indian Institute of Science, Bangalore',
      department: 'Academic Innovation Directorate',
      approvedRoles: ['participant', 'admin'],
      activeRole: 'admin'
    });

    // 2. Participant
    const participant = await User.create({
      name: 'Aarav Sharma',
      email: 'participant@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'College of Engineering, Pune',
      department: 'Department of Electrical Engineering',
      approvedRoles: ['participant'],
      activeRole: 'participant'
    });

    // 3. Expert
    const expert = await User.create({
      name: 'Dr. Sunita Varma',
      email: 'expert@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'National Institute of Technology, Karnataka',
      department: 'Center for Energy & Environmental Studies',
      approvedRoles: ['participant', 'expert'],
      activeRole: 'expert'
    });

    // 4. Reviewer
    const reviewer = await User.create({
      name: 'Prof. Rajesh Menon',
      email: 'reviewer@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'Indian Institute of Technology, Bombay',
      department: 'Department of Energy Science and Engineering',
      approvedRoles: ['participant', 'reviewer'],
      activeRole: 'reviewer'
    });

    // 5. Mentor
    const mentor = await User.create({
      name: 'Dr. Ananya Deshmukh',
      email: 'mentor@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'Birla Institute of Technology and Science, Pilani',
      department: 'Department of Electrical & Electronics',
      approvedRoles: ['participant', 'mentor'],
      activeRole: 'mentor'
    });

    // 6. Jury Member
    const jury = await User.create({
      name: 'Dr. Vikram Singhania',
      email: 'jury@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'Indian Institute of Technology, Delhi',
      department: 'Innovation & Incubation Council',
      approvedRoles: ['participant', 'jury'],
      activeRole: 'jury'
    });

    // 7. Academic Editor
    const editor = await User.create({
      name: 'Prof. Kavita Krishnan',
      email: 'editor@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'International Institute of Information Technology, Hyderabad',
      department: 'Editorial Board & Publications Directorate',
      approvedRoles: ['participant', 'editor'],
      activeRole: 'editor'
    });

    // 8. Institutional Coordinator
    const coordinator = await User.create({
      name: 'Dr. Manoj Prabhakar',
      email: 'coordinator@uraiee.test',
      passwordHash: demoPasswordHash,
      institution: 'Pravara Rural Engineering College, Loni',
      department: 'Department of Information Technology',
      approvedRoles: ['participant', 'coordinator'],
      activeRole: 'coordinator'
    });

    console.log('Creating Opportunity catalog...');
    const opportunities = [
      {
        title: 'Concept Validation',
        stage: 'Concept Validation',
        domainTags: ['ideation', 'feasibility'],
        description: 'Rigorous peer and mentor review to formalize early hypothesis and validate baseline institutional feasibility.',
        nextAfter: 'Expert Guidance'
      },
      {
        title: 'Expert Guidance',
        stage: 'Concept Validation',
        domainTags: ['mentorship', 'refinement'],
        description: 'Direct engagement with senior domain researchers to refine technical architecture and research protocol.',
        nextAfter: 'Prototype Development'
      },
      {
        title: 'Research Validation',
        stage: 'Research Validation',
        domainTags: ['empirical', 'dataset', 'energy'],
        description: 'Experimental testing and empirical baseline verification using institutional laboratory infrastructure.',
        nextAfter: 'Prototype Development'
      },
      {
        title: 'Technical Validation',
        stage: 'Technical Validation',
        domainTags: ['engineering', 'systems'],
        description: 'System-level integration testing and formal performance benchmarks in controlled settings.',
        nextAfter: 'Prototype Development'
      },
      {
        title: 'Prototype Development',
        stage: 'Prototype',
        domainTags: ['hardware', 'software', 'poc'],
        description: 'Creation and calibration of a working laboratory or field-deployable proof-of-concept prototype.',
        nextAfter: 'IP Support'
      },
      {
        title: 'IP Support',
        stage: 'IP Filing',
        domainTags: ['patents', 'copyright', 'intellectual property'],
        description: 'Institutional patent search, prior art analysis, and provisional specification drafting support.',
        nextAfter: 'Startup / MSME Pathway'
      },
      {
        title: 'Conference or Journal Submission',
        stage: 'Dissemination',
        domainTags: ['peer-review', 'publication'],
        description: 'Preparation and peer submission to Tier-1 IEEE/ACM conferences or Scopus/SCI indexed journals.',
        nextAfter: 'Prototype Development'
      },
      {
        title: 'Pilot Testing',
        stage: 'Deployment',
        domainTags: ['field test', 'industry'],
        description: 'Extended pilot trial deployment in real-world operating environments or campus testbeds.',
        nextAfter: 'Startup / MSME Pathway'
      },
      {
        title: 'Startup / MSME Pathway',
        stage: 'Commercialization',
        domainTags: ['incubation', 'grant', 'entrepreneurship'],
        description: 'Incubation admission, pre-seed prototyping grants, and commercial enterprise incorporation assistance.',
        nextAfter: null
      }
    ];

    await Opportunity.insertMany(opportunities);

    console.log('Creating completed demo journey for participant...');
    const submission = await Submission.create({
      owner: participant._id,
      title: 'AI-Assisted Campus Energy Monitoring System',
      type: 'idea',
      domain: 'Energy',
      keywords: ['energy', 'smart campus', 'iot', 'sustainability'],
      description: 'An IoT and sensor-driven platform for real-time monitoring, anomaly detection, and automated load balancing of campus electrical infrastructure across academic blocks.',
      stage: 'Research Validation',
      status: 'outcome_verified',
      expert: expert._id,
      reviewer: reviewer._id,
      recommendedPathway: ['Concept Validation', 'Expert Guidance', 'Prototype Development'],
      headlineRecommendation: 'Recommended next step: Concept Validation. Focus on structured institutional validation before progression.',
      recommendationSource: 'Rule-based pathway recommendation (AI-assisted personalization is planned as the next layer)',
      refinementNote: 'Integrated multi-point sub-metering specifications and baseline validation protocol per expert guidance.',
      nextOpportunity: 'Prototype Development, followed by IP Support',
      createdAt: new Date('2026-11-15T09:30:00Z')
    });

    // 1. Expert Review
    await Review.create({
      submission: submission._id,
      reviewer: expert._id,
      kind: 'expert',
      scores: {
        originality: 5,
        feasibility: 4,
        impact: 5,
        clarity: 4
      },
      comments: 'Solid conceptual architecture. The mathematical model for anomaly detection is sound. Recommend rigorous sensor calibration and baseline data gathering before full deployment.',
      createdAt: new Date('2026-11-16T11:00:00Z')
    });

    // 2. Progression Review
    await Review.create({
      submission: submission._id,
      reviewer: reviewer._id,
      kind: 'progression',
      decision: 'approved',
      comments: 'Progression validated. The baseline monitoring protocol meets technical progression criteria and the sensor topology is well reasoned.',
      createdAt: new Date('2026-11-17T14:30:00Z')
    });

    // 3. Verified Outcome
    await Outcome.create({
      submission: submission._id,
      reportedBy: participant._id,
      title: 'Campus Energy Baseline Validation Completed',
      description: 'Comprehensive 90-day baseline consumption dataset successfully logged across 4 campus academic blocks, identifying a 14% peak wastage window.',
      evidenceLink: 'https://repository.college.ac.in/validation/energy-baseline-2026.pdf',
      status: 'verified',
      verifiedBy: admin._id,
      verifiedAt: new Date('2026-11-18T16:00:00Z'),
      remark: 'Verified by Institutional Directorate after reviewing sensor log data repository and department sign-off.',
      createdAt: new Date('2026-11-18T10:00:00Z')
    });

    // 4. Passport Events (Chronological)
    const passportEvents = [
      {
        user: participant._id,
        submission: submission._id,
        step: 'submitted',
        title: 'Work Submitted',
        detail: 'Submitted "AI-Assisted Campus Energy Monitoring System" (idea) for institutional review.',
        createdAt: new Date('2026-11-15T09:30:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        step: 'under_evaluation',
        title: 'Assigned to Expert',
        detail: `Submission assigned to Expert ${expert.name} for technical evaluation.`,
        createdAt: new Date('2026-11-15T14:00:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        step: 'evaluated',
        title: 'Expert Evaluation Completed',
        detail: 'Expert evaluated work. Scores: Originality 5/5, Feasibility 4/5, Impact 5/5, Clarity 4/5.',
        createdAt: new Date('2026-11-16T11:00:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        step: 'refined',
        title: 'Refined Work Resubmitted',
        detail: 'Integrated multi-point sub-metering specifications and baseline validation protocol per expert guidance.',
        createdAt: new Date('2026-11-16T18:00:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        step: 'under_review',
        title: 'Assigned to Progression Reviewer',
        detail: `Submission assigned to Reviewer ${reviewer.name} for progression review.`,
        createdAt: new Date('2026-11-17T10:00:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        step: 'progression_validated',
        title: 'Progression Validated by Reviewer',
        detail: 'Reviewer approved progression: "Progression validated. The baseline monitoring protocol meets technical progression criteria."',
        createdAt: new Date('2026-11-17T14:30:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        step: 'outcome_reported',
        title: 'Outcome Reported with Evidence',
        detail: 'Reported achievement: "Campus Energy Baseline Validation Completed". Evidence link submitted for administrative verification.',
        createdAt: new Date('2026-11-18T10:00:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        step: 'outcome_verified',
        title: 'Outcome Verified by Admin',
        detail: 'Verified achievement: "Campus Energy Baseline Validation Completed". Next Opportunity Unlocked: Prototype Development, followed by IP Support.',
        createdAt: new Date('2026-11-18T16:00:00Z')
      }
    ];

    await PassportEvent.insertMany(passportEvents);

    // 5. Merit Entries
    const meritEntries = [
      // Participant Progression Merit
      {
        user: participant._id,
        submission: submission._id,
        role: 'participant',
        points: 10,
        reason: 'Submission created',
        createdAt: new Date('2026-11-15T09:30:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        role: 'participant',
        points: 10,
        reason: 'Refined work resubmitted',
        createdAt: new Date('2026-11-16T18:00:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        role: 'participant',
        points: 30,
        reason: 'Progression validated',
        createdAt: new Date('2026-11-17T14:30:00Z')
      },
      {
        user: participant._id,
        submission: submission._id,
        role: 'participant',
        points: 50,
        reason: 'Outcome verified by administrator',
        createdAt: new Date('2026-11-18T16:00:00Z')
      },
      // Expert Contribution Recognition
      {
        user: expert._id,
        submission: submission._id,
        role: 'expert',
        points: 15,
        reason: 'Expert evaluation completed',
        createdAt: new Date('2026-11-16T11:00:00Z')
      },
      // Reviewer Contribution Recognition
      {
        user: reviewer._id,
        submission: submission._id,
        role: 'reviewer',
        points: 15,
        reason: 'Progression decision completed',
        createdAt: new Date('2026-11-17T14:30:00Z')
      }
    ];

    await MeritEntry.insertMany(meritEntries);

    console.log('Seeding finished successfully!');
    console.log('----------------------------------------------------');
    console.log('Seeded Accounts (Password: Demo@1234):');
    console.log('1. Admin:        admin@uraiee.test        (Active: admin,        Roles: participant, admin)');
    console.log('2. Participant:  participant@uraiee.test  (Active: participant,  Roles: participant)');
    console.log('3. Expert:       expert@uraiee.test       (Active: expert,       Roles: participant, expert)');
    console.log('4. Reviewer:     reviewer@uraiee.test     (Active: reviewer,     Roles: participant, reviewer)');
    console.log('5. Mentor:       mentor@uraiee.test       (Active: mentor,       Roles: participant, mentor)');
    console.log('6. Jury:         jury@uraiee.test         (Active: jury,         Roles: participant, jury)');
    console.log('7. Editor:       editor@uraiee.test       (Active: editor,       Roles: participant, editor)');
    console.log('8. Coordinator:  coordinator@uraiee.test  (Active: coordinator,  Roles: participant, coordinator)');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
