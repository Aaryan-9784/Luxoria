import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVehicles, clearFilters } from '@/redux/slices/vehicleSlice';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { pageTransition } from '@/lib/motion';

import SearchHeroBanner from './components/SearchHeroBanner';
import FilterSidebar from './components/FilterSidebar';
import VehicleGrid from './components/VehicleGrid';
import VehiclePagination from './components/VehiclePagination';

export default function VehicleListPage() {
  const dispatch = useDispatch();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Initial fetch on mount
    dispatch(fetchVehicles());
    
    // Cleanup filters on unmount
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-background">
      {/* 1. Hero Search Section */}
      <SearchHeroBanner />

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-[72px] z-40 bg-background/80 backdrop-blur-md border-b border-border py-3 px-6 flex justify-between items-center shadow-sm">
        <span className="text-body-sm font-semibold text-primary uppercase tracking-widest">Filter & Sort</span>
        <button 
          onClick={() => setMobileFilterOpen(true)}
          className="btn btn-outline btn-sm rounded-lg"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Main Content Area */}
      <div className="container-luxe py-12 flex gap-8 lg:gap-12 relative items-start">
        {/* 2. Sidebar Filters */}
        <FilterSidebar mobileOpen={mobileFilterOpen} setMobileOpen={setMobileFilterOpen} />

        {/* 3. Grid & Pagination */}
        <div className="flex-1 min-w-0">
          <VehicleGrid />
          <VehiclePagination />
        </div>
      </div>
    </motion.div>
  );
}
