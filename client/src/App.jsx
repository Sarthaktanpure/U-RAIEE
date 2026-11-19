import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import MyRoles from './pages/MyRoles';
import Dashboard from './pages/Dashboard';
import NewSubmission from './pages/NewSubmission';
import MySubmissions from './pages/MySubmissions';
import SubmissionDetail from './pages/SubmissionDetail';
import Recommendations from './pages/Recommendations';
import Passport from './pages/Passport';
import Merit from './pages/Merit';
import ExpertDashboard from './pages/ExpertDashboard';
import ExpertEvaluate from './pages/ExpertEvaluate';
import ReviewerDashboard from './pages/ReviewerDashboard';
import ReviewerDecide from './pages/ReviewerDecide';
import AdminPanel from './pages/AdminPanel';
import RoleWorkspace from './pages/RoleWorkspace';

// Layout with persistent top-bar and role-filtered sidebar
function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full min-w-0">
        <Sidebar />
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-screen-2xl mx-auto w-full">
          <Routes>
            {/* General authenticated participant routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roles" element={<MyRoles />} />
            <Route path="/submissions" element={<MySubmissions />} />
            <Route path="/submissions/new" element={<NewSubmission />} />
            <Route path="/submissions/:id" element={<SubmissionDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/merit" element={<Merit />} />

            {/* Expert routes */}
            <Route path="/expert" element={<ExpertDashboard />} />
            <Route path="/expert/evaluate/:id" element={<ExpertEvaluate />} />

            {/* Reviewer routes */}
            <Route path="/reviewer" element={<ReviewerDashboard />} />
            <Route path="/reviewer/decide/:id" element={<ReviewerDecide />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminPanel />} />

            {/* Other approved role workspaces */}
            <Route path="/workspace/:role" element={<RoleWorkspace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Home & Demo Journey */}
          <Route path="/" element={
            <div className="min-h-screen bg-slate-50 flex flex-col">
              <Navbar />
              <Home />
            </div>
          } />
          <Route path="/demo" element={
            <div className="min-h-screen bg-slate-50 flex flex-col">
              <Navbar />
              <Home />
            </div>
          } />

          {/* Authentication Page */}
          <Route path="/auth" element={
            <div className="min-h-screen bg-slate-50 flex flex-col">
              <Navbar />
              <Auth />
            </div>
          } />

          {/* Authenticated Application routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
