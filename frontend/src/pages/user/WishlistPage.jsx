import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '@/redux/slices/dashboardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, HeartOff, Search, SortDesc, Compass, Trash2,
  ArrowRight, Star, X, AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CustomSelect from '@/components/ui/CustomSelect';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useSelector(state => state.dashboard);
  const { accessToken } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [removingId, setRemovingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // vehicle._id to confirm remove

  useEffect(() => {
    if (!accessToken) return;
    // Only fetch from API — the slice will merge with local mock items automatically
    dispatch(fetchWishlist());
  }, [dispatch, accessToken]);

  const handleRemove = async (vehicleId) => {
    setRemovingId(vehicleId);
    await dispatch(removeFromWishlist(vehicleId));
    setRemovingId(null);
    setConfirmId(null);
  };

  const processedWishlist = useMemo(() => {
    // Include items that have a vehicle object OR a vehicleId (local mock items)
    let result = wishlist.filter(item => item.vehicle || item.vehicleId);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.vehicle?.name?.toLowerCase().includes(term) ||
        item.vehicle?.brand?.toLowerCase().includes(term) ||
        item.vehicle?.category?.toLowerCase().includes(term)
      );
    }
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => (a.vehicle?.pricePerDay || 0) - (b.vehicle?.pricePerDay || 0));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => (b.vehicle?.pricePerDay || 0) - (a.vehicle?.pricePerDay || 0));
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return result;
  }, [wishlist, searchTerm, sortBy]);

  const totalValue = processedWishlist.reduce((sum, item) => sum + (item.vehicle?.pricePerDay || 0), 0);
  const avgValue = processedWishlist.length ? Math.round(totalValue / processedWishlist.length) : 0;

  // Loading skeleton
  if (loading && wishlist.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-[#F0F0F0] rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-[#F0F0F0] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl bg-[#F5F5F5] animate-pulse aspect-[3/4]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Saved Vehicles
          </h1>
          <p className="text-[#666666] text-sm font-medium tracking-wide">
            Your curated collection of {wishlist.filter(w => w.vehicle || w.vehicleId).length} luxury experience{wishlist.filter(w => w.vehicle || w.vehicleId).length !== 1 ? 's' : ''}.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors shadow-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#DC2626]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="w-full sm:w-52">
              <CustomSelect
                value={sortBy}
                onChange={setSortBy}
                icon={SortDesc}
                options={[
                  { value: 'recent', label: 'Recently Added' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {wishlist.filter(w => w.vehicle || w.vehicleId).length > 0 && (
        <div className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-[#C9A75D] fill-[#C9A75D]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Total Saved</p>
              <p className="text-[16px] font-bold text-[#0F0F0F]">{processedWishlist.length} Vehicles</p>
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#ECECEC]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Avg. Daily Rate</p>
            <p className="text-[16px] font-bold text-[#0F0F0F]">${avgValue.toLocaleString()} / day</p>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#ECECEC]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Combined Value</p>
            <p className="text-[16px] font-bold text-[#0F0F0F]">${totalValue.toLocaleString()} / day</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {wishlist.filter(w => w.vehicle || w.vehicleId).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-dashed border-[#ECECEC] rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <HeartOff className="w-9 h-9 text-[#C9A75D] opacity-60" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F0F0F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Your collection is empty
          </h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            You haven't saved any vehicles yet. Explore our exclusive fleet of luxury, sports, and exotic cars to start building your dream garage.
          </p>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] hover:shadow-lg transition-all"
          >
            <Compass className="w-4 h-4" /> Discover Fleet
          </Link>
        </div>
      ) : processedWishlist.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <Search className="w-10 h-10 text-[#ECECEC] mb-4" />
          <p className="text-[13px] font-medium text-[#666666]">No vehicles match your search.</p>
          <button onClick={() => setSearchTerm('')} className="mt-3 text-[12px] font-bold text-[#C9A75D] hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {processedWishlist.map((item) => {
              const v = item.vehicle;
              const vehicleId = v?._id || v?.id || item.vehicleId;
              // Support both images array (backend) and single image string (mock data)
              const imageUrl = v?.images?.[0]?.url || v?.images?.[0] || v?.image || null;
              const isRemoving = removingId === vehicleId;
              const displayRating = typeof v?.rating === 'object' ? v?.rating?.average : v?.rating;
              return (
                <motion.div
                  key={item._id || vehicleId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isRemoving ? 0.4 : 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-[2rem] overflow-hidden bg-[#0F0F0F] shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Vehicle Image */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={v?.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                        <Compass className="w-12 h-12 text-[#333333]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                    {/* Remove button — top right */}
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setConfirmId(vehicleId)}
                        disabled={isRemoving}
                        className="w-10 h-10 bg-white/90 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all shadow-lg hover:scale-110 disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {isRemoving ? (
                          <div className="w-4 h-4 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Rating badge — top left */}
                    {displayRating > 0 && (
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                        <Star className="w-3 h-3 text-[#C9A75D] fill-[#C9A75D]" />
                        <span className="text-[11px] font-bold text-white">
                          {typeof displayRating === 'number' ? displayRating.toFixed(1) : displayRating}
                        </span>
                      </div>
                    )}

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <span className="text-[#C9A75D] text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">{v?.brand}</span>
                      <h3 className="text-[20px] font-bold text-white leading-tight mb-3">{v?.name}</h3>

                      <div className="w-full h-px bg-white/10 mb-4" />

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[9px] text-white/50 uppercase tracking-widest block mb-0.5">Starting from</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[20px] font-bold text-white">${v?.pricePerDay?.toLocaleString()}</span>
                            <span className="text-[12px] text-white/50">/day</span>
                          </div>
                        </div>

                        {/* Book Now arrow */}
                        <button
                          onClick={() => navigate(`/vehicles/${vehicleId}`)}
                          className="w-12 h-12 rounded-full bg-[#C9A75D] flex items-center justify-center hover:bg-[#b8963e] hover:scale-110 transition-all shadow-[0_0_20px_rgba(201,167,93,0.4)] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
                          title="View & Book"
                        >
                          <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm Remove Modal */}
      <AnimatePresence>
        {confirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08152E]/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-[#ECECEC] rounded-2xl w-full max-w-sm p-8 shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-5 mx-auto">
                <AlertTriangle className="w-7 h-7 text-[#DC2626]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0F0F0F] text-center mb-2">Remove from Wishlist?</h3>
              <p className="text-[13px] text-[#666666] text-center mb-7 leading-relaxed">
                This vehicle will be removed from your saved collection. You can always add it back later.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmId(null)}
                  className="flex-1 py-3 rounded-xl border border-[#ECECEC] text-[#4B5563] font-bold text-[13px] hover:bg-[#F3F4F6] transition-colors"
                >
                  KEEP IT
                </button>
                <button
                  onClick={() => handleRemove(confirmId)}
                  disabled={!!removingId}
                  className="flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-bold text-[13px] hover:shadow-lg hover:shadow-[#DC2626]/30 transition-all disabled:opacity-60"
                >
                  {removingId ? 'Removing...' : 'REMOVE'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
