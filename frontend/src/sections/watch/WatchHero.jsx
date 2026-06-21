import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { fadeUp } from '@/lib/motion';

export default function WatchHero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Using a high-quality placeholder car video from Pexels */}
          <source src="https://videos.pexels.com/video-files/3752831/3752831-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 flex flex-col items-center max-w-4xl mx-auto mt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-6 flex flex-col items-center"
        >
          <span className="uppercase tracking-[0.3em] text-sm md:text-base font-light text-white/80">
            The Luxoria Experience
          </span>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Experience Luxury <br className="hidden md:block" /> Beyond Transportation
          </h1>
          <p className="text-lg md:text-xl font-light text-white/90 max-w-2xl mx-auto">
            Every journey becomes a statement.
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
              <Play className="w-6 h-6 ml-1" />
            </div>
            <span className="uppercase tracking-widest text-sm font-medium">Watch Film</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-xs uppercase tracking-widest font-light">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 overflow-hidden relative">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2 bg-white absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
