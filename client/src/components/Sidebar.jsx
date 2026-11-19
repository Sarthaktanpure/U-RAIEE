import React, { useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Compass,
  Award,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  ShieldAlert,
  Briefcase,
  KeyRound,
  X,
  GraduationCap,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';

function NavigationList({ role, onNavigate }) {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 min-h-[42px] ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs border-l-2 border-brand-600'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  return (
    <div className="space-y-6">
      {/* Core participant navigation */}
      <div>
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Participant Journey
        </div>
        <nav className="space-y-1">
          <NavLink to="/dashboard" onClick={onNavigate} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/submissions" onClick={onNavigate} className={navLinkClass}>
            <FolderKanban className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>My Submissions</span>
          </NavLink>

          <NavLink to="/submissions/new" onClick={onNavigate} className={navLinkClass}>
            <PlusCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>New Submission</span>
          </NavLink>

          <NavLink to="/recommendations" onClick={onNavigate} className={navLinkClass}>
            <Compass className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>Recommendations</span>
          </NavLink>

          <NavLink to="/passport" onClick={onNavigate} className={navLinkClass}>
            <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>Academic Passport</span>
          </NavLink>

          <NavLink to="/merit" onClick={onNavigate} className={navLinkClass}>
            <Award className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>Merit &amp; Recognition</span>
          </NavLink>
        </nav>
      </div>

      {/* Specialized Active Role Workspace */}
      {(role === 'expert' || role === 'reviewer' || role === 'admin' || ['mentor', 'jury', 'editor', 'coordinator'].includes(role)) && (
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Role Workspace
          </div>
          <nav className="space-y-1">
            {role === 'expert' && (
              <NavLink to="/expert" onClick={onNavigate} className={navLinkClass}>
                <ClipboardCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Expert Review Queue</span>
              </NavLink>
            )}

            {role === 'reviewer' && (
              <NavLink to="/reviewer" onClick={onNavigate} className={navLinkClass}>
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Reviewer Progression</span>
              </NavLink>
            )}

            {role === 'admin' && (
              <NavLink to="/admin" onClick={onNavigate} className={navLinkClass}>
                <ShieldAlert className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Admin Panel</span>
              </NavLink>
            )}

            {['mentor', 'jury', 'editor', 'coordinator'].includes(role) && (
              <NavLink to={`/workspace/${role}`} onClick={onNavigate} className={navLinkClass}>
                <Briefcase className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="capitalize">{role} Workspace</span>
              </NavLink>
            )}
          </nav>
        </div>
      )}

      {/* Roles & Credentialing */}
      <div>
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Access &amp; Roles
        </div>
        <nav className="space-y-1">
          <NavLink to="/roles" onClick={onNavigate} className={navLinkClass}>
            <KeyRound className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>My Roles &amp; Access</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { user, sidebarOpen, closeSidebar } = useAuth();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  if (!user) return null;

  const role = user.activeRole;

  return (
    <>
      {/* 1. Desktop & Smartboard Docked Sidebar (Screen >= lg: 1024px) */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-slate-200/80 bg-white/70 min-h-[calc(100vh-4rem)] p-4 flex-col justify-between">
        <NavigationList role={role} />

        <div className="pt-4 border-t border-slate-100 px-3">
          <div className="text-[11px] font-medium text-slate-500">
            U-RAIEE Institutional Engine
          </div>
          <div className="text-[10px] text-slate-400">
            Continuous Progression v1.0
          </div>
        </div>
      </aside>

      {/* 2. Mobile & Tablet Slide-in Drawer (Screen < lg) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-slate-900">U-RAIEE Navigation</span>
                    <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand-600" />
                      <span>Role: <strong>{role}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeSidebar}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Quick Role Switcher */}
              <div className="mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="text-xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Active Role</div>
                  <div className="font-semibold text-slate-900 capitalize">{role}</div>
                </div>
                <Link
                  to="/roles"
                  onClick={closeSidebar}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Switch</span>
                </Link>
              </div>

              {/* Drawer Links */}
              <NavigationList role={role} onNavigate={closeSidebar} />
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-slate-100 mt-6">
              <div className="text-xs font-semibold text-slate-800 truncate">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
              <div className="text-[10px] text-slate-400 mt-2">
                Unified Innovation &amp; Academic Progression Portal
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
