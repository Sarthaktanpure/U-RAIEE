import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LogOut,
  ArrowRightLeft,
  ShieldCheck,
  Compass,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, sidebarOpen, toggleSidebar } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'expert':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'reviewer':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="flex h-16 items-center justify-between px-3.5 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">
        {/* Left side: Mobile menu toggle + Brand identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 active:scale-95"
              aria-label="Toggle navigation drawer"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 text-slate-900 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-sm shadow-brand-500/30 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">U-RAIEE</span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded">PORTAL</span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 -mt-0.5 font-medium">Unified Innovation &amp; Academic Progression</p>
            </div>
          </Link>
        </div>

        {/* Right side user or public controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {/* Active Role Indicator (desktop & tablet) */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-slate-500">Active Role:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(user.activeRole)}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="capitalize">{user.activeRole}</span>
                </span>
              </div>

              {/* Mobile Active Role badge */}
              <span className={`sm:hidden inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getRoleBadgeStyle(user.activeRole)}`}>
                {user.activeRole}
              </span>

              {/* Roles & Access button */}
              <Link
                to="/roles"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                title="Switch active role or request new roles"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Switch Role</span>
              </Link>

              {/* User profile avatar badge */}
              <div className="flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-3 border-l border-slate-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-semibold text-xs shadow-xs flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left max-w-[160px]">
                  <div className="text-xs font-semibold text-slate-800 leading-tight truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.institution}</div>
                </div>
              </div>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/60 rounded-lg transition-colors active:scale-95"
                title="Sign out of your session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 px-2.5 sm:px-3 py-2 rounded-lg transition-colors"
              >
                <Compass className="w-4 h-4 text-brand-500" />
                <span className="hidden sm:inline">Demo Journey</span>
                <span className="sm:hidden">Demo</span>
              </Link>
              <Link
                to="/auth"
                className="btn-primary text-xs py-1.5 px-3 sm:px-3.5"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
