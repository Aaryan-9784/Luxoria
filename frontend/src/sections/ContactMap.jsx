import React from 'react';
import { motion } from 'framer-motion';

export default function ContactMap() {
  return (
    <section className="w-full bg-black overflow-hidden flex justify-center py-12">
      
      {/* Fixed aspect ratio container matching the map image approx (16:9 or 3:2) 
          This ensures the map and the markers ALWAYS scale together flawlessly. */}
      <div className="relative w-full max-w-[1400px] aspect-[16/9] group">
        
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

        {/* Luxury Map Markers - Exact positions based on a stable 16:9 box */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* Standard Markers */}
          {[
            { city: 'Toronto', top: '36%', left: '26%', labelPos: '-top-8 -left-4' },
            { city: 'New York', top: '39%', left: '27.5%', labelPos: 'top-6 -left-4' },
            { city: 'London', top: '30%', left: '47%', labelPos: '-top-8 -left-4' },
            { city: 'Paris', top: '32.5%', left: '48%', labelPos: 'top-6 -left-4' },
            { city: 'Dubai', top: '48%', left: '61%', labelPos: '-top-8 -left-4' },
            { city: 'Mumbai', top: '54%', left: '67.2%', labelPos: 'top-6 -left-4' }
          ].map((marker) => (
            <div key={marker.city} className="absolute z-30" style={{ top: marker.top, left: marker.left }}>
              <div className="w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_rgba(212,175,55,1)] relative animate-pulse" />
              <div className={`absolute ${marker.labelPos} bg-white px-3 py-1 rounded-[2px] text-xs font-bold text-primary uppercase tracking-widest whitespace-nowrap shadow-lg`}>{marker.city}</div>
            </div>
          ))}

          {/* Ahmedabad HQ Marker */}
          <div className="absolute top-[51%] left-[66.5%] z-40">
            <div className="w-6 h-6 bg-white border-4 border-accent rounded-full shadow-[0_0_30px_rgba(212,175,55,1)] relative animate-bounce" />
            <div className="absolute -top-10 -left-6 bg-white px-4 py-2 rounded-[2px] text-sm font-bold text-primary uppercase tracking-widest shadow-xl whitespace-nowrap">Ahmedabad HQ</div>
          </div>
          
        </div>

        {/* Overlay Gradient at bottom for seamless transition if needed */}
        <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />
      </div>

    </section>
  );
}
