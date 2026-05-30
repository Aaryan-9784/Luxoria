import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function CollectionPage() {
  return (
    <motion.div {...pageTransition} className="pt-28 pb-16 min-h-screen bg-background flex items-center justify-center">
      <div className="container-luxe text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Collection</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Explore our curated selection of the world's most prestigious vehicles. From high-performance supercars to elegant luxury sedans.
          <br /><br />
          <span className="text-muted text-sm">(Collection Page Content Coming Soon)</span>
        </p>
      </div>
    </motion.div>
  );
}
