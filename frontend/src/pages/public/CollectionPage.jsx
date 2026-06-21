import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function CollectionPage() {
  return (
    <motion.div {...pageTransition} className="bg-background min-h-screen flex flex-col">
      {/* Future Content can go here */}
    </motion.div>
  );
}
