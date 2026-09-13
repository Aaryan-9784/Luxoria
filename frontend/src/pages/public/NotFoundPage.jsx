import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Compass, Home, LayoutDashboard } from 'lucide-react';

export default function NotFoundPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dashboardPath = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'vendor'
      ? '/vendor/dashboard'
      : '/dashboard';

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 max-w-lg w-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl text-center"
      >
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6 shadow-inner">
          <Compass className="w-10 h-10 text-[#D4AF37]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Error 404
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mb-3">
          Route Not Found
        </h1>

        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
          The sanctuary or destination you are seeking cannot be located in the LUXORIA portfolio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-sm tracking-wider transition-all shadow-lg hover:shadow-[#D4AF37]/25"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>

          {isAuthenticated && (
            <Link
              to={dashboardPath}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-gray-200 hover:text-white font-medium text-sm tracking-wider transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              My Workspace
            </Link>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.06] text-[11px] uppercase tracking-[0.2em] text-gray-500 font-serif">
          LUXORIA · Sovereign Fleet
        </div>
      </motion.div>
    </div>
  );
}
