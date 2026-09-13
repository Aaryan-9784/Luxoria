import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut, Home } from 'lucide-react';
import { logout } from '@/redux/slices/authSlice';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const attemptedPath = location.state?.from?.pathname;

  const roleTitle = user?.role === 'admin'
    ? 'Administrator'
    : user?.role === 'vendor'
      ? 'Vendor Partner'
      : 'Private Client';

  const dashboardPath = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'vendor'
      ? '/vendor/dashboard'
      : '/dashboard';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 max-w-lg w-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl text-center"
      >
        {/* Shield Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-inner">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-4">
          Access Restricted
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mb-3">
          Restricted Clearance
        </h1>

        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
          Your current account is authenticated as a{' '}
          <span className="font-semibold text-white underline decoration-[#D4AF37] underline-offset-4">
            {roleTitle}
          </span>
          . You do not have security authorization to access{' '}
          {attemptedPath ? (
            <code className="px-2 py-0.5 rounded bg-white/10 text-[#D4AF37] text-xs font-mono">
              {attemptedPath}
            </code>
          ) : (
            'this workspace'
          )}
          .
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate(dashboardPath, { replace: true })}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C6A035] text-black font-semibold tracking-wider text-sm transition-all shadow-lg hover:shadow-[#D4AF37]/25 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to My {roleTitle} Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold tracking-wider text-sm transition-all shadow-lg cursor-pointer"
            >
              Sign In with Authorized Account
            </button>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-gray-300 hover:text-white text-xs font-medium tracking-wide transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Homepage
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 text-xs font-medium tracking-wide transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Account
            </button>
          </div>
        </div>

        {/* Brand signature */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-[11px] uppercase tracking-[0.2em] text-gray-500 font-serif">
          LUXORIA · Sovereign Fleet Security
        </div>
      </motion.div>
    </div>
  );
}
