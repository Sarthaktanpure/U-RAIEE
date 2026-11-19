import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { FolderKanban, PlusCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await api.get('/submissions/mine');
        setSubmissions(res.data.submissions);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load submissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading your academic submissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Academic Submissions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track real-time evaluation, author refinement, and reviewer progression across your portfolio.
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

        {submissions.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500">You have not registered any submissions yet.</p>
            <Link to="/submissions/new" className="btn-primary btn-small">
              Create your first submission
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Expert</th>
                  <th className="py-3 px-4">Assigned Reviewer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {submissions.map(sub => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {sub.title}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-xs text-slate-600">
                      {sub.type}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {sub.domain}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {sub.stage}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {sub.expert ? (
                        <span className="font-medium text-slate-800">{sub.expert.name}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {sub.reviewer ? (
                        <span className="font-medium text-slate-800">{sub.reviewer.name}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/submissions/${sub._id}`}
                        className="btn-secondary btn-small"
                      >
                        View
                      </Link>
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
