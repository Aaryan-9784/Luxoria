import React, { useEffect } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading } from '@/redux/slices/authSlice';
import api from '@/services/api';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import GuestRoute from './GuestRoute';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import Navbar from '@/components/common/Navbar';
import DashboardLayout from '@/layouts/DashboardLayout';

// Public Pages
const HomePage = React.lazy(() => import('@/pages/public/HomePage'));
const LoginPage = React.lazy(() => import('@/pages/public/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/public/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/public/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('@/pages/public/ResetPasswordPage'));
const OAuthCallback = React.lazy(() => import('@/pages/public/OAuthCallback'));
const VehicleListPage = React.lazy(() => import('@/pages/vehicles/VehicleListPage'));
const VehicleDetailsPage = React.lazy(() => import('@/pages/vehicles/VehicleDetailsPage'));
const BookingSuccessPage = React.lazy(() => import('@/pages/vehicles/BookingSuccessPage'));

const ExperiencePage = React.lazy(() => import('@/pages/public/ExperiencePage'));
const AboutPage = React.lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = React.lazy(() => import('@/pages/public/ContactPage'));
const CollectionPage = React.lazy(() => import('@/pages/public/CollectionPage'));
const WatchExperiencePage = React.lazy(() => import('@/pages/public/WatchExperiencePage'));

const DashboardOverview = React.lazy(() => import('@/pages/user/DashboardOverview'));
const MyBookings = React.lazy(() => import('@/pages/user/MyBookings'));
const WishlistPage = React.lazy(() => import('@/pages/user/WishlistPage'));
const PaymentsDashboard = React.lazy(() => import('@/pages/user/PaymentsDashboard'));
const UserProfile = React.lazy(() => import('@/pages/user/UserProfile'));
const NotificationsPage = React.lazy(() => import('@/pages/user/NotificationsPage'));
const UserReviews = React.lazy(() => import('@/pages/user/UserReviews'));

const UserInvoices = React.lazy(() => import('@/pages/user/UserInvoices'));
const UserMessages = React.lazy(() => import('@/pages/user/UserMessages'));
const UserSupport = React.lazy(() => import('@/pages/user/UserSupport'));
import VendorDashboardLayout from '@/layouts/VendorDashboardLayout';
const VendorOverview = React.lazy(() => import('@/pages/vendor/VendorOverview'));
const ManageFleet = React.lazy(() => import('@/pages/vendor/ManageFleet'));
const AddVehicleWizard = React.lazy(() => import('@/pages/vendor/AddVehicleWizard'));
const EditVehicleWizard = React.lazy(() => import('@/pages/vendor/EditVehicleWizard'));
const VendorBookings = React.lazy(() => import('@/pages/vendor/VendorBookings'));
const VendorRevenue = React.lazy(() => import('@/pages/vendor/VendorRevenue'));
const VendorSupport = React.lazy(() => import('@/pages/vendor/VendorSupport'));
const VendorAnalytics = React.lazy(() => import('@/pages/vendor/VendorAnalytics'));
const VendorAvailability = React.lazy(() => import('@/pages/vendor/VendorAvailability'));

import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
const AdminLoginPage = React.lazy(() => import('@/pages/admin/AdminLoginPage'));
const VendorLoginPage = React.lazy(() => import('@/pages/vendor/VendorLoginPage'));
const AdminOverview = React.lazy(() => import('@/pages/admin/AdminOverview'));
const UserManagement = React.lazy(() => import('@/pages/admin/UserManagement'));
const VendorManagement = React.lazy(() => import('@/pages/admin/VendorManagement'));
const AdminConcierge = React.lazy(() => import('@/pages/admin/AdminConcierge'));
const AdminBookings = React.lazy(() => import('@/pages/admin/AdminBookings'));
const AdminAnalytics = React.lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminCollections = React.lazy(() => import('@/pages/admin/AdminCollections'));
const AdminFleetApprovals = React.lazy(() => import('@/pages/admin/AdminFleetApprovals'));




export default function AppRoutes() {
  const dispatch = useDispatch();

  const hasRestored = React.useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const restoreSession = async () => {
      try {
        // Try to refresh the access token from the refresh cookie
        // Use api instance (respects Vite proxy, avoids CORS issues in dev)
        const refreshRes = await api.post('/auth/refresh');

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
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div>}>
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
          
          {/* Vendor Onboarding Removed */}
          
          <Route path="/unauthorized" element={<div className="pt-28 container-luxe section-spacing text-center text-error">Unauthorized Access</div>} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
        </Route>

        {/* Watch page — Navbar only, no Footer */}
        <Route element={<div className="min-h-screen bg-background flex flex-col relative overflow-hidden"><Navbar /><main className="flex-grow"><Outlet /></main></div>}>
          <Route path="/watch" element={<WatchExperiencePage />} />
        </Route>

        {/* Guest Only Routes (Auth UI) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/vendor/login" element={<VendorLoginPage />} />
        </Route>



        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/reviews" element={<UserReviews />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/payments" element={<PaymentsDashboard />} />
            <Route path="/invoices" element={<UserInvoices />} />
            <Route path="/messages" element={<UserMessages />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/support" element={<UserSupport />} />
          </Route>
        </Route>

        {/* Vendor Routes */}
        <Route element={<RoleRoute allowedRoles={['vendor', 'admin']} />}>
          <Route element={<VendorDashboardLayout />}>
            <Route path="/vendor/dashboard" element={<VendorOverview />} />
            <Route path="/vendor/vehicles" element={<ManageFleet />} />
            <Route path="/vendor/add-vehicle" element={<AddVehicleWizard />} />
            <Route path="/vendor/edit-vehicle/:id" element={<EditVehicleWizard />} />
            <Route path="/vendor/bookings" element={<VendorBookings />} />
            <Route path="/vendor/availability" element={<VendorAvailability />} />
            <Route path="/vendor/revenue" element={<VendorRevenue />} />
            <Route path="/vendor/support" element={<VendorSupport />} />
            <Route path="/vendor/analytics" element={<VendorAnalytics />} />
            <Route path="/vendor/notifications" element={<NotificationsPage />} />
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
            <Route path="/admin/concierge" element={<AdminConcierge />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/collections" element={<AdminCollections />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<UserProfile />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            <Route path="/admin/profile" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
    </React.Suspense>
  );
}
