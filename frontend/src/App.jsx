import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts & Auth
import MainLayout from './layouts/MainLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Authenticated Platform Pages
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ExplorerPage from './pages/ExplorerPage';
import SkillGapPage from './pages/SkillGapPage';
import CoursesPage from './pages/CoursesPage';
import RoadmapPage from './pages/RoadmapPage';
import JobsPage from './pages/JobsPage';
import MySkillsPage from './pages/MySkillsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Marketing & Auth */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Student Portal */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/explorer" element={<ExplorerPage />} />
        <Route path="/skills" element={<SkillGapPage />} />
        <Route path="/my-skills" element={<MySkillsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/algorithms" element={<Navigate to="/roadmap" replace />} />
        <Route path="/insights" element={<Navigate to="/roadmap" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}