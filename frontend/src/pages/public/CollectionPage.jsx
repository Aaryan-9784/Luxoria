import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';
import { PhoneCall } from 'lucide-react';

import CollectionHero from '@/sections/CollectionHero';
import BrandShowcase from '@/sections/BrandShowcase';
import CategoriesSection from '@/sections/CategoriesSection';

import FeaturedVehicles from '@/sections/FeaturedVehicles';
import StatsSection from '@/sections/StatsSection';

import PageCTA from '@/sections/PageCTA';

export default function CollectionPage() {
  // Ensure the page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div {...pageTransition} className="bg-background">
      <CollectionHero />
      <BrandShowcase />
      <CategoriesSection />

      <FeaturedVehicles />
      <StatsSection />

      
      <PageCTA 
        bgImage="https://hips.hearstapps.com/hmg-prod/images/03-bugatti-the-wheels-1-68c9a67932d2c.jpg"
        headline={
          <>
            Command the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#C9A227] italic font-normal lowercase font-serif pr-2 drop-shadow-[0_2px_15px_rgba(212,175,55,0.15)]">Extraordinary</span>
          </>
        }
        subheadline="Reserve your definitive luxury automotive experience today."
        primaryBtnText="View Fleet"
        primaryBtnLink="/vehicles"
        secondaryBtnText="Speak With Concierge"
        secondaryBtnLink="/contact"
        secondaryBtnIcon={PhoneCall}
      />
    </motion.div>
  );
}
