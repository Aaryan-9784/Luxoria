import React from 'react';
import { motion } from 'framer-motion';

export default function CollectionHero() {
  return (
    <section className="relative w-full pt-48 pb-20 flex flex-col items-center justify-center bg-background px-4 overflow-hidden">
      <div className="container-luxe relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-overline tracking-[0.2em] text-accent mb-6 block">The Pinnacle of Automotive Engineering</span>
          <h1 className="text-[48px] md:text-[72px] lg:text-[88px] font-bold text-primary mb-6 leading-[1.1] tracking-tight uppercase">
            The World's Finest <br />
            <span className="text-secondary italic font-light lowercase">Collection</span>
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-secondary font-light max-w-[700px] mx-auto leading-relaxed"
        >
          Discover extraordinary vehicles crafted for unforgettable journeys. Experience unparalleled luxury, power, and prestige.
        </motion.p>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none z-0" />
    </section>
  );
}
