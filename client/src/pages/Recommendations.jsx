import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { Compass, ArrowRight, PlusCircle, Sparkles } from 'lucide-react';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recommendations');
        setRecommendations(res.data.recommendations);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading personalized pathway roadmaps...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pathway Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Rule-based progression roadmaps tailored to the type, domain, and focus keywords of your academic work.
            </p>
          </div>

          <Link to="/submissions/new" className="btn-primary self-start sm:self-auto">
            <PlusCircle className="w-4 h-4" />
            <span>New submission</span>
          </Link>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {recommendations.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500">No active recommendations found. Submit your academic work to receive a tailored pathway.</p>
            <Link to="/submissions/new" className="btn-primary btn-small">
              Submit new work
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {recommendations.map(sub => (
              <div
                key={sub._id}
                className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{sub.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="capitalize font-medium text-slate-700">{sub.type}</span>
                      <span>&bull;</span>
                      <span>{sub.domain}</span>
                      <span>&bull;</span>
                      <span>{sub.stage}</span>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-50 to-blue-50/30 border border-brand-200/70">
                  <div className="text-xs font-bold text-brand-900">
                    {sub.headlineRecommendation || 'Standard academic progression recommended.'}
                  </div>
                  <div className="text-[11px] text-brand-700 mt-0.5">
                    {sub.recommendationSource}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Structured Sequence</div>
                  <div className="flex flex-wrap gap-2">
                    {sub.recommendedPathway.map((step, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-1.5"
                      >
                        <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/submissions/${sub._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <span>Open work details &amp; progression ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
