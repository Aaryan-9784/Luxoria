import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import ExperienceHero from '@/sections/ExperienceHero';
import ExperienceHighlights from '@/sections/ExperienceHighlights';
import ExperienceTimeline from '@/sections/ExperienceTimeline';
import ExperienceCollections from '@/sections/ExperienceCollections';
import ExperienceFeatures from '@/sections/ExperienceFeatures';
import ExperienceBenefits from '@/sections/ExperienceBenefits';
import ExperienceTestimonials from '@/sections/ExperienceTestimonials';
import ExperienceDestinations from '@/sections/ExperienceDestinations';
import ExperienceGallery from '@/sections/ExperienceGallery';
import ExperienceCTA from '@/sections/ExperienceCTA';

export default function ExperiencePage() {
  return (
    <motion.div {...pageTransition} className="bg-background">
      {/* 1. Hero */}
      <ExperienceHero />

      {/* 2. Highlights */}
      <ExperienceHighlights />

      {/* 3. Timeline */}
      <ExperienceTimeline />

      {/* 4. Collections */}
      <ExperienceCollections />

      {/* 5. Features */}
      <ExperienceFeatures />

      {/* 6. Benefits */}
      <ExperienceBenefits />

      {/* 7. Testimonials */}
      <ExperienceTestimonials />

      {/* 8. Destinations */}
      <ExperienceDestinations />

      {/* 9. Gallery */}
      <ExperienceGallery />

      {/* 10. CTA */}
      <ExperienceCTA />
    </motion.div>
  );
}
