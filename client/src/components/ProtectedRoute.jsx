import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Restricts routes to authenticated users and optionally required roles
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.activeRole)) {
    return (
      <div className="card" style={{ margin: '30px' }}>
        <h3>Access Restricted</h3>
        <p>This workspace requires the <strong>{allowedRoles.join(' or ')}</strong> role.</p>
        <p>Your current active role is <strong>{user.activeRole}</strong>.</p>
        <a href="/roles" className="btn btn-secondary">Switch Role</a>
      </div>
    );
  }

  return <Outlet />;
}
