import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, fetchVehicles } from '@/redux/slices/vehicleSlice';
import { Search, MapPin, Car, Layers, ChevronDown } from 'lucide-react';
import { EASE_LUXE, revealOnScroll } from '@/lib/motion';
import { FILTER_OPTIONS } from '../data/vehiclesPageData';

const LuxurySelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full cursor-pointer h-full"
      >
        <span className={value ? "text-primary font-semibold text-sm capitalize" : "text-primary text-sm font-medium"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-[-20px] md:left-0 mt-4 w-[240px] bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden z-50 p-2"
          >
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
              <button
                onClick={() => { onChange(''); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${!value ? 'bg-accent/10 text-accent font-bold' : 'text-primary hover:bg-surface hover:text-accent font-medium'}`}
              >
                {placeholder}
              </button>
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm capitalize transition-all ${value === opt ? 'bg-accent/10 text-accent font-bold' : 'text-primary hover:bg-surface hover:text-accent font-medium'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
                <LuxurySelect
                  value={localBrand}
                  onChange={setLocalBrand}
                  options={FILTER_OPTIONS.brand}
                  placeholder="All Brands"
                />
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
                <LuxurySelect
                  value={localCategory}
                  onChange={setLocalCategory}
                  options={FILTER_OPTIONS.category}
                  placeholder="All Categories"
                />
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
