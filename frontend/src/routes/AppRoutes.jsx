import React, { useEffect } from 'react';
import { Routes, Route, Outlet as RouterOutlet, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading } from '@/redux/slices/authSlice';
import axios from 'axios';
import api from '@/services/api';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import GuestRoute from './GuestRoute';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import LoginPage from '@/pages/public/LoginPage';
import VendorLoginPage from '@/pages/vendor/VendorLoginPage';
import RegisterPage from '@/pages/public/RegisterPage';
import VendorSignupPage from '@/pages/public/VendorSignupPage';
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/public/ResetPasswordPage';
import OAuthCallback from '@/pages/public/OAuthCallback';
import VehicleListPage from '@/pages/vehicles/VehicleListPage';
import VehicleDetailsPage from '@/pages/vehicles/VehicleDetailsPage';
import BookingSuccessPage from '@/pages/vehicles/BookingSuccessPage';

import ExperiencePage from '@/pages/public/ExperiencePage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import CollectionPage from '@/pages/public/CollectionPage';
import WatchExperiencePage from '@/pages/public/WatchExperiencePage';

import DashboardOverview from '@/pages/user/DashboardOverview';
import MyBookings from '@/pages/user/MyBookings';
import WishlistPage from '@/pages/user/WishlistPage';
import PaymentsDashboard from '@/pages/user/PaymentsDashboard';
import UserProfile from '@/pages/user/UserProfile';
import NotificationsPage from '@/pages/user/NotificationsPage';

import VendorDashboardLayout from '@/layouts/VendorDashboardLayout';
import VendorOverview from '@/pages/vendor/VendorOverview';
import ManageFleet from '@/pages/vendor/ManageFleet';
import AddVehicleWizard from '@/pages/vendor/AddVehicleWizard';
import VendorBookings from '@/pages/vendor/VendorBookings';
import VendorRevenue from '@/pages/vendor/VendorRevenue';

import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import UserManagement from '@/pages/admin/UserManagement';
import VendorManagement from '@/pages/admin/VendorManagement';
import VehicleApprovals from '@/pages/admin/VehicleApprovals';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminCollections from '@/pages/admin/AdminCollections';
import AdminFleetApprovals from '@/pages/admin/AdminFleetApprovals';




export default function AppRoutes() {
  const dispatch = useDispatch();

  const hasRestored = React.useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const restoreSession = async () => {
      try {
        // Try to refresh the access token from the refresh cookie
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const accessToken = refreshRes.data.data.accessToken;

        // Now fetch the profile with the new access token
        const profileRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        dispatch(setCredentials({
          user: profileRes.data.data.user,
          accessToken,
        }));
      } catch {
        // No valid session — user needs to log in
        dispatch(setLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);


  return (
    <Routes>
      {/* Public Routes with Navbar/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/vehicles" element={<VehicleListPage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/watch" element={<WatchExperiencePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Vendor Onboarding */}
        <Route path="/vendor/signup" element={<VendorSignupPage />} />
        
        <Route path="/unauthorized" element={<div className="pt-28 container-luxe section-spacing text-center text-error">Unauthorized Access</div>} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
      </Route>

      {/* Guest Only Routes (Auth UI) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/vendor/login" element={<VendorLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>



      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/payments" element={<PaymentsDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* Vendor Routes */}
      <Route element={<RoleRoute allowedRoles={['vendor', 'admin']} />}>
        <Route element={<VendorDashboardLayout />}>
          <Route path="/vendor/dashboard" element={<VendorOverview />} />
          <Route path="/vendor/vehicles" element={<ManageFleet />} />
          <Route path="/vendor/add-vehicle" element={<AddVehicleWizard />} />
          <Route path="/vendor/bookings" element={<VendorBookings />} />
          <Route path="/vendor/revenue" element={<VendorRevenue />} />
          <Route path="/vendor/profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<RoleRoute allowedRoles={['admin']} />}>
        <Route element={<AdminDashboardLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/vendors" element={<VendorManagement />} />
          <Route path="/admin/fleet-approvals" element={<AdminFleetApprovals />} />
          <Route path="/admin/vehicles" element={<VehicleApprovals />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/collections" element={<AdminCollections />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<UserProfile />} />
          <Route path="/admin/profile" element={<UserProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}
