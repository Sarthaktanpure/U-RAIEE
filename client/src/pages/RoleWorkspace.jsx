import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, ArrowLeft, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';

export default function RoleWorkspace() {
  const { role } = useParams();
  const { user } = useAuth();

  const roleDescriptions = {
    mentor: 'Mentors provide long-term advisory steering, advising research scholars and student innovators across empirical validation, experimental methodology, and lab milestones.',
    jury: 'Jury members participate in institutional evaluation committees, judging campus innovation competitions, hackathons, and assessing annual capstone showcases.',
    editor: 'Editors supervise institutional research publications, university conference proceedings, peer-review panel formation, and academic monograph dissemination.',
    coordinator: 'Institutional Coordinators oversee inter-departmental collaboration clusters, industry liaison programs, patent cell referrals, and external incubator admissions.'
  };

  const isApproved = user?.approvedRoles?.includes(role);
  const roleName = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Role';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 border border-teal-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {roleName} Workspace
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Verified multi-role credentialed environment</p>
            </div>
          </div>

          <div>
            {isApproved ? (
              <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approved Institutional Role</span>
              </span>
            ) : (
              <span className="badge-pill bg-rose-50 text-rose-700 border border-rose-200">
                Unapproved Access
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 mb-6">
          <div><strong>Designated Member:</strong> {user?.name}</div>
          <div><strong>Affiliation:</strong> {user?.institution} &bull; {user?.department}</div>
        </div>

        <div className="space-y-2 mb-6">
          <h2 className="text-sm font-bold text-slate-900">Role Mandate &amp; Responsibilities</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {roleDescriptions[role] || 'Academic responsibility and institutional guidance workflow.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5 mb-6">
          <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Notice:</strong> Full workflow for this role is part of the larger U-RAIEE architecture. This prototype establishes verified multi-role credentialing, access partitioning, and role switching.
          </span>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <Link to="/roles" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Roles &amp; Access</span>
          </Link>
          <Link to="/dashboard" className="btn-primary">
            Go to Participant Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
