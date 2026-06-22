import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, setSortBy, fetchVehicles, saveCurrentFilters, loadSavedFilters } from '@/redux/slices/vehicleSlice';
import {
  SlidersHorizontal, X, ChevronDown, Save, RotateCcw, Star, MapPin, Fuel, Settings, Users, Check, Sparkles,
} from 'lucide-react';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../data/vehiclesPageData';
import { EASE_LUXE, revealOnScroll } from '@/lib/motion';

function FilterChip({ label, isActive, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border whitespace-nowrap ${
        isActive
          ? 'bg-primary text-white border-primary shadow-md'
          : 'bg-background text-secondary border-border hover:border-primary hover:text-primary'
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span className="capitalize">{label}</span>
      {isActive && <X className="w-3 h-3 ml-0.5" />}
    </button>
  );
}

function FilterSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase tracking-wider mb-3"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_LUXE }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdvancedFilterPanel({ mobileOpen, setMobileOpen }) {
  const dispatch = useDispatch();
  const { filters, sortBy, savedFilters, pagination } = useSelector(state => state.vehicle);

  const handleFilterToggle = (key, value) => {
    const newValue = filters[key] === value ? '' : value;
    dispatch(setFilter({ [key]: newValue }));
    dispatch(fetchVehicles());
  };

  const handlePriceChange = (e) => {
    dispatch(setFilter({ [e.target.name]: e.target.value }));
  };

  const applyPrice = () => dispatch(fetchVehicles());

  const handleSort = (value) => {
    dispatch(setSortBy(value));
    dispatch(fetchVehicles());
  };

  const resetAll = () => {
    dispatch(clearFilters());
    dispatch(fetchVehicles());
    if (setMobileOpen) setMobileOpen(false);
  };

  const activeFilters = Object.entries(filters).filter(([_, val]) => val !== '');

  const PanelContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
        <h3 className="text-h4 text-primary flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-accent" />
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {savedFilters && (
            <button
              onClick={() => { dispatch(loadSavedFilters()); dispatch(fetchVehicles()); }}
              className="text-[10px] font-bold text-accent uppercase tracking-wider hover:text-accent-hover transition-colors"
            >
              Load Saved
            </button>
          )}
          <button
            onClick={() => dispatch(saveCurrentFilters())}
            className="btn-icon btn-icon-sm text-muted hover:text-accent"
            title="Save current filters"
          >
            <Save className="w-4 h-4" />
          </button>
          <button onClick={resetAll} className="btn-icon btn-icon-sm text-muted hover:text-error">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filters Count */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-accent/5 rounded-xl border border-accent/10">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent">{activeFilters.length} active filter{activeFilters.length > 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Sort */}
      <div className="mb-5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="w-full bg-surface border border-border text-sm text-primary rounded-xl px-3 py-2.5 outline-none focus:border-accent appearance-none cursor-pointer font-medium"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1">
        {/* Brand */}
        <FilterSection title="Brand" icon={Sparkles}>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.brand.map(brand => (
              <FilterChip
                key={brand}
                label={brand}
                isActive={filters.brand === brand}
                onClick={() => handleFilterToggle('brand', brand)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Category" icon={Settings}>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.category.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                isActive={filters.category === cat}
                onClick={() => handleFilterToggle('category', cat)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range / Day" icon={Star}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={handlePriceChange}
              onBlur={applyPrice}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            <span className="text-muted text-sm">—</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              onBlur={applyPrice}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
        </FilterSection>

        {/* Seats */}
        <FilterSection title="Seats" icon={Users} defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.seats.map(s => (
              <FilterChip
                key={s}
                label={`${s} seats`}
                isActive={filters.seats === s}
                onClick={() => handleFilterToggle('seats', s)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Transmission */}
        <FilterSection title="Transmission" icon={Settings} defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.transmission.map(t => (
              <FilterChip
                key={t}
                label={t}
                isActive={filters.transmission === t}
                onClick={() => handleFilterToggle('transmission', t)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Fuel Type */}
        <FilterSection title="Fuel Type" icon={Fuel} defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.fuelType.map(f => (
              <FilterChip
                key={f}
                label={f}
                isActive={filters.fuelType === f}
                onClick={() => handleFilterToggle('fuelType', f)}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
      {/* Universal Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[90vw] bg-background z-50 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-h4 text-primary">Refine Results</h3>
                <button onClick={() => setMobileOpen(false)} className="btn-icon">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <PanelContent />
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary w-full shadow-lg rounded-xl"
                >
                  Show {pagination.total || 0} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
