import React from 'react';
import { motion } from 'framer-motion';

export default function FeaturedVehicle() {
  return (
    <section className="relative w-full py-24 bg-primary text-white overflow-hidden">
      {/* Large luxury vehicle image as background */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2115&auto=format&fit=crop" 
          alt="Featured Luxury Vehicle" 
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform hover:scale-110 transition-transform duration-[10s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-8 h-full flex items-center z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Featured Masterpiece</span>
            <h2 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
              BMW <br />M4 Competition
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-xl">
              Experience the pinnacle of M performance. A thrilling blend of aggressive design and track-ready dynamics, engineered for driving enthusiasts.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10 border-t border-white/10 pt-8">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">0-60 mph</p>
                <p className="text-2xl font-light">3.8s</p>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Engine</p>
                <p className="text-2xl font-light">3.0L I6</p>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Power</p>
                <p className="text-2xl font-light">503 HP</p>
              </div>
            </div>

            <button className="btn btn-accent rounded-full px-8 py-3.5 text-base shadow-glow-gold">
              Reserve Experience
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Gold Accents */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}
