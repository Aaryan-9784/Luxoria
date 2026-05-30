import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function AboutPage() {
  return (
    <motion.div {...pageTransition} className="pt-28 pb-16 min-h-screen bg-background flex items-center justify-center">
      <div className="container-luxe text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">About Luxoria</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Redefining the standard of luxury car rentals. We curate the finest vehicles for those who demand excellence.
          <br /><br />
          <span className="text-muted text-sm">(About Page Content Coming Soon)</span>
        </p>
      </div>
    </motion.div>
  );
}
