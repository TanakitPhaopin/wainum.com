import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user.user_metadata?.role;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/redirect" replace />;
  }

  return children;
}
