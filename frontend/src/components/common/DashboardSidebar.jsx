import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { logout } from '@/redux/slices/authSlice';
import Avatar from '@/components/ui/Avatar';
import {
  LayoutDashboard, Car, CalendarDays, Users, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Bell,
  ShieldCheck, FileText, CreditCard, Star, Package, UserCircle
} from 'lucide-react';

const USER_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Bookings', path: '/bookings', icon: CalendarDays },
  { label: 'Wishlist', path: '/wishlist', icon: Star },
  { label: 'Payments', path: '/payments', icon: CreditCard },
  { label: 'Profile', path: '/profile', icon: Settings },
];

const VENDOR_LINKS = [
  { label: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
  { label: 'My Vehicles', path: '/vendor/vehicles', icon: Car },
  { label: 'Bookings', path: '/vendor/bookings', icon: CalendarDays },
  { label: 'Revenue', path: '/vendor/revenue', icon: BarChart3 },
  { label: 'Profile', path: '/vendor/profile', icon: Settings },
];

const ADMIN_LINKS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Vendors', path: '/admin/vendors', icon: ShieldCheck },
  { label: 'Vehicles', path: '/admin/vehicles', icon: Car },
  { label: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Master Data', path: '/admin/master-data', icon: Package },
  { label: 'My Profile', path: '/admin/settings', icon: UserCircle },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? ADMIN_LINKS :
                user?.role === 'vendor' ? VENDOR_LINKS : USER_LINKS;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-out glass-sidebar',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center h-[72px] px-5 border-b border-border/50 shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-md shrink-0">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center items-start overflow-hidden whitespace-nowrap">
              <span className="text-[20px] font-serif tracking-[0.12em] text-primary leading-none font-bold">LUXORIA</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-accent mt-1">
                {user?.role === 'admin' ? 'Admin Workspace' : user?.role === 'vendor' ? 'Partner Workspace' : 'User Workspace'}
              </span>
            </div>
          </NavLink>
        )}
        {collapsed && <Car className="w-6 h-6 text-accent" />}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('btn-icon btn-icon-sm', collapsed && 'absolute -right-3 bg-white border border-border shadow-sm rounded-full z-50')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-hide">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200 group',
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-secondary hover:text-primary hover:bg-surface',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className={cn('w-[18px] h-[18px] shrink-0')} />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer — User info + Logout */}
      <div className={cn(
        'border-t border-border/50 p-3 shrink-0',
        collapsed && 'flex flex-col items-center'
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer"
               onClick={() => navigate('/profile')}>
            <Avatar src={user?.avatar?.url} name={user?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold text-primary truncate">{user?.name}</p>
              <p className="text-caption text-muted truncate capitalize">
                {user?.role === 'admin' ? 'Admin Workspace' : user?.role === 'vendor' ? 'Partner Workspace' : 'User Workspace'}
              </p>
            </div>
          </div>
        ) : (
          <Avatar src={user?.avatar?.url} name={user?.name} size="sm" className="mb-2" />
        )}

        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-body-sm font-medium text-secondary hover:text-error hover:bg-error/5 transition-colors mt-1',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
