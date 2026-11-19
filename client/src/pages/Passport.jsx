import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function Passport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        setLoading(true);
        const res = await api.get('/passport');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load Academic Passport.');
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, []);

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading verified Academic Passport ledger...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card-premium text-center py-12 text-rose-600 text-sm">
        Academic Passport data not found.
      </div>
    );
  }

  const { participant, events, submissions } = data;

  const milestoneList = [
    { key: 'submitted', label: '1. Submission', desc: 'Author registered the academic work for institutional validation.' },
    { key: 'recommendation', label: '2. Pathway Recommendation', desc: 'Rule-based roadmap assigned based on type and keywords.' },
    { key: 'evaluated', label: '3. Expert Evaluation', desc: 'Domain expert completed structured scoring and feedback.' },
    { key: 'refined', label: '4. Refinement', desc: 'Author addressed expert critique and resubmitted refined work.' },
    { key: 'progression_validated', label: '5. Progression Review', desc: 'Independent reviewer validated pathway progression.' },
    { key: 'merit', label: '6. Merit & Recognition', desc: 'Progression merit points earned on the institutional ledger.' },
    { key: 'outcome_verified', label: '7. Verified Outcome', desc: 'Administrator verified tangible outcome with repository evidence.' },
    { key: 'next_opportunity', label: '8. Next Opportunity', desc: 'Unlocked the next academic and entrepreneurial phase.' }
  ];

  return (
    <div className="space-y-6">
      {/* Official Academic Certificate Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 text-brand-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Academic Passport</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {participant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-400" /> {participant.institution}</span>
                <span>&bull;</span>
                <span>{participant.department}</span>
                <span>&bull;</span>
                <span className="text-slate-400 font-mono">{participant.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Verified Journeys</div>
              <div className="text-lg font-extrabold text-white">{submissions.length}</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-center">
              <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Outcomes Verified</div>
              <div className="text-lg font-extrabold text-emerald-400">{data.verifiedOutcomes.length}</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Journeys per submission */}
      {submissions.length === 0 ? (
        <div className="card-premium text-center py-16 text-slate-500 text-sm">
          No academic journeys logged on this passport yet.
        </div>
      ) : (
        submissions.map(sub => {
          const subEvents = events.filter(e => e.submission && e.submission._id === sub._id);
          const stepsCompleted = new Set(subEvents.map(e => e.step));

          const isSubmitted = stepsCompleted.has('submitted') || sub.status !== '';
          const hasRecommendation = isSubmitted;
          const isEvaluated = stepsCompleted.has('evaluated') || ['evaluated', 'refinement', 'refined', 'under_review', 'progression_validated', 'outcome_reported', 'outcome_verified'].includes(sub.status);
          const isRefined = stepsCompleted.has('refined') || ['refined', 'under_review', 'progression_validated', 'outcome_reported', 'outcome_verified'].includes(sub.status);
          const isProgressionValidated = stepsCompleted.has('progression_validated') || ['progression_validated', 'outcome_reported', 'outcome_verified'].includes(sub.status);
          const hasMerit = isSubmitted;
          const isOutcomeVerified = stepsCompleted.has('outcome_verified') || sub.status === 'outcome_verified';
          const hasNextOpportunity = isOutcomeVerified && sub.nextOpportunity;

          const milestoneStatus = {
            submitted: isSubmitted,
            recommendation: hasRecommendation,
            evaluated: isEvaluated,
            refined: isRefined,
            progression_validated: isProgressionValidated,
            merit: hasMerit,
            outcome_verified: isOutcomeVerified,
            next_opportunity: hasNextOpportunity
          };

          return (
            <div key={sub._id} className="card-premium space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Journey Transcript</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">{sub.title}</h2>
                </div>
                <span className="badge-pill bg-slate-100 text-slate-700 capitalize self-start sm:self-auto font-medium">
                  {sub.type}
                </span>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="pl-2 space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {milestoneList.map((m) => {
                  const completed = milestoneStatus[m.key];
                  return (
                    <div key={m.key} className="relative flex items-start gap-4 group">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                        completed
                          ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                          : 'bg-white border-2 border-slate-300 text-slate-300'
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <div className="space-y-0.5 pt-0.5">
                        <div className={`text-sm font-semibold flex items-center gap-2 ${
                          completed ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          <span>{m.label}</span>
                          {completed && (
                            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${completed ? 'text-slate-600' : 'text-slate-400'}`}>
                          {m.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Opportunity Box */}
              {sub.nextOpportunity && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Next Opportunity Unlocked</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {sub.nextOpportunity}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Recorded in permanent institutional archives.
                  </div>
                </div>
              )}

              {/* Ledger Entries Table */}
              {subEvents.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Chronological Ledger Entries ({subEvents.length})
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="py-2.5 px-4 w-32">Date</th>
                          <th className="py-2.5 px-4 w-56">Event</th>
                          <th className="py-2.5 px-4">Ledger Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white text-xs">
                        {subEvents.map(e => (
                          <tr key={e._id}>
                            <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                              {new Date(e.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-slate-800">
                              {e.title}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {e.detail}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
