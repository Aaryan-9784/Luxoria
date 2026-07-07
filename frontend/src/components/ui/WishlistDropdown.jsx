import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Car } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistDropdown() {
  const navigate = useNavigate();
  const { wishlist, wishlistCount, wishlistPath, isUnseen, markSeen, handleRemove } = useWishlist();

  const [open, setOpen] = useState(false);
  // Local render-trigger so we re-render when another component marks seen
  const [, forceUpdate] = useState(0);
  const ref = useRef(null);

  // Re-render when Navbar or another WishlistDropdown marks seen
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener('wishlist-seen', handler);
    return () => window.removeEventListener('wishlist-seen', handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    markSeen();
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    setOpen(false);
    navigate(wishlistPath);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="relative p-2 rounded-full text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] transition-all group"
        title="My Wishlist"
      >
        <Heart className="w-5 h-5 group-hover:fill-[#DC2626]/10 transition-all" />
        {/* Unseen red dot only */}
        {isUnseen && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full border-2 border-white shadow-sm" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 w-[300px] bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#ECECEC]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C9A75D] fill-[#C9A75D]" />
                <h3 className="text-[13px] font-bold text-[#0F0F0F]">Saved Vehicles</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#F5F5F5] text-[#666666] px-2 py-0.5 rounded-full uppercase tracking-wide">
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* List */}
            <div className="max-h-[280px] overflow-y-auto">
              {wishlistCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Heart className="w-8 h-8 text-[#ECECEC]" />
                  <p className="text-[12px] font-medium text-[#9CA3AF]">Your wishlist is empty</p>
                </div>
              ) : (
                wishlist
                  .filter((item) => item.vehicle)
                  .slice(0, 5)
                  .map((item) => {
                    const v = item.vehicle;
                    const vehicleId = v._id || v.id;
                    const name = v.name || `${v.brand || ''} ${v.model || ''}`.trim();
                    const imageUrl = v.images?.[0]?.url || v.images?.[0] || null;
                    return (
                      <div
                        key={vehicleId}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] cursor-pointer border-b border-[#F5F5F5] transition-colors group/item"
                        onClick={() => { setOpen(false); navigate(`/vehicles/${vehicleId}`); }}
                      >
                        <div className="w-11 h-10 rounded-lg border border-[#ECECEC] overflow-hidden shrink-0 bg-[#F5F5F5] flex items-center justify-center">
                          {imageUrl ? (
                            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <Car className="w-4 h-4 text-[#D0D0D0]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#0F0F0F] truncate">{name}</p>
                          <p className="text-[11px] text-[#9CA3AF]">
                            ${v.pricePerDay?.toLocaleString() || '—'} / day
                          </p>
                        </div>
                        <button
                          className="shrink-0 p-1 text-[#CCCCCC] hover:text-[#DC2626] transition-colors opacity-0 group-hover/item:opacity-100"
                          onClick={(e) => handleRemove(e, vehicleId)}
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Footer */}
            {wishlistCount > 0 && (
              <div className="p-3 border-t border-[#ECECEC] bg-[#FAFAFA]">
                <button
                  onClick={handleViewAll}
                  className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0F0F0F] hover:text-[#C9A75D] transition-colors text-center"
                >
                  View Full Wishlist →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
