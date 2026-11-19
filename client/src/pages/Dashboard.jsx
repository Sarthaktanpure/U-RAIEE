import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Clock,
  Sparkles,
  BookOpen,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    submissionsCount: 0,
    pendingFeedbackCount: 0,
    meritPoints: 0,
    passportEntriesCount: 0,
    recentSubmissions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading institutional dashboard metrics...
      </div>
    );
  }

  const statCards = [
    {
      label: 'Submissions',
      value: stats.submissionsCount,
      icon: FolderKanban,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 text-blue-700 border-blue-100',
      desc: 'Registered works'
    },
    {
      label: 'Awaiting Feedback',
      value: stats.pendingFeedbackCount,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 text-amber-700 border-amber-100',
      desc: 'In evaluation/review'
    },
    {
      label: 'Merit Points',
      value: stats.meritPoints,
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      desc: 'Earned progression'
    },
    {
      label: 'Passport Entries',
      value: stats.passportEntriesCount,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      bg: 'bg-purple-50 text-purple-700 border-purple-100',
      desc: 'Verified milestones'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card-premium bg-gradient-to-r from-white via-slate-50/50 to-brand-50/30 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span>Institutional Overview</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {user?.institution} &bull; {user?.department} &bull; Active Role: <strong className="capitalize text-brand-700">{user?.activeRole}</strong>
            </p>
          </div>

          <Link to="/submissions/new" className="btn-primary self-start sm:self-auto">
            <PlusCircle className="w-4 h-4" />
            <span>New submission</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-subtle flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${card.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {card.desc}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <div className="card-premium">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Academic Submissions</h2>
            <p className="text-xs text-slate-500">Continuous milestone tracking</p>
          </div>
          <Link
            to="/submissions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentSubmissions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500">No submissions recorded yet.</p>
            <Link to="/submissions/new" className="btn-primary btn-small">
              Submit your first work
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {stats.recentSubmissions.map(sub => (
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
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/submissions/${sub._id}`}
                        className="btn-secondary btn-small"
                      >
                        Details
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
