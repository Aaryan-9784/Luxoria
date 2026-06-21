import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function VehicleComparisonModal({ vehicles, removeCompare, clearCompare }) {
  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-white/40 shadow-[0_-20px_60px_rgb(0,0,0,0.1)] rounded-t-3xl max-h-[80vh] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-light text-slate-900">Vehicle Comparison</h3>
            <p className="text-slate-500 font-light mt-1">Comparing {vehicles.length} of 3 vehicles</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearCompare}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={clearCompare} // Could also close just the modal view
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-700" />
            </button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
          {vehicles.map((v) => (
            <div key={v.id} className="min-w-[300px] flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm relative snap-start">
              <button 
                onClick={() => removeCompare(v.id)}
                className="absolute top-4 right-4 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors z-10"
              >
                <X size={16} />
              </button>
              
              <div className="h-48 overflow-hidden rounded-t-2xl">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-6">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{v.brand}</div>
                <h4 className="text-lg font-medium text-slate-900 mb-6">{v.name}</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500 font-light">Daily Price</span>
                    <span className="font-medium text-slate-900">${v.dailyPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500 font-light">Horsepower</span>
                    <span className="font-medium text-slate-900">{v.horsepower}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500 font-light">Top Speed</span>
                    <span className="font-medium text-slate-900">{v.topSpeed}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500 font-light">Transmission</span>
                    <span className="font-medium text-slate-900">{v.transmission}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500 font-light">Fuel Type</span>
                    <span className="font-medium text-slate-900">{v.fuelType}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500 font-light">Seats</span>
                    <span className="font-medium text-slate-900">{v.seats}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 font-light">Rating</span>
                    <span className="font-medium text-slate-900 flex items-center gap-1">
                      {v.rating} <Check size={14} className="text-emerald-500" />
                    </span>
                  </div>
                </div>

                <button className="w-full mt-8 bg-black text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                  Select for Booking
                </button>
              </div>
            </div>
          ))}

          {/* Placeholder for remaining slots */}
          {Array.from({ length: 3 - vehicles.length }).map((_, i) => (
            <div key={`empty-${i}`} className="min-w-[300px] flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-50/50 snap-start">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <span className="text-2xl text-slate-300 font-light">+</span>
              </div>
              <p className="text-slate-400 font-medium text-center">Add a vehicle to compare</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
