import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import LuxuryHero from '@/sections/LuxuryHero';
import SignatureCollection from '@/sections/SignatureCollection';
import LuxuryWhyChooseUs from '@/sections/LuxuryWhyChooseUs';
import LuxuryStorytelling from '@/sections/LuxuryStorytelling';
import LuxuryTestimonials from '@/sections/LuxuryTestimonials';
import FinalCTA from '@/sections/FinalCTA';
import QuickViewModal from '@/pages/vehicles/sections/QuickViewModal';
import CompareVehicles from '@/pages/vehicles/sections/CompareVehicles';

export default function HomePage() {
  return (
    <motion.div {...pageTransition} className="bg-background">
      {/* 1. Hero Experience */}
      <LuxuryHero />

      {/* 2. Signature Collection */}
      <SignatureCollection />

      {/* 3. Why Luxoria */}
      <LuxuryWhyChooseUs />

      {/* 4. Luxury Storytelling */}
      <LuxuryStorytelling />

      {/* 5. Testimonials */}
      <LuxuryTestimonials />

      {/* 6. Final CTA */}
      <FinalCTA />

      {/* Home page overlays for signature fleet actions */}
      <QuickViewModal />
      <CompareVehicles />
    </motion.div>
  );
}
