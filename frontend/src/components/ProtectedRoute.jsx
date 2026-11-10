import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from './Spinner.jsx';

export default function ProtectedRoute() {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6">
        <Spinner size="lg" color="terracotta" />
        <p className="mt-4 text-sm font-medium text-latte">Authenticating session...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
