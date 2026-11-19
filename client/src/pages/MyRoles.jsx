import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Clock, Send, KeyRound, ArrowRightLeft, Sparkles } from 'lucide-react';

export default function MyRoles() {
  const { user, refreshUser } = useAuth();
  const [roleData, setRoleData] = useState({ approvedRoles: [], activeRole: '', requests: [] });
  const [selectedRole, setSelectedRole] = useState('expert');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const allAvailableRoles = [
    { key: 'participant', label: 'Participant', desc: 'Core participant role. Submits research, projects, and tracks continuous academic progression.' },
    { key: 'expert', label: 'Expert', desc: 'Evaluates technical submissions, scoring originality, feasibility, impact, and clarity.' },
    { key: 'reviewer', label: 'Reviewer', desc: 'Validates academic pathway progression and evaluates author refinement resubmissions.' },
    { key: 'mentor', label: 'Mentor', desc: 'Provides institutional guidance and advisory research support across innovation cycles.' },
    { key: 'jury', label: 'Jury Member', desc: 'Evaluates institutional competitions, project showcases, and innovation awards.' },
    { key: 'editor', label: 'Editor', desc: 'Oversees institutional proceedings, conference submissions, and monograph publications.' },
    { key: 'coordinator', label: 'Institutional Coordinator', desc: 'Coordinates departmental research clusters and external collaborations.' },
    { key: 'admin', label: 'Administrator', desc: 'Manages role approvals, expert/reviewer assignments, and verifies outcomes.' }
  ];

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/roles/my');
      setRoleData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSwitchRole = async (role) => {
    try {
      setError('');
      setMessage('');
      await api.post('/roles/switch', { role });
      setMessage(`Active role successfully switched to ${role}.`);
      await refreshUser();
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to switch role.');
    }
  };

  const handleRequestRole = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setSubmitting(true);
      await api.post('/roles/request', { role: selectedRole, reason });
      setMessage(`Access request for ${selectedRole} submitted for Administrator review.`);
      setReason('');
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit role request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card-premium text-center py-12 text-slate-500 text-sm">
        Loading institutional role privileges...
      </div>
    );
  }

  const pendingRoles = roleData.requests.filter(r => r.status === 'pending').map(r => r.role);
  const eligibleToRequest = allAvailableRoles.filter(
    r => r.key !== 'participant' && r.key !== 'admin' && !roleData.approvedRoles.includes(r.key) && !pendingRoles.includes(r.key)
  );

  return (
    <div className="space-y-6">
      {/* Title & Current Active Role Header */}
      <div className="card-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Multi-Role Credentialing</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Roles &amp; Access
            </h1>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 self-start sm:self-auto">
            <span className="text-xs text-brand-600">Active Role:</span>
            <span className="font-bold text-sm tracking-wide capitalize">{roleData.activeRole}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-4 leading-relaxed">
          One user can hold multiple institutional roles simultaneously. Everyone starts as a Participant. Additional responsibilities are requested and activated only upon Administrator approval.
        </p>

        {message && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Roles Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Responsibilities &amp; Privileges</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-44">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {allAvailableRoles
                .filter(r => r.key !== 'admin' || roleData.approvedRoles.includes('admin'))
                .map(r => {
                  const isApproved = roleData.approvedRoles.includes(r.key);
                  const isCurrentActive = roleData.activeRole === r.key;
                  const isPending = pendingRoles.includes(r.key);

                  return (
                    <tr key={r.key} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {r.label}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 leading-relaxed max-w-md">
                        {r.desc}
                      </td>
                      <td className="py-3.5 px-4">
                        {isApproved ? (
                          <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        ) : isPending ? (
                          <span className="badge-pill bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="badge-pill bg-slate-100 text-slate-600 border border-slate-200">
                            Not requested
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isApproved ? (
                          isCurrentActive ? (
                            <span className="text-xs font-semibold text-brand-600 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-brand-500" />
                              Active Now
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSwitchRole(r.key)}
                              className="btn-secondary btn-small inline-flex items-center gap-1.5"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Switch to role</span>
                            </button>
                          )
                        ) : isPending ? (
                          <span className="text-xs text-slate-400">Awaiting Admin decision</span>
                        ) : (
                          <span className="text-xs text-slate-400">Eligible to request</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Request Form */}
      {eligibleToRequest.length > 0 && (
        <div className="card-premium">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">Request Role Access</h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Submit your credentials and institutional justification to the Administrator for formal role approval.
          </p>

          <form onSubmit={handleRequestRole} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input-field"
              >
                {eligibleToRequest.map(r => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reason &amp; Department Justification</label>
              <textarea
                rows="3"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State your academic domain, relevant papers, lab designation, or project experience..."
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Request access'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Role Request History */}
      {roleData.requests.length > 0 && (
        <div className="card-premium">
          <h2 className="text-base font-bold text-slate-900 mb-3">Your Submitted Role Requests</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Justification</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-xs">
                {roleData.requests.map(req => (
                  <tr key={req._id}>
                    <td className="py-2.5 px-4 font-semibold capitalize">{req.role}</td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-sm truncate">{req.reason}</td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`badge-pill ${
                        req.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {req.status}
                      </span>
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
}
