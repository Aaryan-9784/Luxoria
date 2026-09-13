import React from 'react';
import { motion } from 'framer-motion';

export default function ExperienceHero() {
  return (
    <section className="relative w-full pt-48 pb-20 flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-[800px] w-full text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[48px] md:text-[72px] font-bold text-primary mb-6 leading-tight tracking-tight font-serif"
        >
          The Ultimate Journey
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-secondary font-light max-w-[700px] mx-auto leading-relaxed"
        >
          From exotic supercars to chauffeur-driven luxury, every Luxoria experience is crafted to deliver elegance, prestige, comfort, and unforgettable memories.
        </motion.p>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-0" />
    </section>
  );
}
