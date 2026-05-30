import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function ExperiencePage() {
  return (
    <motion.div {...pageTransition} className="pt-28 pb-16 min-h-screen bg-background flex items-center justify-center">
      <div className="container-luxe text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">The Luxoria Experience</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Immerse yourself in unparalleled luxury. Discover what makes a journey with Luxoria truly unforgettable.
          <br /><br />
          <span className="text-muted text-sm">(Experience Page Content Coming Soon)</span>
        </p>
      </div>
    </motion.div>
  );
}
