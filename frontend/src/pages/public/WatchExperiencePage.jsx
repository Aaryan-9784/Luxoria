import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import WatchHero from '@/sections/watch/WatchHero';
import WatchStory from '@/sections/watch/WatchStory';
import WatchTimeline from '@/sections/watch/WatchTimeline';
import WatchVideoGallery from '@/sections/watch/WatchVideoGallery';
import Watch360Experience from '@/sections/watch/Watch360Experience';
import WatchLifestyle from '@/sections/watch/WatchLifestyle';
import WatchTestimonials from '@/sections/watch/WatchTestimonials';
import WatchFeatures from '@/sections/watch/WatchFeatures';
import WatchAwards from '@/sections/watch/WatchAwards';
import WatchCTA from '@/sections/watch/WatchCTA';

export default function WatchExperiencePage() {
  // Ensure page loads at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div {...pageTransition} className="bg-white text-gray-900 overflow-hidden">
      {/* 1. Cinematic Hero */}
      <WatchHero />

      {/* 2. Luxury Storytelling */}
      <WatchStory />

      {/* 3. Experience Timeline */}
      <WatchTimeline />

      {/* 4. Luxury Video Gallery */}
      <WatchVideoGallery />

      {/* 5. 360 Degree Vehicle Experience */}
      <Watch360Experience />

      {/* 6. Luxury Lifestyle */}
      <WatchLifestyle />

      {/* 7. Customer Experience Testimonials */}
      <WatchTestimonials />

      {/* 8. Why Choose Luxoria */}
      <WatchFeatures />

      {/* 9. Awards & Recognition */}
      <WatchAwards />

      {/* 10. Final CTA */}
      <WatchCTA />
    </motion.div>
  );
}
