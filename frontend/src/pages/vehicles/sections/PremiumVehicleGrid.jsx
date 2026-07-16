import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, fetchVehicles, setSortBy, setViewMode, setQuickView, addToCompare } from '@/redux/slices/vehicleSlice';
import { toggleWishlist, fetchWishlist } from '@/redux/slices/dashboardSlice';
import LuxuryVehicleCard from '../components/LuxuryVehicleCard';
import Skeleton from '@/components/ui/Skeleton';
import CustomSelect from '@/components/ui/CustomSelect';
import { LayoutGrid, List, SearchX, X, AlertCircle } from 'lucide-react';
import { staggerContainer, staggerItem, revealOnScroll } from '@/lib/motion';
import { SORT_OPTIONS, FEATURED_VEHICLES } from '../data/vehiclesPageData';

export default function PremiumVehicleGrid() {
  const dispatch = useDispatch();
  const { vehicles, loading, error, filters, sortBy, viewMode, pagination, featuredVehicles } = useSelector(state => state.vehicle);
  const { wishlist: dashboardWishlist } = useSelector(state => state.dashboard);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Build a Set of wishlisted vehicle IDs for O(1) lookup
  const wishlistedIds = React.useMemo(() => {
    return new Set(
      dashboardWishlist
        .map(w => w.vehicle?._id || w.vehicle?.id || w.vehicleId)
        .filter(Boolean)
    );
  }, [dashboardWishlist]);

  // Load wishlist from API when user is authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleWishlistToggle = (vehicleId) => {
    if (!isAuthenticated) {
      return;
    }
    // Find the full vehicle object
    const vehicleObj = vehicles.find(v => (v.id || v._id) === vehicleId) || 
                       featuredVehicles.find(v => (v.id || v._id) === vehicleId);
    
    dispatch(toggleWishlist({ vehicleId, vehicle: vehicleObj })).then((result) => {
      // After adding real backend vehicles, refetch to get the populated data
      if (toggleWishlist.fulfilled.match(result) && 
          result.payload.action === 'added' && 
          !result.payload.mock) {
        dispatch(fetchWishlist());
      }
    });
  };

  const handleSort = (value) => {
    dispatch(setSortBy(value));
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
            Showing <span className="font-bold text-accent">{pagination.total || vehicles.length || 0}</span> extraordinary vehicles
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort — visible on desktop, hidden on mobile (handled by filter panel) */}
          <div className="hidden lg:block min-w-[220px]">
            <CustomSelect
              value={sortBy}
              onChange={handleSort}
              options={SORT_OPTIONS}
              placeholder="Sort vehicles"
              className="min-w-[220px]"
            />
          </div>

          {/* View Toggles */}
          <div className="flex bg-surface border border-border rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => dispatch(setViewMode('grid'))}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted hover:text-primary hover:bg-background'
              }`}
            >
              <LayoutGrid className="w-4.5 h-4.5" />
            </button>
            <button
              type="button"
              onClick={() => dispatch(setViewMode('list'))}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted hover:text-primary hover:bg-background'
              }`}
            >
              <List className="w-4.5 h-4.5" />
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
                  {key === 'minPrice' ? `Min $${val}` : key === 'maxPrice' ? `Max $${val}` : val}
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
        /* Fallback to featured vehicles if backend has no results and no active filters */
        activeFilters.length === 0 ? (
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            layout
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative"
          >
            <AnimatePresence>
              {(featuredVehicles.length > 0 ? featuredVehicles : FEATURED_VEHICLES).slice(0, 6).map((vehicle) => (
                <motion.div
                  key={vehicle.id || vehicle._id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className={viewMode === 'list' ? 'flex gap-6 items-center' : ''}>
                    <LuxuryVehicleCard
                      vehicle={vehicle}
                      isWishlisted={wishlistedIds.has(vehicle.id || vehicle._id)}
                      onWishlist={isAuthenticated ? handleWishlistToggle : undefined}
                      onQuickView={(v) => dispatch(setQuickView(v))}
                      onCompare={(v) => dispatch(addToCompare(v))}
                      onShare={handleShare}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
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
        )
      ) : (
        /* Vehicle Grid */
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          layout
          className={`grid gap-6 relative ${
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
                  engine: vehicle.engine || '—',
                  isAvailable: vehicle.isAvailable !== undefined ? vehicle.isAvailable : true,
                }}
                isWishlisted={wishlistedIds.has(vehicle.id || vehicle._id)}
                onWishlist={isAuthenticated ? handleWishlistToggle : undefined}
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
