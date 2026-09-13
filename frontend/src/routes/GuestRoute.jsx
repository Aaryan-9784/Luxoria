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
    const attemptedPath = location.state?.from?.pathname;

    let targetPath = defaultPath;
    if (attemptedPath && attemptedPath !== '/' && attemptedPath !== '/login' && attemptedPath !== '/register' && attemptedPath !== '/unauthorized') {
      const isAdminRestricted = attemptedPath.startsWith('/admin') && role !== 'admin';
      const isVendorRestricted = attemptedPath.startsWith('/vendor') && role !== 'vendor' && role !== 'admin';
      if (!isAdminRestricted && !isVendorRestricted) {
        targetPath = attemptedPath;
      }
    }

    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
}
