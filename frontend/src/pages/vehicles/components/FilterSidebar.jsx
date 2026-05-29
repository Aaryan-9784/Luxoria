import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, fetchVehicles } from '@/redux/slices/vehicleSlice';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const FILTER_OPTIONS = {
  brand: ['Porsche', 'Rolls Royce', 'Mercedes-Benz', 'Lamborghini', 'Ferrari', 'Bentley', 'Audi', 'BMW', 'Tesla'],
  category: ['sports', 'suv', 'luxury', 'sedan', 'convertible', 'electric', 'limousine'],
  transmission: ['automatic', 'manual'],
  fuelType: ['petrol', 'diesel', 'electric', 'hybrid'],
};

function Accordion({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-body-sm font-semibold text-primary uppercase tracking-wider mb-2"
      >
        {title}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({ mobileOpen, setMobileOpen }) {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.vehicle.filters);

  const handleFilterChange = (key, value) => {
    // Toggle logic: if already selected, deselect
    const newValue = filters[key] === value ? '' : value;
    dispatch(setFilter({ [key]: newValue }));
    dispatch(fetchVehicles());
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilter({ [name]: value }));
  };

  const applyPrice = () => dispatch(fetchVehicles());

  const resetAll = () => {
    dispatch(clearFilters());
    dispatch(fetchVehicles());
    if (setMobileOpen) setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h4 text-primary flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-accent" /> Filters
        </h2>
        <button onClick={resetAll} className="text-caption font-semibold text-muted hover:text-primary transition-colors uppercase">
          Reset All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
        
        {/* Categories */}
        <Accordion title="Vehicle Type">
          {FILTER_OPTIONS.category.map(cat => (
            <label key={cat} className="flex items-center gap-3 group cursor-pointer">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.category === cat ? 'bg-accent border-accent' : 'border-border group-hover:border-primary'}`}>
                {filters.category === cat && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className={`text-body-sm capitalize transition-colors ${filters.category === cat ? 'text-primary font-medium' : 'text-secondary group-hover:text-primary'}`}>
                {cat}
              </span>
            </label>
          ))}
        </Accordion>

        {/* Brands */}
        <Accordion title="Marque">
          {FILTER_OPTIONS.brand.map(brand => (
            <label key={brand} className="flex items-center gap-3 group cursor-pointer">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.brand === brand ? 'bg-accent border-accent' : 'border-border group-hover:border-primary'}`}>
                {filters.brand === brand && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className={`text-body-sm transition-colors ${filters.brand === brand ? 'text-primary font-medium' : 'text-secondary group-hover:text-primary'}`}>
                {brand}
              </span>
            </label>
          ))}
        </Accordion>

        {/* Price Range */}
        <Accordion title="Price Range (per day)">
          <div className="flex items-center gap-2 mb-3">
            <input 
              type="number" 
              name="minPrice" 
              placeholder="Min ₹" 
              value={filters.minPrice}
              onChange={handlePriceChange}
              onBlur={applyPrice}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-body-sm outline-none focus:border-accent"
            />
            <span className="text-muted">-</span>
            <input 
              type="number" 
              name="maxPrice" 
              placeholder="Max ₹" 
              value={filters.maxPrice}
              onChange={handlePriceChange}
              onBlur={applyPrice}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-body-sm outline-none focus:border-accent"
            />
          </div>
        </Accordion>

        {/* Transmission */}
        <Accordion title="Transmission" defaultOpen={false}>
          {FILTER_OPTIONS.transmission.map(trans => (
            <label key={trans} className="flex items-center gap-3 group cursor-pointer">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.transmission === trans ? 'bg-accent border-accent' : 'border-border group-hover:border-primary'}`}>
                {filters.transmission === trans && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className={`text-body-sm capitalize transition-colors ${filters.transmission === trans ? 'text-primary font-medium' : 'text-secondary group-hover:text-primary'}`}>
                {trans}
              </span>
            </label>
          ))}
        </Accordion>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 sticky top-[100px] h-[calc(100vh-120px)] p-6 glass-sidebar border border-border rounded-2xl">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-background z-50 lg:hidden p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setMobileOpen(false)} className="btn-icon">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarContent />
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                <button onClick={() => setMobileOpen(false)} className="btn btn-primary w-full shadow-lg">
                  View Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
