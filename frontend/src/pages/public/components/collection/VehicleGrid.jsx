import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Heart, Plus } from 'lucide-react';

function VehicleCard({ vehicle, isCompared, toggleCompare }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      className="group bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img 
          src={vehicle.image} 
          alt={vehicle.name} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${vehicle.availability === 'Available' ? 'bg-white/80 text-emerald-700' : 'bg-black/80 text-white'}`}>
            {vehicle.availability}
          </span>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>

        {/* Compare Checkbox Alternative (Plus Button) */}
        <button 
          onClick={() => toggleCompare(vehicle)}
          className={`absolute bottom-4 right-4 px-4 py-2 rounded-full backdrop-blur-md text-xs font-medium flex items-center gap-1.5 transition-colors ${isCompared ? 'bg-black text-white' : 'bg-white/80 text-black hover:bg-white'}`}
        >
          <Plus size={14} className={isCompared ? "rotate-45 transition-transform" : "transition-transform"} />
          {isCompared ? 'Added' : 'Compare'}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{vehicle.brand}</span>
            <h3 className="text-xl font-light text-slate-900 mt-1">{vehicle.name}</h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{vehicle.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-slate-500 text-sm mb-6 mt-1">
          <MapPin size={14} className="mr-1" />
          {vehicle.location}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-3 mb-6 flex-1 text-sm text-slate-600 font-light border-y border-slate-100 py-4">
          <div><span className="font-medium text-slate-900">HP:</span> {vehicle.horsepower}</div>
          <div><span className="font-medium text-slate-900">Top Speed:</span> {vehicle.topSpeed}</div>
          <div><span className="font-medium text-slate-900">Seats:</span> {vehicle.seats}</div>
          <div><span className="font-medium text-slate-900">Trans:</span> {vehicle.transmission.slice(0,4)}</div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-sm text-slate-500">From</span>
            <div className="text-2xl font-light text-slate-900">${vehicle.dailyPrice.toLocaleString()}<span className="text-sm text-slate-500">/day</span></div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
              Quick View
            </button>
            <button className="px-6 py-2 text-sm font-medium text-white bg-black hover:bg-slate-800 rounded-full transition-colors">
              Book
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VehicleGrid({ vehicles, compareVehicles, toggleCompare }) {
  if (vehicles.length === 0) {
    return (
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-light text-slate-900">No vehicles found.</h3>
          <p className="text-slate-500 mt-2 font-light">Try adjusting your filters to find your perfect luxury experience.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              isCompared={compareVehicles.some(v => v.id === vehicle.id)}
              toggleCompare={toggleCompare}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
