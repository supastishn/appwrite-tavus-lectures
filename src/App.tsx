import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { UserProvider, useAppwriteUser } from './contexts/UserContext';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

function AppInner() {
  const { user, loading } = useAppwriteUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Allow logged-in users to see LandingPage */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      {/* Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function Root() {
  return (
    <UserProvider>
      <AppInner />
    </UserProvider>
  );
}
