import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Building2, Car, ShieldCheck, 
  CalendarDays, Settings, LogOut, Menu, X, Command
} from 'lucide-react';
import { pageTransition } from '@/lib/motion';

const NAV_LINKS = [
  { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/vendors', label: 'Vendors', icon: Building2 },
  { path: '/admin/vehicles', label: 'Fleet Approvals', icon: ShieldCheck },
  { path: '/admin/bookings', label: 'Global Bookings', icon: CalendarDays },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-[#0F172A] text-white flex items-center justify-center rounded-xl shadow-lg">
          <Command className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-sm font-bold tracking-[0.2em] uppercase text-primary leading-tight">Luxoria</span>
          <span className="block text-[10px] uppercase tracking-widest text-[#0F172A] font-semibold">Enterprise Core</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/admin/dashboard'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#0F172A] text-white shadow-lg' 
                  : 'text-secondary hover:bg-surface hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-border">
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary">{user?.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{user?.name}</p>
              <p className="text-xs text-muted uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-muted hover:bg-error/10 hover:text-error transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 border-r border-border bg-white p-6 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 p-6 flex flex-col border-r border-border lg:hidden shadow-2xl"
            >
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-surface text-primary">
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-secondary">
              <span>Admin Core</span>
              <span className="text-muted">/</span>
              <span className="font-medium text-primary capitalize">{location.pathname.split('/').pop() || 'Overview'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider mr-4">System Nominal</span>
          </div>
        </header>

        {/* Outlet */}
        <div className="p-6 lg:p-10 flex-1 w-full max-w-7xl mx-auto">
          <motion.div {...pageTransition} key={location.pathname}>
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
