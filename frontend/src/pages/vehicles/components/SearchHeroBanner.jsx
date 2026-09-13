import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, fetchVehicles } from '@/redux/slices/vehicleSlice';
import { MapPin, Calendar, Search } from 'lucide-react';
import { EASE_LUXE } from '@/lib/motion';

export default function SearchHeroBanner() {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.vehicle.filters);
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [localCity, setLocalCity] = useState(filters.city || '');

  // Debounce search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== localSearch || filters.city !== localCity) {
        dispatch(setFilter({ search: localSearch, city: localCity }));
        dispatch(fetchVehicles());
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, localCity, dispatch, filters.search, filters.city]);

  return (
    <div className="relative pt-32 pb-20 px-6 lg:px-12 xl:px-20 overflow-hidden bg-primary">
      {/* Background Image */}
      <motion.img
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'linear' }}
        src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=2560"
        alt="Luxury fleet"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="text-display text-white leading-[1.1] mb-6"
        >
          Find Your Perfect <br className="hidden md:block" />
          <span className="text-gradient-gold">Luxury Drive</span>
        </motion.h1>

        {/* Floating Search Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXE }}
          className="w-full max-w-4xl glass-card-elevated p-3 md:p-4 rounded-2xl md:rounded-full mt-8 flex flex-col md:flex-row gap-3"
        >
          {/* Global Text Search */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-surface rounded-xl md:rounded-full border border-border/50 focus-within:border-accent transition-colors">
            <Search className="w-5 h-5 text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-primary placeholder:text-muted text-body-sm font-medium"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-border/60 self-center" />

          {/* City Location */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-surface rounded-xl md:rounded-full border border-border/50 focus-within:border-accent transition-colors">
            <MapPin className="w-5 h-5 text-muted shrink-0" />
            <input
              type="text"
              placeholder="Select City"
              value={localCity}
              onChange={(e) => setLocalCity(e.target.value)}
              className="w-full bg-transparent outline-none text-primary placeholder:text-muted text-body-sm font-medium"
            />
          </div>

          <button 
            onClick={() => dispatch(fetchVehicles())}
            className="btn btn-primary btn-lg w-full md:w-auto rounded-xl md:rounded-full shadow-lg"
          >
            Search
          </button>
        </motion.div>
      </div>
    </div>
  );
}
