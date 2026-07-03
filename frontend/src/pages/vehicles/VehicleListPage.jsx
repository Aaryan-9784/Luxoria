import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVehicles, fetchFeaturedVehicles, clearFilters } from '@/redux/slices/vehicleSlice';
import { motion, useScroll, useSpring } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

// Sections
import CinematicHero from './sections/CinematicHero';
import SmartSearch from './sections/SmartSearch';
import EliteBrandShowcase from './sections/EliteBrandShowcase';
import AdvancedFilterPanel from './sections/AdvancedFilterPanel';
import FeaturedShowcase from './sections/FeaturedShowcase';
import PremiumVehicleGrid from './sections/PremiumVehicleGrid';
import VehiclePaginationNew from './sections/VehiclePaginationNew';
import CollectionsShowcase from './sections/CollectionsShowcase';
import BookingProcess from './sections/BookingProcess';
import LuxuryCTA from './sections/LuxuryCTA';

// Overlays
import QuickViewModal from './sections/QuickViewModal';
import CompareVehicles from './sections/CompareVehicles';

export default function VehicleListPage() {
  const dispatch = useDispatch();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Scroll Progress — track the window, not a container div
  const { scrollYProgress } = useScroll({ layoutEffect: false });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchFeaturedVehicles());
    
    // Attempt to scroll to top on mount
    window.scrollTo(0, 0);

    return () => {
      // Don't auto clear filters on unmount so they persist when returning from details page
      // dispatch(clearFilters()); 
    };
  }, [dispatch]);

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-background pb-0 relative" style={{ position: 'relative' }}>
      {/* Top scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* 1. Hero Area */}
      <CinematicHero />

      {/* 2. Smart Search (Floats over hero) */}
      <SmartSearch />



      {/* Main Content Area Container */}
      <div className="bg-surface/30 border-t border-border/50 pb-20">

        <div className="container-luxe py-12 lg:py-16">
          <div className="flex flex-row relative items-start w-full">
            {/* 4. Filter Panel (renders its own desktop sidebar + mobile drawer) */}
            <AdvancedFilterPanel mobileOpen={mobileFilterOpen} setMobileOpen={setMobileFilterOpen} />

            {/* Main Grid Area */}
            <div className="flex-1 min-w-0 flex flex-col w-full">
              {/* 5. Grid */}
              <PremiumVehicleGrid />
              
              {/* 6. Pagination */}
              <VehiclePaginationNew />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Featured Vehicles */}
      <FeaturedShowcase />

      {/* 8. Collections */}
      <CollectionsShowcase />

      {/* 12. Booking Process */}
      <BookingProcess />

      {/* 13. Call to Action Banner */}
      <LuxuryCTA />

      {/* Overlays / Modals */}
      <QuickViewModal />
      <CompareVehicles />
    </motion.div>
  );
}
