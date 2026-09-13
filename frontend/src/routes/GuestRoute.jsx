import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GuestRoute() {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const role = user.role;
    const defaultPath = role === 'admin' ? '/admin/dashboard' : role === 'vendor' ? '/vendor/dashboard' : '/dashboard';
    const targetPath = location.state?.from?.pathname !== '/' && location.state?.from?.pathname ? location.state.from.pathname : defaultPath;
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
}
