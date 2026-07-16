import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { vehicles } from './data';

export default function FeaturedVehicle() {
  // Select a specific high-end car from data
  const editorPick = vehicles.find(v => v.id === 'rolls-royce-ghost-series-ii') || vehicles[0];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <span className="text-xs font-medium uppercase tracking-widest text-slate-500">Curated Selection</span>
          <h2 className="text-4xl font-light text-slate-900 mt-2">Editor's Luxury Picks</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-slate-900 rounded-3xl overflow-hidden flex flex-col lg:flex-row group"
        >
          {/* Image Side */}
          <div className="w-full lg:w-3/5 h-96 lg:h-[600px] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/50 lg:to-slate-900/80 z-10" />
            <img 
              src={editorPick.image} 
              alt={editorPick.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-2/5 p-8 lg:p-16 flex flex-col justify-center relative z-20 bg-slate-900 lg:bg-transparent -mt-10 lg:mt-0 rounded-t-3xl lg:rounded-none lg:absolute lg:right-0 lg:h-full">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-medium uppercase tracking-wider mb-6">
                Featured of the Week
              </div>
              
              <h3 className="text-4xl lg:text-5xl font-light text-white leading-tight mb-4">
                {editorPick.brand} <br />
                <span className="font-semibold">{editorPick.name.replace(editorPick.brand, '').trim()}</span>
              </h3>
              
              <p className="text-slate-300 font-light leading-relaxed mb-8">
                Experience the pinnacle of automotive engineering and unmatched luxury. The {editorPick.name} represents the perfect harmony of power, elegance, and supreme comfort.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10 border-t border-white/10 pt-6">
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Power</div>
                  <div className="text-white font-medium text-xl">{editorPick.horsepower}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Top Speed</div>
                  <div className="text-white font-medium text-xl">{editorPick.topSpeed}</div>
                </div>
              </div>

              <button className="w-full bg-white text-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors font-medium">
                Reserve Experience
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
