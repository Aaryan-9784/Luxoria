import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, setSortBy, fetchVehicles } from '@/redux/slices/vehicleSlice';
import {
  SlidersHorizontal, X, ChevronDown, RotateCcw, Fuel, Settings, Users, Sparkles, Star, ChevronsUp,
} from 'lucide-react';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../data/vehiclesPageData';
import { EASE_LUXE } from '@/lib/motion';
import CustomSelect from '@/components/ui/CustomSelect';

// ── Compact chip — fits more per row ────────────────────────────────────────
function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full
        text-[11px] font-semibold tracking-wide capitalize
        border transition-all duration-200 whitespace-nowrap
        ${isActive
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-background text-secondary border-border/70 hover:border-primary hover:text-primary hover:bg-primary/5'
        }
      `}
    >
      {label}
      {isActive && <X className="w-2.5 h-2.5 ml-0.5 shrink-0" />}
    </button>
  );
}

// ── Collapsible section ──────────────────────────────────────────────────────
function FilterSection({ title, icon: Icon, children, defaultOpen = true, forceOpen }) {
  // forceOpen === true  → all expanded
  // forceOpen === false → all collapsed
  // forceOpen === undefined → locally controlled
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const isOpen = forceOpen !== undefined ? forceOpen : localOpen;

  return (
    <div className="border-b border-border/40 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
      <button
        type="button"
        onClick={() => setLocalOpen(prev => forceOpen !== undefined ? !forceOpen : !prev)}
        className="w-full flex items-center justify-between py-0.5 mb-2 group"
      >
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-[0.12em]">
          {Icon && <Icon className="w-3 h-3 text-accent" />}
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_LUXE }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────────
export default function AdvancedFilterPanel({ mobileOpen, setMobileOpen }) {
  const dispatch = useDispatch();
  const { filters, sortBy, pagination } = useSelector(state => state.vehicle);

  const toggle = (key, value) => {
    dispatch(setFilter({ [key]: filters[key] === value ? '' : value }));
    dispatch(fetchVehicles());
  };

  const handlePriceChange = (e) => dispatch(setFilter({ [e.target.name]: e.target.value }));
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

  const activeCount = Object.values(filters).filter(Boolean).length;

  // null = individual control, true = all open, false = all collapsed
  const [allCollapsed, setAllCollapsed] = useState(null);

  const toggleCollapseAll = () => {
    setAllCollapsed(prev => prev === false ? true : false);
  };

  // ── Panel body (shared between desktop & mobile) ──────────────────────────
  const PanelContent = () => (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-primary tracking-wide">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold">
              {activeCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Reset all filters */}
          <button
            type="button"
            onClick={resetAll}
            title="Reset all filters"
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Collapse / Expand all sections */}
          <button
            type="button"
            onClick={toggleCollapseAll}
            title={allCollapsed === false ? 'Expand all sections' : 'Collapse all sections'}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface transition-all"
          >
            <motion.div
              animate={{ rotate: allCollapsed === false ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronsUp className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* ── Sort By ── */}
      <div className="mb-3 shrink-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted mb-1.5">Sort By</p>
        <CustomSelect
          value={sortBy}
          onChange={handleSort}
          options={SORT_OPTIONS}
          placeholder="Featured"
          className="w-full"
        />
      </div>

      {/* ── Scrollable filter sections ── */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-0.5
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-border/60
      ">

        {/* Brand */}
        <FilterSection title="Brand" icon={Sparkles} forceOpen={allCollapsed === null ? undefined : !allCollapsed}>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.brand.map(brand => (
              <FilterChip
                key={brand}
                label={brand}
                isActive={filters.brand === brand}
                onClick={() => toggle('brand', brand)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Category" icon={Settings} forceOpen={allCollapsed === null ? undefined : !allCollapsed}>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.category.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                isActive={filters.category === cat}
                onClick={() => toggle('category', cat)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range / Day" icon={Star} forceOpen={allCollapsed === null ? undefined : !allCollapsed}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={handlePriceChange}
              onBlur={applyPrice}
              className="w-full bg-surface border border-border/70 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-accent transition-colors placeholder:text-muted/60"
            />
            <span className="text-muted text-xs shrink-0">—</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              onBlur={applyPrice}
              className="w-full bg-surface border border-border/70 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-accent transition-colors placeholder:text-muted/60"
            />
          </div>
        </FilterSection>

        {/* Seats */}
        <FilterSection title="Seats" icon={Users} defaultOpen={false} forceOpen={allCollapsed === null ? undefined : !allCollapsed}>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.seats.map(s => (
              <FilterChip
                key={s}
                label={`${s} seats`}
                isActive={filters.seats === s}
                onClick={() => toggle('seats', s)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Transmission */}
        <FilterSection title="Transmission" icon={Settings} defaultOpen={false} forceOpen={allCollapsed === null ? undefined : !allCollapsed}>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.transmission.map(t => (
              <FilterChip
                key={t}
                label={t}
                isActive={filters.transmission === t}
                onClick={() => toggle('transmission', t)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Fuel Type */}
        <FilterSection title="Fuel Type" icon={Fuel} defaultOpen={false} forceOpen={allCollapsed === null ? undefined : !allCollapsed}>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.fuelType.map(f => (
              <FilterChip
                key={f}
                label={f}
                isActive={filters.fuelType === f}
                onClick={() => toggle('fuelType', f)}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {/* ── Clear all (only visible when filters active) ── */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="shrink-0 pt-3 mt-2 border-t border-border/50 overflow-hidden"
          >
            <button
              type="button"
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Clear All Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* ── Mobile trigger ── */}
      <div className="lg:hidden sticky top-[72px] z-40 w-full bg-background/90 backdrop-blur-md border-b border-border/50 py-2.5 px-4 shadow-sm mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-surface border border-border hover:border-primary px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters & Sort</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-24 self-start max-h-[calc(100vh-112px)] mr-6">
        <div className="bg-white border border-border/60 rounded-2xl shadow-sm p-4 flex flex-col max-h-[calc(100vh-112px)] overflow-hidden">
          <PanelContent />
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] max-w-[88vw] bg-white z-50 flex flex-col shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
                <span className="font-bold text-primary text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  Filters & Sort
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-primary transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-hidden px-5 py-4">
                <PanelContent />
              </div>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-border/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-all"
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
