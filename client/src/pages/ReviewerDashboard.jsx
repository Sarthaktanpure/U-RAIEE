import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ReviewerDashboard() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setLoading(true);
        const res = await api.get('/reviewer/queue');
        setQueue(res.data.queue);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reviewer queue.');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading progression review queue...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Progression Review Workspace</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Progression Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submissions assigned to you for validating academic pathway progression after expert evaluation and author refinement (+15 Contribution Recognition).
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {queue.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            Your progression review queue is currently clear.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Author &amp; Dept</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {queue.map(sub => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {sub.title}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <strong>{sub.owner?.name}</strong><br />
                      <span className="text-[11px] text-slate-400">{sub.owner?.department}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {sub.domain}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.status === 'under_review' ? (
                        <Link
                          to={`/reviewer/decide/${sub._id}`}
                          className="btn-primary btn-small whitespace-nowrap"
                        >
                          Review progression
                        </Link>
                      ) : (
                        <Link
                          to={`/submissions/${sub._id}`}
                          className="btn-secondary btn-small whitespace-nowrap"
                        >
                          View decision
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
