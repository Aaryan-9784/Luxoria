import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronDown, LogOut, User as UserIcon,
  LayoutDashboard, Heart, CalendarDays, Car, Bell, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/redux/slices/authSlice';
import Avatar from '@/components/ui/Avatar';
import Dropdown, { DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';
import { preloadAuthImages } from '@/lib/preloadAuthImages';
import { useWishlist } from '@/hooks/useWishlist';
import NotificationBell from '@/components/ui/NotificationBell';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Collection', path: '/collection' },
  { name: 'Experience', path: '/experience' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // Local render-trigger so we re-render when WishlistDropdown marks seen
  const [, forceUpdate] = useState(0);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { wishlist, wishlistCount, wishlistPath, isUnseen, markSeen, handleRemove: handleRemoveWishlist } = useWishlist();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Re-render when WishlistDropdown (dashboard) marks seen
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener('wishlist-seen', handler);
    return () => window.removeEventListener('wishlist-seen', handler);
  }, []);

  const handleWishlistOpen = () => markSeen();

  const handleViewFullWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    markSeen();
    navigate(wishlistPath);
  };

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
    <div className="flex justify-center w-full px-2 lg:px-8">
      <header
        className={cn(
          'fixed z-50 transition-all duration-500 ease-out w-[calc(100%-16px)] lg:w-full max-w-[1440px] mx-auto',
          'top-4 lg:top-6 h-[90px] rounded-[50px] shadow-sm flex items-center px-4 lg:px-10',
          'bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
          navTransparent ? 'bg-white/70' : 'bg-white/90'
        )}
      >
        <div className="flex items-center justify-between w-full gap-4 lg:gap-8">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group select-none relative hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[22px] font-bold tracking-[0.12em] uppercase text-primary font-serif leading-none">
                LUXORIA
              </span>
              {isAuthenticated && user?.role && (
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent mt-1">
                  {user.role === 'admin' ? 'Admin Workspace' : user.role === 'vendor' ? 'Partner Workspace' : 'Client Workspace'}
                </span>
              )}
            </div>
          </Link>

          {/* ── Center Nav ── */}
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'relative text-[15px] font-medium py-2 transition-colors duration-300 group tracking-wider',
                    isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                  )}
                >
                  {link.name}
                  <span className={cn(
                    'absolute left-0 bottom-[-4px] h-[2px] w-full origin-left transition-transform duration-300 ease-luxe',
                    isActive ? 'scale-x-100 bg-[#D4AF37]' : 'scale-x-0 group-hover:scale-x-100 bg-[#D4AF37]/50'
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* ── Right Section ── */}
          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Wishlist Dropdown — shown for all authenticated roles */}
                {(user?.role === 'user' || user?.role === 'vendor' || user?.role === 'admin') && (
                <Dropdown
                  align="right"
                  className="w-[320px] p-0"
                  onOpen={handleWishlistOpen}
                  trigger={
                    <button className="btn-icon relative text-secondary hover:text-error transition-colors hover:bg-surface/50 group">
                      <Heart className="w-5 h-5 group-hover:fill-error/20" />
                      {isUnseen && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full border-2 border-white shadow-sm" />
                      )}
                    </button>
                  }
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-semibold text-primary">My Wishlist</h3>
                    <span className="text-caption bg-surface px-2 py-0.5 rounded-full font-medium text-secondary">
                      {wishlistCount} Items
                    </span>
                  </div>
                  <div className="max-h-[340px] overflow-y-auto">
                    {wishlistCount > 0 ? (
                      wishlist.filter(item => item.vehicle).slice(0, 5).map((item) => {
                        const v = item.vehicle;
                        const vehicleId = v._id || v.id;
                        const name = v.name || `${v.brand || ''} ${v.model || ''}`.trim();
                        const imageUrl = v.images?.[0]?.url || v.images?.[0] || v.image || null;
                        return (
                          <div
                            key={vehicleId}
                            className="px-4 py-3 hover:bg-surface/50 cursor-pointer border-b border-border/50 transition-colors flex items-center gap-4"
                            onClick={() => navigate(`/vehicles/${vehicleId}`)}
                          >
                            <div className="w-12 h-10 rounded-lg bg-surface flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {imageUrl ? (
                                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                              ) : (
                                <Car className="w-5 h-5 text-muted" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-semibold text-primary truncate">{name}</p>
                              <p className="text-caption text-muted">${v.pricePerDay?.toLocaleString() || v.price?.toLocaleString() || '—'} / day</p>
                            </div>
                            <button
                              className="text-secondary hover:text-error transition-colors p-1 shrink-0"
                              onClick={(e) => handleRemoveWishlist(e, vehicleId)}
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Heart className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-secondary">Your wishlist is empty</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-border bg-surface/30">
                    <Link
                      to={wishlistPath}
                      onClick={handleViewFullWishlist}
                      className="block w-full text-center text-body-sm font-medium text-primary hover:text-accent py-1.5 transition-colors"
                    >
                      View full wishlist
                    </Link>
                  </div>
                </Dropdown>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                {/* User Profile Button */}
                <div 
                  onClick={() => navigate(dashboardPath)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors hover:bg-surface/50 group"
                >
                  <Avatar
                    src={user?.avatar?.url}
                    name={user?.name}
                    size="sm"
                    variant="luxury"
                    showOnline
                  />
                  <div className="hidden xl:flex flex-col items-center">
                    <span className="text-body-sm font-medium text-primary group-hover:text-accent transition-colors leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-medium text-secondary mt-0.5 uppercase tracking-wider">
                      {user?.role === 'admin' ? 'Admin' : user?.role === 'vendor' ? 'Partner' : 'Client'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  to="/login"
                  className="text-[15px] font-medium text-secondary hover:text-primary transition-colors tracking-wide hover:-translate-y-0.5 duration-300"
                  onMouseEnter={preloadAuthImages}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-[15px] font-medium text-secondary hover:text-primary transition-colors tracking-wide hover:-translate-y-0.5 duration-300"
                  onMouseEnter={preloadAuthImages}
                >
                  Become Member
                </Link>
                <Link
                  to="/vehicles"
                  className="btn bg-black text-white hover:bg-black transition-all duration-300 shadow-md hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 px-7 py-3 rounded-full tracking-wide font-semibold ml-2 group relative overflow-hidden"
                >
                  <span className="relative z-10">Book Experience</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
