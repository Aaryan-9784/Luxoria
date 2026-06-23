import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

export default function WatchHero() {

  return (
    <>
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
          <video 
            key="luxoria-bg-video"
            autoPlay 
            loop 
            playsInline
            className="w-full h-full object-cover"
            src="/luxoria-film.mp4"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4 flex flex-col items-center max-w-4xl mx-auto mt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-8 flex flex-col items-center"
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
          </motion.div>
        </div>
      </section>
    </>
  );
}
