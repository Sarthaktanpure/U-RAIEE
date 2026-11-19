import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  UserCheck,
  Send,
  AlertCircle
} from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('requests');

  const [roleRequests, setRoleRequests] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [usersData, setUsersData] = useState({ experts: [], reviewers: [], allUsers: [] });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [selectedExperts, setSelectedExperts] = useState({});
  const [selectedReviewers, setSelectedReviewers] = useState({});
  const [selectedGrantRole, setSelectedGrantRole] = useState({});
  const [outcomeRemarks, setOutcomeRemarks] = useState({});

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [reqRes, usersRes, outRes, subsRes] = await Promise.all([
        api.get('/admin/role-requests'),
        api.get('/admin/users-by-role'),
        api.get('/admin/outcomes'),
        api.get('/admin/submissions')
      ]);

      setRoleRequests(reqRes.data.requests);
      setUsersData(usersRes.data);
      setOutcomes(outRes.data.outcomes);
      setAllSubmissions(subsRes.data.submissions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDecideRole = async (requestId, action) => {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');
      await api.patch(`/admin/role-requests/${requestId}`, { action });
      setMessage(`Role request has been ${action}d successfully.`);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} role request.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageRole = async (userId, role, action) => {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');
      const res = await api.patch(`/admin/users/${userId}/role`, { role, action });
      setMessage(res.data.message);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} role.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (submissionId, type) => {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      const payload = type === 'expert'
        ? { expertId: selectedExperts[submissionId] }
        : { reviewerId: selectedReviewers[submissionId] };

      if (type === 'expert' && !selectedExperts[submissionId]) {
        setError('Please select an expert from the dropdown.');
        setActionLoading(false);
        return;
      }

      if (type === 'reviewer' && !selectedReviewers[submissionId]) {
        setError('Please select a reviewer from the dropdown.');
        setActionLoading(false);
        return;
      }

      const res = await api.patch(`/admin/submissions/${submissionId}/assign`, payload);
      setMessage(res.data.message);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Assignment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecideOutcome = async (outcomeId, action) => {
    try {
      setActionLoading(true);
      setError('');
      setMessage('');
      const remark = outcomeRemarks[outcomeId] || '';
      const res = await api.patch(`/admin/outcomes/${outcomeId}`, { action, remark });
      setMessage(res.data.message);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} outcome.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading administrator management console...
      </div>
    );
  }

  const pendingRequestsCount = roleRequests.filter(r => r.status === 'pending').length;
  const pendingOutcomesCount = outcomes.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrative Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Administration Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Human-validated oversight: Approve academic credentials, enforce anti-conflict evaluator assignments, and verify tangible achievement outcomes.
          </p>
        </div>

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

        {/* Tab Selector */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'requests'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Role Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-[10px]">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outcomes')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'outcomes'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Outcome Verification</span>
            {pendingOutcomesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px]">
                {pendingOutcomesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'assignments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Evaluator Assignments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Institutional Users ({usersData.allUsers?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: Role Requests */}
        {activeTab === 'requests' && (
          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Academic Role Requests</h2>
            {roleRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No role requests submitted yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Institution &amp; Dept</th>
                      <th className="py-3 px-4">Requested Role</th>
                      <th className="py-3 px-4">Academic Rationale</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 w-40">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-xs">
                    {roleRequests.map(req => (
                      <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {req.user?.name}<br />
                          <span className="text-[11px] text-slate-400 font-mono">{req.user?.email}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {req.user?.institution}<br />
                          <span className="text-slate-400">{req.user?.department}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="badge-pill bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                            {req.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                          {req.reason}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="py-3 px-4">
                          {req.status === 'pending' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleDecideRole(req._id, 'approve')}
                                className="btn-primary btn-small py-1 px-2.5 text-[11px]"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleDecideRole(req._id, 'reject')}
                                className="btn-danger btn-small py-1 px-2.5 text-[11px]"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400">Decided</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Outcome Verification */}
        {activeTab === 'outcomes' && (
          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Reported Outcomes Awaiting Verification</h2>
            {outcomes.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No reported outcomes in the portal.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Outcome Title</th>
                      <th className="py-3 px-4">Author &amp; Submission</th>
                      <th className="py-3 px-4">Evidence Link</th>
                      <th className="py-3 px-4">Admin Remark</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 w-44">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-xs">
                    {outcomes.map(out => (
                      <tr key={out._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <strong className="text-slate-900 font-semibold">{out.title}</strong>
                          <div className="text-slate-500 mt-0.5 line-clamp-1">{out.description}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <strong>{out.reportedBy?.name}</strong><br />
                          <span className="text-slate-400">{out.submission?.title}</span>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={out.evidenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 underline font-medium"
                          >
                            <span>Evidence</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          {out.status === 'pending' ? (
                            <input
                              type="text"
                              placeholder="Add verification remark..."
                              value={outcomeRemarks[out._id] || ''}
                              onChange={(e) => setOutcomeRemarks({ ...outcomeRemarks, [out._id]: e.target.value })}
                              className="input-field py-1 text-xs"
                            />
                          ) : (
                            <span className="text-slate-500">{out.remark || '—'}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={out.status} />
                        </td>
                        <td className="py-3 px-4">
                          {out.status === 'pending' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleDecideOutcome(out._id, 'verify')}
                                className="btn-primary btn-small py-1 px-2.5 text-[11px]"
                              >
                                Verify (+50)
                              </button>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleDecideOutcome(out._id, 'reject')}
                                className="btn-danger btn-small py-1 px-2.5 text-[11px]"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              Verified by {out.verifiedBy?.name || 'Admin'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Assignments */}
        {activeTab === 'assignments' && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Assign Non-Conflicting Evaluators</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enforces institutional integrity: The Expert and Reviewer must be separate individuals, and neither can be the author of the work.
                </p>
              </div>
              <span className="badge-pill bg-slate-100 text-slate-700 font-medium">
                Total Submissions: {allSubmissions.length}
              </span>
            </div>

            {allSubmissions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No submissions registered in the system yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Submission</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Assigned Expert</th>
                      <th className="py-3 px-4">Assigned Reviewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-xs">
                    {allSubmissions.map(sub => (
                      <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                          <div className="truncate font-semibold">{sub.title}</div>
                          <span className="text-[10px] text-slate-400 capitalize">{sub.type} &bull; {sub.domain}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {sub.owner?.name}<br />
                          <span className="text-[11px] text-slate-400">{sub.owner?.department}</span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1.5">
                            <div className="text-[11px]">
                              Current: <strong className="text-slate-800">{sub.expert?.name || 'Unassigned'}</strong>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <select
                                value={selectedExperts[sub._id] || ''}
                                onChange={(e) => setSelectedExperts({ ...selectedExperts, [sub._id]: e.target.value })}
                                className="input-field py-1 text-xs max-w-[150px]"
                              >
                                <option value="">Select Expert...</option>
                                {usersData.experts.map(exp => (
                                  <option key={exp._id} value={exp._id}>
                                    {exp.name} ({exp.institution?.slice(0, 15)}...)
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleAssign(sub._id, 'expert')}
                                className="btn-secondary btn-small py-1 px-2 text-[11px]"
                              >
                                Assign
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1.5">
                            <div className="text-[11px]">
                              Current: <strong className="text-slate-800">{sub.reviewer?.name || 'Unassigned'}</strong>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <select
                                value={selectedReviewers[sub._id] || ''}
                                onChange={(e) => setSelectedReviewers({ ...selectedReviewers, [sub._id]: e.target.value })}
                                className="input-field py-1 text-xs max-w-[150px]"
                              >
                                <option value="">Select Reviewer...</option>
                                {usersData.reviewers.map(rev => (
                                  <option key={rev._id} value={rev._id}>
                                    {rev.name} ({rev.institution?.slice(0, 15)}...)
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleAssign(sub._id, 'reviewer')}
                                className="btn-secondary btn-small py-1 px-2 text-[11px]"
                              >
                                Assign
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Users & Direct Role Administration */}
        {activeTab === 'users' && (
          <div className="mt-6 space-y-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Institutional User Registry &amp; Role Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin controls: Directly grant any role (including Admin promotion) or revoke approved roles across the ecosystem.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Institution &amp; Department</th>
                    <th className="py-3 px-4">Approved Roles</th>
                    <th className="py-3 px-4">Active</th>
                    <th className="py-3 px-4 min-w-[220px]">Grant New Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-xs">
                  {usersData.allUsers.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {u.name}<br />
                        <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {u.institution}<br />
                        <span className="text-slate-400">{u.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {u.approvedRoles?.map(r => (
                            <span
                              key={r}
                              className={`badge-pill text-[11px] inline-flex items-center gap-1 ${
                                r === 'admin'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span className="capitalize">{r}</span>
                              {r !== 'participant' && (
                                <button
                                  type="button"
                                  title={`Revoke ${r} role`}
                                  disabled={actionLoading}
                                  onClick={() => handleManageRole(u._id, r, 'revoke')}
                                  className="text-slate-400 hover:text-rose-600 font-bold ml-0.5 text-xs"
                                >
                                  &times;
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge-pill bg-brand-50 text-brand-700 capitalize border border-brand-200">
                          {u.activeRole}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={selectedGrantRole[u._id] || ''}
                            onChange={(e) => setSelectedGrantRole({ ...selectedGrantRole, [u._id]: e.target.value })}
                            className="input-field py-1 text-xs max-w-[130px]"
                          >
                            <option value="">Choose role...</option>
                            <option value="admin">Admin</option>
                            <option value="expert">Expert</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="mentor">Mentor</option>
                            <option value="jury">Jury</option>
                            <option value="editor">Editor</option>
                            <option value="coordinator">Coordinator</option>
                          </select>
                          <button
                            type="button"
                            disabled={actionLoading || !selectedGrantRole[u._id]}
                            onClick={() => {
                              if (selectedGrantRole[u._id]) {
                                handleManageRole(u._id, selectedGrantRole[u._id], 'grant');
                                setSelectedGrantRole({ ...selectedGrantRole, [u._id]: '' });
                              }
                            }}
                            className="btn-primary btn-small py-1 px-2.5 text-[11px]"
                          >
                            Grant
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
