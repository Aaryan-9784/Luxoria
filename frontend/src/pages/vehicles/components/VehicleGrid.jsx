import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setSortBy, setViewMode, setFilter, fetchVehicles, clearFilters } from '@/redux/slices/vehicleSlice';
import VehicleCard from '@/components/ui/VehicleCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { LayoutGrid, List, SearchX, X } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function VehicleGrid() {
  const dispatch = useDispatch();
  const { vehicles, loading, filters, sortBy, viewMode, pagination } = useSelector(state => state.vehicle);

  const handleSort = (e) => {
    dispatch(setSortBy(e.target.value));
    dispatch(fetchVehicles());
  };

  const removeFilter = (key) => {
    dispatch(setFilter({ [key]: '' }));
    dispatch(fetchVehicles());
  };

  // Get active filter keys (excluding empty strings)
  const activeFilters = Object.entries(filters).filter(([_, val]) => val !== '');

  return (
    <div className="flex-1 flex flex-col min-h-[600px]">
      
      {/* ── Grid Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-body-sm font-semibold text-primary">
            Showing <span className="text-accent">{pagination.total || 0}</span> extraordinary vehicles
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <select 
            value={sortBy} 
            onChange={handleSort}
            className="bg-surface border border-border text-body-sm text-primary rounded-lg px-3 py-2 outline-none focus:border-accent appearance-none cursor-pointer"
          >
            <option value="-createdAt">Newest Arrivals</option>
            <option value="pricePerDay">Price: Low to High</option>
            <option value="-pricePerDay">Price: High to Low</option>
            <option value="-rating.average">Highest Rated</option>
          </select>

          {/* View Toggles */}
          <div className="flex bg-surface border border-border rounded-lg p-1">
            <button 
              onClick={() => dispatch(setViewMode('grid'))}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted hover:text-primary'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => dispatch(setViewMode('list'))}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted hover:text-primary'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Filters ── */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <AnimatePresence>
            {activeFilters.map(([key, val]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20"
              >
                <span className="text-caption font-medium text-accent capitalize">
                  {key === 'minPrice' ? `Min ₹${val}` : key === 'maxPrice' ? `Max ₹${val}` : val}
                </span>
                <button onClick={() => removeFilter(key)} className="text-accent hover:text-primary transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button 
            onClick={() => { dispatch(clearFilters()); dispatch(fetchVehicles()); }}
            className="text-caption font-medium text-muted hover:text-error transition-colors px-2 py-1.5 underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ── Content Area ── */}
      {loading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="h-[240px] rounded-2xl w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <EmptyState
            icon={SearchX}
            title="No Vehicles Found"
            description="We couldn't find any vehicles matching your exquisite taste. Try adjusting your filters or exploring our full collection."
            action={{
              label: 'Clear Filters',
              onClick: () => { dispatch(clearFilters()); dispatch(fetchVehicles()); }
            }}
          />
        </div>
      ) : (
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          layout
          className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
        >
          <AnimatePresence>
            {vehicles.map((vehicle) => (
              <motion.div 
                key={vehicle.id} 
                variants={staggerItem}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* 
                  Passing viewMode to VehicleCard so it can render horizontally if list mode.
                  We assume VehicleCard supports className or a specific prop for horizontal layout.
                  If not, we just wrap it. 
                */}
                <div className={viewMode === 'list' ? 'flex gap-6 items-center' : ''}>
                  <VehicleCard {...vehicle} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
