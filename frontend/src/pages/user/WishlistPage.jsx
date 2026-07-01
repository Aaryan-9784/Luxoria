import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '@/redux/slices/dashboardSlice';
import VehicleCard from '@/components/ui/VehicleCard';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartCrack, Search, SortDesc, Compass, Trash2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector(state => state.dashboard);
  const { accessToken } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, price-asc, price-desc

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchWishlist());
  }, [dispatch, accessToken]);

  const handleRemove = async (e, vehicleId) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(toggleWishlist(vehicleId));
  };

  const processedWishlist = useMemo(() => {
    let result = wishlist.filter(item => item.vehicle !== null);
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.vehicle.name?.toLowerCase().includes(term) || 
        item.vehicle.brand?.toLowerCase().includes(term)
      );
    }

    switch(sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.vehicle.pricePerDay || 0) - (b.vehicle.pricePerDay || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.vehicle.pricePerDay || 0) - (a.vehicle.pricePerDay || 0));
        break;
      case 'recent':
      default:
        // Assuming original order is newest first or we have a createdAt field
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [wishlist, searchTerm, sortBy]);

  const totalValue = processedWishlist.reduce((sum, item) => sum + (item.vehicle?.pricePerDay || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Saved Vehicles</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Your curated collection of {wishlist.length} luxury experiences.</p>
        </div>
        
        {wishlist.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input 
                type="text" 
                placeholder="Search collection..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:border-[#C9A75D] transition-colors shadow-sm"
              />
            </div>

            {/* Sort */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-white border border-[#ECECEC] rounded-xl pl-4 pr-10 py-2.5 text-[13px] text-[#0F0F0F] focus:outline-none focus:border-[#C9A75D] transition-colors appearance-none cursor-pointer shadow-sm"
              >
                <option value="recent">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <SortDesc className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Collection Stats Bar */}
      {wishlist.length > 0 && (
        <div className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#C9A75D]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Total Saved</p>
              <p className="text-[16px] font-bold text-[#0F0F0F]">{processedWishlist.length} Vehicles</p>
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#ECECEC]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Avg. Daily Value</p>
            <p className="text-[16px] font-bold text-[#0F0F0F]">${processedWishlist.length ? Math.round(totalValue / processedWishlist.length).toLocaleString() : 0} / day</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-[#ECECEC] border-dashed rounded-2xl shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <HeartCrack className="w-10 h-10 text-[#C9A75D] opacity-60" />
          </div>
          <h2 className="text-2xl font-serif text-[#0F0F0F] mb-3">Your collection is empty</h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            You haven't saved any vehicles yet. Explore our exclusive fleet of luxury, sports, and exotic cars to start building your dream garage.
          </p>
          <Link to="/vehicles" className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] hover:shadow-lg transition-all">
            <Compass className="w-4 h-4" /> Discover Fleet
          </Link>
        </div>
      ) : processedWishlist.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center bg-white border border-[#ECECEC] rounded-2xl shadow-sm">
          <Search className="w-10 h-10 text-[#ECECEC] mb-4" />
          <p className="text-[13px] font-medium text-[#666666]">No vehicles found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {processedWishlist.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <VehicleCard {...item.vehicle} />
                
                {/* Luxury Remove Overlay Button */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => handleRemove(e, item.vehicle._id)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-md border border-[#ECECEC] rounded-full flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all shadow-lg transform hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
