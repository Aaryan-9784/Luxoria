import React from 'react';
import { motion } from 'framer-motion';

export default function ContactMap() {
  return (
    <section className="w-full h-[60vh] min-h-[500px] relative bg-black overflow-hidden group">
      
      {/* High-End Static Map Image (Dark Theme) */}
      <motion.div
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
          alt="Global Presence Map" 
          className="w-full h-full object-cover opacity-60 grayscale contrast-125"
        />
        
        {/* Abstract "Map" overlay effect to make it look like a map UI */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0" />
      </motion.div>

      {/* Luxury Map Markers - Example positions simulating cities */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-full z-20 pointer-events-none">
        
        {/* Example Marker 1 (New York) */}
        <div className="absolute top-[35%] left-[25%] group/marker">
          <div className="w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_rgba(212,175,55,1)] relative animate-pulse" />
          <div className="absolute top-6 -left-4 bg-white px-3 py-1 rounded-[2px] text-xs font-bold text-primary uppercase tracking-widest opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">New York</div>
        </div>

        {/* Example Marker 2 (London) */}
        <div className="absolute top-[28%] left-[48%] group/marker">
          <div className="w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_rgba(212,175,55,1)] relative animate-pulse" />
          <div className="absolute top-6 -left-4 bg-white px-3 py-1 rounded-[2px] text-xs font-bold text-primary uppercase tracking-widest opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">London</div>
        </div>

        {/* Example Marker 3 (Dubai - HQ) */}
        <div className="absolute top-[45%] left-[62%] group/marker">
          <div className="w-6 h-6 bg-white border-4 border-accent rounded-full shadow-[0_0_30px_rgba(212,175,55,1)] relative animate-bounce" />
          <div className="absolute top-8 -left-8 bg-white px-4 py-2 rounded-[2px] text-sm font-bold text-primary uppercase tracking-widest shadow-xl whitespace-nowrap">Dubai HQ</div>
        </div>
        
      </div>

      {/* Overlay Gradient at bottom for seamless transition if needed */}
      <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />

    </section>
  );
}
