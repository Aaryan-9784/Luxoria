import React from 'react';
import { Search, MapPin, SlidersHorizontal, Calendar } from 'lucide-react';
import { categories, brands, locations, transmissions, fuelTypes, sortOptions } from './data';

export default function CollectionFilter(props) {
  const {
    activeCategory, setActiveCategory,
    activeBrand, setActiveBrand,
    activeLocation, setActiveLocation,
    activeTransmission, setActiveTransmission,
    activeFuelType, setActiveFuelType,
    priceRange, setPriceRange,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    resultsCount
  } = props;

  return (
    <section className="py-12 bg-[#fafafa] sticky top-[72px] z-30 shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Row: Search and Quick Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          
          <div className="flex-1 w-full flex items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100">
            <Search className="text-slate-400 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Search by vehicle name or brand..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 font-light"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-48 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-center">
              <MapPin className="text-slate-400 mr-2" size={18} />
              <select 
                value={activeLocation}
                onChange={(e) => setActiveLocation(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 font-light appearance-none cursor-pointer"
              >
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            
            <div className="flex-1 md:w-48 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-center">
              <Calendar className="text-slate-400 mr-2" size={18} />
              <input type="date" className="w-full bg-transparent outline-none text-slate-700 font-light cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Bottom Row: Advanced Filters */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6 lg:items-end justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Category</label>
              <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2 text-sm text-slate-700 font-light outline-none shadow-sm cursor-pointer">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Brand</label>
              <select value={activeBrand} onChange={(e) => setActiveBrand(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2 text-sm text-slate-700 font-light outline-none shadow-sm cursor-pointer">
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transmission</label>
              <select value={activeTransmission} onChange={(e) => setActiveTransmission(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2 text-sm text-slate-700 font-light outline-none shadow-sm cursor-pointer">
                {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fuel Type</label>
              <select value={activeFuelType} onChange={(e) => setActiveFuelType(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2 text-sm text-slate-700 font-light outline-none shadow-sm cursor-pointer">
                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full md:w-48">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Daily Price</span>
                <span>${priceRange[0]} - ${priceRange[1]}</span>
              </label>
              <input 
                type="range" 
                min="0" max="20000" step="100"
                value={priceRange[1]} 
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 border-t lg:border-t-0 border-slate-200 pt-4 lg:pt-0">
            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">{resultsCount} Vehicles Found</span>
            <div className="flex items-center bg-white/60 backdrop-blur-md border border-white/40 rounded-lg px-3 py-2 shadow-sm">
              <SlidersHorizontal size={16} className="text-slate-500 mr-2" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent outline-none text-sm text-slate-700 font-light cursor-pointer">
                {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
