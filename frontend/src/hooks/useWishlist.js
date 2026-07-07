import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '@/redux/slices/dashboardSlice';

const WISHLIST_SEEN_KEY = 'luxoria_wishlist_seen_count';

/**
 * Shared wishlist hook — single source of truth for count, seen state,
 * and role-aware navigation path. Use this in both Navbar and WishlistDropdown
 * so they stay in sync.
 */
export function useWishlist() {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.dashboard);
  const { accessToken, user } = useSelector((state) => state.auth);

  // Fetch once when authenticated
  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchWishlist());
  }, [dispatch, accessToken]);

  const wishlistCount = wishlist?.filter((w) => w.vehicle)?.length || 0;

  // Role-aware wishlist page path
  const wishlistPath =
    user?.role === 'admin' ? '/admin/wishlist' :
    user?.role === 'vendor' ? '/vendor/wishlist' :
    '/wishlist';

  // ── Seen state backed by localStorage so all components stay in sync ──────
  // We use a derived value: seen = stored count >= current count
  const getSeenCount = () => {
    try {
      const v = parseInt(localStorage.getItem(WISHLIST_SEEN_KEY), 10);
      return Number.isNaN(v) ? -1 : v;
    } catch {
      return -1;
    }
  };

  const isUnseen = wishlistCount > 0 && getSeenCount() < wishlistCount;

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(WISHLIST_SEEN_KEY, String(wishlistCount));
      // Dispatch a storage event so other tabs/components pick it up
      window.dispatchEvent(new Event('wishlist-seen'));
    } catch {}
  }, [wishlistCount]);

  const handleRemove = useCallback(async (e, vehicleId) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(removeFromWishlist(vehicleId));
  }, [dispatch]);

  return {
    wishlist,
    wishlistCount,
    wishlistPath,
    isUnseen,
    markSeen,
    handleRemove,
  };
}
