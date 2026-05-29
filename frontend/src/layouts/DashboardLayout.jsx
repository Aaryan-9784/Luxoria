import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Car, Heart, CreditCard, 
  Bell, Settings, LogOut, Menu, X, User 
} from 'lucide-react';
import { pageTransition } from '@/lib/motion';

const NAV_LINKS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/bookings', label: 'My Bookings', icon: Car },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/profile', label: 'Profile', icon: Settings },
];

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 mb-10 px-2">
        <Car className="w-8 h-8 text-accent" />
        <span className="text-xl font-bold tracking-[0.2em] uppercase text-primary">Luxoria</span>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/dashboard'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-accent/10 text-accent font-medium shadow-inner' 
                  : 'text-secondary hover:bg-surface hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-muted hover:bg-error/10 hover:text-error transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface flex">
      
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 border-r border-border bg-background p-6 z-40">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
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
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 p-6 flex flex-col border-r border-border lg:hidden"
            >
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-surface text-primary"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-h4 text-primary hidden sm:block tracking-wide">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted hover:text-primary transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-background" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-body-sm font-semibold text-primary">{user?.name}</p>
                <p className="text-caption text-muted capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-accent" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <div className="p-6 lg:p-10 flex-1 w-full max-w-7xl mx-auto">
          <motion.div {...pageTransition} key={location.pathname}>
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
