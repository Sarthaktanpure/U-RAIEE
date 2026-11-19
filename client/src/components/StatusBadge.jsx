import React from 'react';

export default function StatusBadge({ status }) {
  const statusConfig = {
    submitted: {
      label: 'Submitted',
      bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
      dot: 'bg-blue-500'
    },
    under_evaluation: {
      label: 'Under Evaluation',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      dot: 'bg-indigo-500 animate-pulse'
    },
    evaluated: {
      label: 'Evaluated',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500'
    },
    refinement: {
      label: 'Needs Refinement',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      dot: 'bg-amber-500'
    },
    refined: {
      label: 'Refined',
      bg: 'bg-sky-50 text-sky-700 border-sky-200/60',
      dot: 'bg-sky-500'
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-violet-50 text-violet-700 border-violet-200/60',
      dot: 'bg-violet-500 animate-pulse'
    },
    progression_validated: {
      label: 'Progression Validated',
      bg: 'bg-teal-50 text-teal-700 border-teal-200/60',
      dot: 'bg-teal-500'
    },
    outcome_reported: {
      label: 'Outcome Reported',
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
      dot: 'bg-cyan-500'
    },
    outcome_verified: {
      label: 'Outcome Verified',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500'
    },
    pending: {
      label: 'Pending',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400'
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500'
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-500'
    }
  };

  const config = statusConfig[status] || {
    label: status ? status.replace(/_/g, ' ') : 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="capitalize">{config.label}</span>
    </span>
  );
}
