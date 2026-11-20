import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
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
  GraduationCap,
  Play,
  Users,
  Lightbulb,
  Infinity as InfinityIcon,
  Star,
  Briefcase
} from 'lucide-react';

export default function Home() {
  const [metrics, setMetrics] = useState({
    participantsCount: null,
    submissionsCount: null,
    opportunitiesCount: null,
    verifiedOutcomesCount: null
  });

  useEffect(() => {
    const fetchPublicMetrics = async () => {
      try {
        const res = await api.get('/dashboard/public-metrics');
        setMetrics(res.data);
      } catch (err) {
        console.warn('Unable to fetch live public metrics:', err);
      }
    };
    fetchPublicMetrics();
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-[#060919] text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-slate-800/80">
        {/* Diffuse Aurora Glow Elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/4 -right-24 w-[28rem] h-[28rem] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Cosmic Orbital Rings & Constellation Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute -right-24 top-1/2 -translate-y-1/2 w-[740px] h-[540px] opacity-75 hidden md:block"
            viewBox="0 0 740 540"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <ellipse
              cx="370"
              cy="270"
              rx="330"
              ry="180"
              transform="rotate(-20 370 270)"
              stroke="url(#orbitGlow)"
              strokeWidth="1.5"
            />
            <circle cx="160" cy="350" r="3.5" fill="#38bdf8" className="animate-pulse" />
            <circle cx="590" cy="190" r="3" fill="#c084fc" className="animate-pulse" />
            <circle cx="510" cy="390" r="2.5" fill="#60a5fa" />
            <circle cx="260" cy="140" r="2" fill="#38bdf8" />
            <circle cx="660" cy="280" r="2" fill="#a855f7" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Main Hero Split Grid: Left Headline & CTA, Right Constellation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-blue-500/30 text-slate-300 text-xs font-medium shadow-[0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>
                </span>
                <span>Continuous Academic Progression Portal</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  U-RAIEE
                </h1>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  Learning <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent font-extrabold">Beyond</span> Limits
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                One Participant. Multiple Roles. Multiple Opportunities.<br className="hidden sm:inline" />
                One Continuous Progression Journey.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.65)] hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Open Working Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={scrollToJourney}
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 text-white font-semibold text-sm border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-md shadow-sm hover:scale-[1.03] active:scale-[0.98]"
                >
                  <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center pl-0.5">
                    <Play className="w-2.5 h-2.5 fill-current text-white" />
                  </div>
                  <span>View Demo Journey</span>
                </button>
              </div>
            </div>

            {/* Right Column: 4 Floating Cosmic Constellation Cards */}
            <div className="lg:col-span-5 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Card 1: Innovate */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)] mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white tracking-wide">Innovate</div>
                    <div className="text-xs text-slate-400 mt-0.5">Grow Excel</div>
                  </div>
                </motion.div>

                {/* Card 2: Explore */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.8 }}
                  className="sm:translate-y-6 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white tracking-wide">Explore</div>
                    <div className="text-xs text-slate-400 mt-0.5">Collaborate</div>
                  </div>
                </motion.div>

                {/* Card 3: Research */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1.6 }}
                  className="sm:-translate-y-2 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)] mb-3">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white tracking-wide">Research</div>
                    <div className="text-xs text-slate-400 mt-0.5">Create Impact</div>
                  </div>
                </motion.div>

                {/* Card 4: Entrepreneurship */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 2.2 }}
                  className="sm:translate-y-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] mb-3">
                    <InfinityIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white tracking-wide">Entrepreneurship</div>
                    <div className="text-xs text-slate-400 mt-0.5">Build Tomorrow</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Metrics Ribbon */}
          <div className="mt-12 lg:mt-16 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-4 sm:py-5 sm:px-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="flex items-center gap-3 sm:justify-center pt-2 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base sm:text-lg flex items-center gap-1.5">
                    <span>{metrics.participantsCount !== null ? `${metrics.participantsCount}+` : '...'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Live database count" />
                  </div>
                  <div className="text-xs text-slate-400">Participants</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:justify-center pt-2 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Star className="w-5 h-5 fill-current text-blue-400" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base sm:text-lg">Multiple</div>
                  <div className="text-xs text-slate-400">Roles</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:justify-center pt-2 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base sm:text-lg">Infinite</div>
                  <div className="text-xs text-slate-400">Opportunities</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:justify-center pt-2 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <InfinityIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base sm:text-lg">Continuous</div>
                  <div className="text-xs text-slate-400">Progression</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll to Explore Indicator */}
          <div className="pt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
            <div className="w-4 h-6 rounded-full border border-slate-500/70 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]"
              />
            </div>
            <span>Scroll to explore</span>
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
