import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Compass,
  CheckCircle,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ShieldCheck,
  TrendingUp,
  Cpu,
  GraduationCap
} from 'lucide-react';

export default function Home() {
  const steps = [
    { num: '01', title: 'Login', desc: 'Authenticate into the institutional portal with single-sign-on credentials.' },
    { num: '02', title: 'My Roles & Access', desc: 'View currently approved roles and request specialized academic privileges.' },
    { num: '03', title: 'Participant Dashboard', desc: 'Access an institutional overview of current submissions, feedback queues, and merit.' },
    { num: '04', title: 'Submission', desc: 'Register initial ideas, engineering projects, research works, or prototypes.' },
    { num: '05', title: 'Pathway Recommendation', desc: 'Receive instant, rule-based progression pathways tailored to the submission.' },
    { num: '06', title: 'Expert Evaluation', desc: 'Undergo structured domain assessment across originality, feasibility, impact, and clarity.' },
    { num: '07', title: 'Refinement', desc: 'Author addresses expert critique with clear refinement notes and resubmission.' },
    { num: '08', title: 'Progression Review', desc: 'An independent reviewer validates progression readiness through the academic pathway.' },
    { num: '09', title: 'Merit & Recognition', desc: 'Earn Progression Merit for milestones and Contribution Recognition for service.' },
    { num: '10', title: 'Outcome Verification', desc: 'Submit tangible evidence of completion for administrative verification.' },
    { num: '11', title: 'Academic Passport', desc: 'View a verified, chronological transcript of your institutional innovation journey.' },
    { num: '12', title: 'Next Opportunity', desc: 'Unlock the next structured stage (e.g., Prototype Development, followed by IP Support).' }
  ];

  const scrollToJourney = () => {
    const el = document.getElementById('demo-journey-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-navy-900 to-slate-900 text-white p-8 sm:p-12 md:p-16 shadow-elevated border border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 -mt-12 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CONTINUOUS ACADEMIC PROGRESSION PORTAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            U-RAIEE
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-200">
            Unified Research, Academic, Innovation and Entrepreneurial Ecosystem
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            One Participant. Multiple Roles. Multiple Opportunities. One Continuous Progression Journey.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-brand-500/30 hover:scale-[1.02]"
            >
              <span>Open Working Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={scrollToJourney}
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all duration-200 hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4 text-brand-300" />
              <span>View Demo Journey</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Live Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Stage</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-800 mb-1">
              Research / Validation
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empirical baseline logged across campus testbeds with structured sensor instrumentation.
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-emerald-200/80 bg-white p-6 shadow-subtle flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Verified Outcome</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-emerald-900 mb-1">
              Campus Energy Baseline Validation Completed
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified by Institutional Directorate with formal repository documentation.
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/40 p-6 shadow-subtle flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Next Opportunity</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-indigo-950 mb-1">
              Prototype Development, followed by IP Support
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pre-seed prototyping grant &amp; institutional patent filing support pathway.
            </p>
          </div>
        </motion.div>
      </div>

      {/* 12-Step Continuous Progression Loop */}
      <div id="demo-journey-section" className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Accountable Academic Lifecycle</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              The 12-Step Continuous Progression Loop
            </h2>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold self-start sm:self-auto">
            Human-Validated
          </span>
        </div>

        <p className="text-sm text-slate-600 max-w-2xl">
          Every participant moves one piece of work through an accountable, human-validated academic workflow from initial profile creation to next-stage entrepreneurial opportunities:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {steps.map((s) => (
            <div
              key={s.num}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-200 hover:shadow-xs transition-all duration-200 group"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 font-bold text-sm text-brand-700 shadow-2xs group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
                {s.num}
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                  {s.title}
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Larger Architectural Scope */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-subtle space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            U-RAIEE is larger than the current prototype
          </h3>
          <p className="text-sm text-slate-600">
            While this prototype implements the complete foundational progression engine, the full institutional architecture includes:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            'Contribution recognition',
            'Hierarchical conferences',
            'Tiered journals',
            'Peer review',
            'Mentoring',
            'Industry collaboration',
            'MSME/startup pathways',
            'AI-assisted matching'
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-center font-semibold text-brand-900 text-sm">
          One Participant. Multiple Roles. Multiple Activities. Multiple Levels... and a Verified Progression Journey.
        </div>
      </div>
    </div>
  );
}
