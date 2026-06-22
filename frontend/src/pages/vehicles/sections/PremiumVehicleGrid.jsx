import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, fetchVehicles, setSortBy, setViewMode, toggleWishlist, setQuickView, addToCompare } from '@/redux/slices/vehicleSlice';
import LuxuryVehicleCard from '../components/LuxuryVehicleCard';
import Skeleton from '@/components/ui/Skeleton';
import { LayoutGrid, List, SearchX, X, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { staggerContainer, revealOnScroll } from '@/lib/motion';
import { SORT_OPTIONS } from '../data/vehiclesPageData';

export default function PremiumVehicleGrid({ onOpenFilters }) {
  const dispatch = useDispatch();
  const { vehicles, loading, error, filters, sortBy, viewMode, pagination, wishlist } = useSelector(state => state.vehicle);

  const handleSort = (e) => {
    dispatch(setSortBy(e.target.value));
    dispatch(fetchVehicles());
  };

  const removeFilter = (key) => {
    dispatch(setFilter({ [key]: '' }));
    dispatch(fetchVehicles());
  };

  const handleShare = async (vehicle) => {
    const url = `${window.location.origin}/vehicles/${vehicle.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${vehicle.brand} ${vehicle.name}`, text: `Check out this luxury ${vehicle.brand} ${vehicle.name} on Luxoria!`, url });
      } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  // Active filters
  const activeFilters = Object.entries(filters).filter(([_, val]) => val !== '');

  return (
    <motion.section {...revealOnScroll} id="vehicle-collection" className="scroll-mt-8">
      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-h3 text-primary mb-1">Vehicle Collection</h3>
          <p className="text-body-sm text-secondary">
            Showing <span className="font-bold text-accent">{pagination.total || 0}</span> extraordinary vehicles
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filters Button (Desktop) */}
          <button
            onClick={onOpenFilters}
            className="hidden lg:flex items-center gap-2 bg-surface border border-border text-primary hover:border-primary px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sort — visible on desktop, hidden on mobile (handled by filter panel) */}
          <div className="hidden lg:block">
            <select
              value={sortBy}
              onChange={handleSort}
              className="bg-surface border border-border text-sm text-primary rounded-xl px-3 py-2.5 outline-none focus:border-accent appearance-none cursor-pointer font-medium min-w-[180px]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* View Toggles */}
          <div className="flex bg-surface border border-border rounded-xl p-1">
            <button
              onClick={() => dispatch(setViewMode('grid'))}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-background shadow-sm text-primary'
                  : 'text-muted hover:text-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setViewMode('list'))}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-background shadow-sm text-primary'
                  : 'text-muted hover:text-primary'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <AnimatePresence>
            {activeFilters.map(([key, val]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15"
              >
                <span className="text-[11px] font-semibold text-accent capitalize">
                  {key === 'minPrice' ? `Min ₹${val}` : key === 'maxPrice' ? `Max ₹${val}` : val}
                </span>
                <button onClick={() => removeFilter(key)} className="text-accent/60 hover:text-accent transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => { dispatch(clearFilters()); dispatch(fetchVehicles()); }}
            className="text-[11px] font-semibold text-muted hover:text-error transition-colors px-2 py-1.5 underline underline-offset-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        /* Skeleton Loading */
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl overflow-hidden border border-border/30">
              <Skeleton className="aspect-[4/3] rounded-none w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-7 h-7 text-error" />
          </div>
          <h3 className="text-h4 text-primary mb-2">Something went wrong</h3>
          <p className="text-body-sm text-secondary max-w-sm mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchVehicles())}
            className="btn btn-primary rounded-full px-6"
          >
            Try Again
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-surface flex items-center justify-center mb-6 shadow-inner">
            <SearchX className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-h4 text-primary mb-2">No Vehicles Found</h3>
          <p className="text-body-sm text-secondary max-w-md mb-6">
            We couldn't find any vehicles matching your exquisite taste. Try adjusting your filters or exploring our full collection.
          </p>
          <button
            onClick={() => { dispatch(clearFilters()); dispatch(fetchVehicles()); }}
            className="btn btn-accent rounded-full px-6"
          >
            Clear Filters & Explore
          </button>
        </div>
      ) : (
        /* Vehicle Grid */
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          layout
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-4xl'
          }`}
        >
          <AnimatePresence>
            {vehicles.map((vehicle) => (
              <LuxuryVehicleCard
                key={vehicle.id || vehicle._id}
                vehicle={{
                  ...vehicle,
                  id: vehicle.id || vehicle._id,
                  topSpeed: vehicle.topSpeed || '—',
                  horsepower: vehicle.horsepower || '—',
                  isAvailable: vehicle.isAvailable !== undefined ? vehicle.isAvailable : true,
                }}
                isWishlisted={wishlist.includes(vehicle.id || vehicle._id)}
                onWishlist={(id) => dispatch(toggleWishlist(id))}
                onQuickView={(v) => dispatch(setQuickView(v))}
                onCompare={(v) => dispatch(addToCompare(v))}
                onShare={handleShare}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  );
}
