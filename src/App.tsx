import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
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
    </AuthProvider>
  );
}

export default App;