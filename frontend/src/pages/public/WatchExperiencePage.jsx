import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import WatchHero from '@/sections/watch/WatchHero';

export default function WatchExperiencePage() {
  // Ensure page loads at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div {...pageTransition} className="bg-white text-gray-900">
      {/* 1. Cinematic Hero */}
      <WatchHero />
    </motion.div>
  );
}
