import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, LogOut, User as UserIcon,
  LayoutDashboard, Heart, CalendarDays, Car, Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/redux/slices/authSlice';
import Avatar from '@/components/ui/Avatar';
import Dropdown, { DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Collection', path: '/vehicles' },
  { name: 'Experience', path: '/experience' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'vendor' ? '/vendor/dashboard' : '/dashboard';

  const isHeroPage = location.pathname === '/';
  // Keep it glass but give it a bit more structure when scrolled
  const navTransparent = isHeroPage && !isScrolled;

  return (
    <div className="flex justify-center w-full px-4 lg:px-8">
      <header
        className={cn(
          'fixed z-50 transition-all duration-500 ease-out w-full max-w-[1440px] mx-auto',
          'top-6 h-[90px] glass-nav rounded-full shadow-sm border border-white/40 flex items-center px-6 lg:px-10',
          navTransparent ? 'bg-white/70' : 'bg-white/90'
        )}
      >
        <div className="flex items-center justify-between w-full">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group select-none relative hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-[0.15em] uppercase text-primary">
              Luxoria
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'relative text-body-sm font-medium py-2 transition-colors duration-300 group tracking-wide',
                    isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                  )}
                >
                  {link.name}
                  <span className={cn(
                    'absolute left-0 bottom-[-2px] h-[1.5px] w-full origin-left transition-transform duration-300 ease-luxe',
                    isActive ? 'scale-x-100 bg-accent' : 'scale-x-0 group-hover:scale-x-100 bg-primary'
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Right Section ── */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="btn-icon relative text-secondary hover:text-primary hover:bg-surface/50">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
                </button>

                {/* User Dropdown */}
                <Dropdown
                  align="right"
                  trigger={
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors hover:bg-surface/50">
                      <Avatar
                        src={user?.avatar?.url}
                        name={user?.name}
                        size="sm"
                      />
                      <span className="text-body-sm font-medium hidden xl:block text-primary">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 hidden xl:block text-muted" />
                    </div>
                  }
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-body-sm font-semibold text-primary truncate">{user?.name}</p>
                    <p className="text-caption text-muted truncate">{user?.email}</p>
                  </div>
                  <DropdownItem icon={LayoutDashboard} onClick={() => navigate(dashboardPath)}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem icon={CalendarDays} onClick={() => navigate('/bookings')}>
                    My Bookings
                  </DropdownItem>
                  <DropdownItem icon={Heart} onClick={() => navigate('/wishlist')}>
                    Wishlist
                  </DropdownItem>
                  <DropdownItem icon={UserIcon} onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem icon={LogOut} danger onClick={handleLogout}>
                    Sign Out
                  </DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-body-sm font-medium text-secondary hover:text-primary transition-colors tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-body-sm font-medium text-secondary hover:text-primary transition-colors tracking-wide"
                >
                  Become Member
                </Link>
                <Link
                  to="/vehicles"
                  className="btn bg-primary text-white hover:bg-[#222] hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-xl px-6 py-2.5 rounded-full tracking-wide"
                >
                  Book Experience
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="lg:hidden btn-icon text-primary hover:bg-surface/50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 right-0 lg:hidden bg-white/95 backdrop-blur-xl border border-border mt-2 shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'py-3 px-4 rounded-xl text-body font-medium transition-colors',
                      location.pathname === link.path
                        ? 'text-primary bg-surface'
                        : 'text-secondary hover:text-primary hover:bg-surface/50'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="my-2 border-t border-border/50" />

                {isAuthenticated ? (
                  <>
                    <Link to={dashboardPath} className="btn btn-secondary w-full justify-center">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn btn-ghost w-full justify-center text-error">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" className="btn btn-secondary w-full justify-center">
                      Sign In
                    </Link>
                    <Link to="/register" className="btn btn-outline w-full justify-center">
                      Become Member
                    </Link>
                    <Link to="/vehicles" className="btn btn-primary w-full justify-center">
                      Book Experience
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
