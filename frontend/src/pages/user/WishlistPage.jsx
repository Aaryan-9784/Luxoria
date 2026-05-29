import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '@/redux/slices/dashboardSlice';
import VehicleCard from '@/components/ui/VehicleCard';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartCrack } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (e, vehicleId) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(toggleWishlist(vehicleId));
  };

  if (loading && wishlist.length === 0) {
    return <div className="animate-pulse">Loading wishlist...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      <div>
        <h1 className="text-h3 text-primary mb-1">Your Wishlist</h1>
        <p className="text-secondary">Saved vehicles for future luxury experiences</p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={HeartCrack}
          title="Your wishlist is empty"
          description="You haven't saved any vehicles yet. Explore our fleet and save your favorites."
          action={{
            label: "Explore Fleet",
            onClick: () => window.location.href = '/vehicles'
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item) => (
              item.vehicle && (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <VehicleCard {...item.vehicle} />
                  
                  {/* Remove Overlay Button */}
                  <button 
                    onClick={(e) => handleRemove(e, item.vehicle._id)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-colors text-white shadow-lg"
                  >
                    <HeartCrack className="w-5 h-5" />
                  </button>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
