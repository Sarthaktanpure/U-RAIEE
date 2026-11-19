import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Award, Sparkles, TrendingUp, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

export default function Merit() {
  const [data, setData] = useState({ progressionTotal: 0, contributionTotal: 0, entries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMerit = async () => {
      try {
        setLoading(true);
        const res = await api.get('/merit');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load merit records.');
      } finally {
        setLoading(false);
      }
    };
    fetchMerit();
  }, []);

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading institutional merit ledger...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Merit &amp; Recognition Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Accountable tracking of milestone achievements (Progression Merit) and academic service in specialized roles (Contribution Recognition).
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Two Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/40 p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Progression Merit</span>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-blue-900">{data.progressionTotal} <span className="text-sm font-medium text-blue-600">pts</span></div>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Earned as Author / Participant completing verified workflow milestones.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Contribution Recognition</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-emerald-900">{data.contributionTotal} <span className="text-sm font-medium text-emerald-600">pts</span></div>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Earned for institutional service as Expert Evaluator or Progression Reviewer.
            </p>
          </div>
        </div>

        {/* Prototype architecture note */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Cumulated Progression Merit and normalized Contribution Recognition are part of the full U-RAIEE architecture and are not in this prototype.
          </span>
        </div>

        {/* Standard Schedule */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Standard Merit Allocation Schedule</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Event / Milestone</th>
                  <th className="py-2.5 px-4">Role Credited</th>
                  <th className="py-2.5 px-4 w-24">Points</th>
                  <th className="py-2.5 px-4">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">Initial submission created</td>
                  <td className="py-2.5 px-4 text-slate-600">Participant</td>
                  <td className="py-2.5 px-4 font-bold text-blue-700">+10</td>
                  <td className="py-2.5 px-4 text-slate-500">Progression Merit</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">Refined work resubmitted</td>
                  <td className="py-2.5 px-4 text-slate-600">Participant</td>
                  <td className="py-2.5 px-4 font-bold text-blue-700">+10</td>
                  <td className="py-2.5 px-4 text-slate-500">Progression Merit</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">Progression validated by reviewer</td>
                  <td className="py-2.5 px-4 text-slate-600">Participant</td>
                  <td className="py-2.5 px-4 font-bold text-blue-700">+30</td>
                  <td className="py-2.5 px-4 text-slate-500">Progression Merit</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">Outcome verified by administrator</td>
                  <td className="py-2.5 px-4 text-slate-600">Participant</td>
                  <td className="py-2.5 px-4 font-bold text-blue-700">+50</td>
                  <td className="py-2.5 px-4 text-slate-500">Progression Merit</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">Expert technical evaluation completed</td>
                  <td className="py-2.5 px-4 text-slate-600">Expert</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">+15</td>
                  <td className="py-2.5 px-4 text-slate-500">Contribution Recognition</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">Progression decision completed</td>
                  <td className="py-2.5 px-4 text-slate-600">Reviewer</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">+15</td>
                  <td className="py-2.5 px-4 text-slate-500">Contribution Recognition</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ledger Entries */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Your Merit Ledger Entries ({data.entries.length})</h2>
          {data.entries.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No merit entries recorded yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-4 w-32">Date</th>
                    <th className="py-2.5 px-4 w-28">Role</th>
                    <th className="py-2.5 px-4 w-24">Points</th>
                    <th className="py-2.5 px-4">Reason &amp; Description</th>
                    <th className="py-2.5 px-4">Associated Work</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-xs">
                  {data.entries.map(entry => (
                    <tr key={entry._id}>
                      <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`badge-pill ${
                          entry.role === 'participant' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        } capitalize`}>
                          {entry.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-bold">
                        <span className={entry.role === 'participant' ? 'text-blue-700' : 'text-emerald-700'}>
                          +{entry.points}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">
                        {entry.reason}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 truncate max-w-xs">
                        {entry.submission ? entry.submission.title : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
