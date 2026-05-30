import React, { useEffect } from 'react';
import { Routes, Route, Outlet as RouterOutlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProfile, setLoading } from '@/redux/slices/authSlice';

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
import RegisterPage from '@/pages/public/RegisterPage';
import VendorSignupPage from '@/pages/public/VendorSignupPage';
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/public/ResetPasswordPage';
import VehicleListPage from '@/pages/vehicles/VehicleListPage';
import VehicleDetailsPage from '@/pages/vehicles/VehicleDetailsPage';
import BookingSuccessPage from '@/pages/vehicles/BookingSuccessPage';
import OAuthCallback from '@/pages/public/OAuthCallback';
import ExperiencePage from '@/pages/public/ExperiencePage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import CollectionPage from '@/pages/public/CollectionPage';

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

import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import UserManagement from '@/pages/admin/UserManagement';
import VendorManagement from '@/pages/admin/VendorManagement';
import VehicleApprovals from '@/pages/admin/VehicleApprovals';
import AdminBookings from '@/pages/admin/AdminBookings';




export default function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile()).unwrap().catch(() => {
      dispatch(setLoading(false));
    });
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Vendor Onboarding */}
        <Route path="/vendor/signup" element={<VendorSignupPage />} />
        
        <Route path="/unauthorized" element={<div className="pt-28 container-luxe section-spacing text-center text-error">Unauthorized Access</div>} />
      </Route>

      {/* Guest Only Routes (Auth UI) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Hidden Auth Callback */}
      <Route path="/auth/callback" element={<OAuthCallback />} />

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
          <Route path="/vendor/revenue" element={<div className="p-10">Revenue Analytics Coming Soon</div>} />
          <Route path="/vendor/profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<RoleRoute allowedRoles={['admin']} />}>
        <Route element={<AdminDashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/vendors" element={<VendorManagement />} />
          <Route path="/admin/vehicles" element={<VehicleApprovals />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/settings" element={<UserProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}
