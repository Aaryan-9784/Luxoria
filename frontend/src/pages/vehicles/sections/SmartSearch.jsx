import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, fetchVehicles } from '@/redux/slices/vehicleSlice';
import { Search, MapPin, Car, Layers } from 'lucide-react';
import { EASE_LUXE, revealOnScroll } from '@/lib/motion';
import { FILTER_OPTIONS } from '../data/vehiclesPageData';

export default function SmartSearch() {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.vehicle.filters);

  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [localCity, setLocalCity] = useState(filters.city || '');
  const [localBrand, setLocalBrand] = useState(filters.brand || '');
  const [localCategory, setLocalCategory] = useState(filters.category || '');
  const [isFocused, setIsFocused] = useState(false);

  // Debounce and dispatch
  useEffect(() => {
    const timer = setTimeout(() => {
      const changed =
        filters.search !== localSearch ||
        filters.city !== localCity ||
        filters.brand !== localBrand ||
        filters.category !== localCategory;

      if (changed) {
        dispatch(setFilter({
          search: localSearch,
          city: localCity,
          brand: localBrand,
          category: localCategory,
        }));
        dispatch(fetchVehicles());
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, localCity, localBrand, localCategory, dispatch]);

  const scrollToResults = () => {
    const el = document.getElementById('vehicle-collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section
      {...revealOnScroll}
      id="smart-search"
      className="relative z-20 -mt-12 md:-mt-16 px-4 md:px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Floating Search Bar */}
        <motion.div
          className={`glass-card-elevated p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] transition-all duration-500 ${
            isFocused ? 'shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_40px_rgba(201,167,93,0.08)]' : 'shadow-float'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto] gap-3 md:gap-0 items-center">
            {/* Vehicle Search */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 bg-surface/60 md:bg-transparent rounded-xl md:rounded-none">
              <Search className="w-4.5 h-4.5 text-muted shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-[0.15em] text-muted font-semibold block mb-0.5 hidden md:block">Vehicle</label>
                <input
                  type="text"
                  placeholder="Search by name or model..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent outline-none text-primary placeholder:text-muted text-sm font-medium"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-border/60 mx-2" />

            {/* Brand */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 bg-surface/60 md:bg-transparent rounded-xl md:rounded-none">
              <Car className="w-4.5 h-4.5 text-muted shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-[0.15em] text-muted font-semibold block mb-0.5 hidden md:block">Brand</label>
                <select
                  value={localBrand}
                  onChange={(e) => setLocalBrand(e.target.value)}
                  className="w-full bg-transparent outline-none text-primary text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="">All Brands</option>
                  {FILTER_OPTIONS.brand.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-border/60 mx-2" />

            {/* Location */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 bg-surface/60 md:bg-transparent rounded-xl md:rounded-none">
              <MapPin className="w-4.5 h-4.5 text-muted shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-[0.15em] text-muted font-semibold block mb-0.5 hidden md:block">Location</label>
                <input
                  type="text"
                  placeholder="City or region..."
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent outline-none text-primary placeholder:text-muted text-sm font-medium"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-border/60 mx-2" />

            {/* Category */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 bg-surface/60 md:bg-transparent rounded-xl md:rounded-none">
              <Layers className="w-4.5 h-4.5 text-muted shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-[0.15em] text-muted font-semibold block mb-0.5 hidden md:block">Category</label>
                <select
                  value={localCategory}
                  onChange={(e) => setLocalCategory(e.target.value)}
                  className="w-full bg-transparent outline-none text-primary text-sm font-medium appearance-none cursor-pointer capitalize"
                >
                  <option value="">All Categories</option>
                  {FILTER_OPTIONS.category.map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="md:pl-3">
              <button
                onClick={scrollToResults}
                className="w-full md:w-auto btn btn-primary btn-lg rounded-xl md:rounded-full px-8 shadow-lg hover:shadow-xl"
              >
                <Search className="w-4 h-4" />
                <span className="md:hidden">Search</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
