import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyReportCreate from './pages/DailyReportCreate';
import WorkTime from './pages/WorkTime';
import NextDaySettings from './pages/NextDaySettings';
import PreviousDayReport from './pages/PreviousDayReport';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UserManual from './pages/UserManual';
import UpdateInfo from './pages/UpdateInfo';
import Requirements from './pages/Requirements';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/daily-report-create" replace /> : <Login />} />
        <Route path="/" element={<Navigate to="/daily-report-create" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/daily-report-create" element={
          <ProtectedRoute>
            <DailyReportCreate />
          </ProtectedRoute>
        } />
        <Route path="/work-hours" element={
          <ProtectedRoute>
            <WorkTime />
          </ProtectedRoute>
        } />
        <Route path="/next-day-settings" element={
          <ProtectedRoute>
            <NextDaySettings />
          </ProtectedRoute>
        } />
        <Route path="/previous-day-report" element={
          <ProtectedRoute>
            <PreviousDayReport />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/user-manual" element={<UserManual />} />
        <Route path="/update-info" element={<UpdateInfo />} />
        <Route path="/requirements" element={<Requirements />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;