import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { fetchNotifications } from '@/redux/slices/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Building2, Car, ShieldCheck, 
  CalendarDays, Settings, LogOut, Menu, X, Command,
  ChevronLeft, ChevronRight, CreditCard, BarChart3, User, Bell, Globe, Headset
} from 'lucide-react';
import { pageTransition } from '@/lib/motion';
import CalendarDropdown from '@/components/common/CalendarDropdown';
import NotificationBell from '@/components/ui/NotificationBell';

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/vendors', label: 'Vendors', icon: Building2 },
    ]
  },
  {
    label: 'Operations',
    items: [
      { path: '/admin/fleet-approvals', label: 'Fleet Approvals', icon: ShieldCheck },
      { path: '/admin/bookings', label: 'Global Bookings', icon: CalendarDays },
      { path: '/admin/collections', label: 'Collections', icon: CreditCard },
      { path: '/admin/concierge', label: 'VIP Concierge', icon: Headset },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ]
  },
  {
    label: 'System',
    items: [
      { path: '/admin/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export default function AdminDashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getActivePageName = () => {
    for (const group of NAV_GROUPS) {
      const activeItem = group.items.find(item => item.path === location.pathname);
      if (activeItem) return activeItem.label;
    }
    if (location.pathname === '/admin/profile') return 'My Profile';
    return 'Dashboard';
  };

  const activePageName = getActivePageName();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderSidebarContent = (collapsed = false, showToggle = false) => (
    <>
      <Link to="/" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4'} h-[80px] mb-4 shrink-0 px-4 group hover:opacity-80 transition-opacity`} title="Return to Landing Page">
        <div className="flex items-center justify-center shrink-0">
          <img src="/favicon.svg" alt="Luxoria Symbol" className="w-10 h-10 drop-shadow-sm rounded-full" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col justify-center items-center overflow-hidden whitespace-nowrap">
            <span className="text-[22px] font-serif tracking-[0.12em] text-[#000000] leading-none font-bold" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>LUXORIA</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A75D] mt-1">Admin Workspace</span>
          </motion.div>
        )}
      </Link>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col">
        {NAV_GROUPS.map((group, idx) => (
          <div key={group.label} className={`flex flex-col gap-2.5 ${idx !== NAV_GROUPS.length - 1 ? 'mb-6' : 'mb-2'}`}>
            {!collapsed && (
              <span className="px-8 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">
                {group.label}
              </span>
            )}
            <div className="flex flex-col gap-2.5">
              {group.items.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center ${collapsed ? 'justify-center w-[48px] mx-auto' : 'gap-3 mx-4 px-4'} h-[48px] rounded-xl transition-all duration-300 ease-out group ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] text-white shadow-lg shadow-black/10' 
                        : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#0F0F0F] hover:translate-x-1'
                    }`
                  }
                  title={collapsed ? link.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C9A75D] rounded-r-md shadow-[0_0_8px_rgba(201,167,93,0.6)]" />
                      )}
                      {isActive && collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#C9A75D] rounded-r-md" />
                      )}
                      <link.icon className={`w-[20px] h-[20px] shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-[#C9A75D]' : 'group-hover:scale-110'}`} />
                      {!collapsed && (
                        <span className="font-semibold text-[13.5px] whitespace-nowrap">{link.label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto shrink-0 px-4 py-3 flex flex-col gap-2 pt-4">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className={`flex items-center justify-center gap-2 w-full h-[36px] rounded-lg text-[#5A1122] hover:bg-[#F3F4F6] transition-all duration-300 group ${collapsed ? 'px-0 mx-auto w-10' : 'px-3'}`}
          title={collapsed ? "Terminate Session" : undefined}
        >
          <LogOut className="w-[16px] h-[16px] shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span className="text-[11px] font-bold uppercase tracking-widest">Logout</span>}
        </button>
        
        {showToggle && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full pt-2 mt-1 text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] transition-all rounded-b-xl"
          >
            <div className="p-1 transition-transform group-hover:scale-110">
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </div>
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] flex">
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#08152E]/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-[#E5E7EB]"
            >
              <div className="w-14 h-14 rounded-full bg-[#5A1122]/10 flex items-center justify-center mb-5 mx-auto">
                <LogOut className="w-7 h-7 text-[#5A1122]" />
              </div>
              <h3 className="text-xl font-bold text-[#08152E] text-center mb-2">Terminate Session?</h3>
              <p className="text-[13px] text-[#4B5563] text-center mb-8 leading-relaxed">
                You are about to log out of the Luxoria Enterprise Core. Any unsaved changes may be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#4B5563] font-bold text-[13px] hover:bg-[#F3F4F6] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#5A1122] to-[#7A172E] text-white font-bold text-[13px] hover:shadow-lg hover:shadow-[#5A1122]/30 transition-all"
                >
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-[#E5E7EB] bg-white z-40 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-[88px]' : 'w-[280px]'}`}
      >
        {renderSidebarContent(isCollapsed, true)}
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
              className="fixed inset-0 bg-[#08152E]/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 flex flex-col border-r border-[#E5E7EB] lg:hidden shadow-2xl"
            >
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-4 p-1.5 rounded-full bg-[#F3F4F6] text-[#08152E] hover:bg-[#E5E7EB] transition-colors z-50">
                <X className="w-4 h-4" />
              </button>
              {renderSidebarContent(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
        
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] px-6 lg:px-10 h-16 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg text-[#0F0F0F] hover:bg-[#F5F5F5]">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-[11px] font-bold text-[#666666] tracking-[0.15em] uppercase">Admin Core</span>
              <span className="text-[#ECECEC] text-lg font-light leading-none mb-0.5">/</span>
              <span className="text-[13px] font-bold text-[#C9A75D] tracking-wider uppercase">{activePageName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6 relative">
            
            <CalendarDropdown />
            <NotificationBell />

            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-[#ECECEC] shadow-sm hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-[#C9A75D]/30"
              title="Profile menu"
            >
              <div className="relative shrink-0 w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-[#C9A75D] to-[#E8D090]">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-[#0F0F0F]">
                  {user?.avatar?.url && !avatarError ? (
                    <img 
                      src={user.avatar.url} 
                      alt="Admin" 
                      className="w-full h-full object-cover" 
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs font-bold text-[#C9A75D]">{user?.name?.charAt(0) || 'A'}</span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] border-2 border-white rounded-full"></div>
              </div>
              
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-bold text-[#0F0F0F] leading-tight group-hover:text-[#C9A75D] transition-colors">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-[#666666] uppercase tracking-[0.1em] font-bold mt-0.5">CEO & Founder</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-[#ECECEC] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-[#ECECEC] bg-[#F5F5F5]/50">
                      <p className="text-sm font-bold text-[#0F0F0F] truncate">{user?.name || 'Administrator'}</p>
                      <p className="text-xs text-[#666666] truncate">{user?.email || 'admin@luxoria.com'}</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <button 
                        onClick={() => { setShowProfileMenu(false); navigate('/admin/profile'); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] transition-colors w-full text-left"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </button>
                      <div className="h-px w-full bg-[#ECECEC] my-1"></div>
                      <button 
                        onClick={() => { setShowProfileMenu(false); setShowLogoutConfirm(true); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-[#5A1122] hover:bg-[#5A1122]/10 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
