import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Car, PlusCircle, CalendarDays, 
  LineChart, Bell, Settings, LogOut, Menu, X, Building 
} from 'lucide-react';
import { pageTransition } from '@/lib/motion';

const NAV_LINKS = [
  { path: '/vendor/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/vendor/vehicles', label: 'My Fleet', icon: Car },
  { path: '/vendor/add-vehicle', label: 'Add Vehicle', icon: PlusCircle },
  { path: '/vendor/bookings', label: 'Bookings', icon: CalendarDays },
  { path: '/vendor/revenue', label: 'Revenue', icon: LineChart },
  { path: '/vendor/profile', label: 'Profile', icon: Settings },
];

export default function VendorDashboardLayout() {
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
        <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-xl shadow-lg">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-sm font-bold tracking-[0.2em] uppercase text-primary leading-tight">Luxoria</span>
          <span className="block text-[10px] uppercase tracking-widest text-accent font-semibold">Partner Panel</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/vendor/dashboard'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-secondary hover:bg-surface hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-accent' : 'group-hover:scale-110'}`} />
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
    <div className="min-h-screen bg-[#F8F9FA] flex">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 border-r border-border bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] p-6 z-40">
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
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-h4 text-primary hidden sm:block tracking-wide">
              {user?.name}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted hover:text-primary transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-white" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="w-10 h-10 rounded-full bg-primary/5 border border-border flex items-center justify-center overflow-hidden">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>
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
