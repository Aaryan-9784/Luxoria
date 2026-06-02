import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import AboutHero from '@/sections/AboutHero';
import AboutStory from '@/sections/AboutStory';
import AboutMission from '@/sections/AboutMission';
import AboutWhyChooseUs from '@/sections/AboutWhyChooseUs';
import AboutFleetShowcase from '@/sections/AboutFleetShowcase';
import AboutLeadership from '@/sections/AboutLeadership';
import AboutAchievements from '@/sections/AboutAchievements';
import ContactFAQ from '@/sections/ContactFAQ';
import PageCTA from '@/sections/PageCTA';

export default function AboutPage() {
  // Ensure the page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div {...pageTransition} className="bg-background">
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutWhyChooseUs />
      <AboutFleetShowcase />
      <AboutLeadership />
      <AboutAchievements />
      <ContactFAQ />
      
      <PageCTA 
        bgImage="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=2070&auto=format&fit=crop"
        headline={
          <>
            Experience Luxury <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#C9A227] italic font-normal lowercase font-serif pr-2 drop-shadow-[0_2px_15px_rgba(212,175,55,0.15)]">Without Limits</span>
          </>
        }
        subheadline="Discover why thousands trust Luxoria for extraordinary automotive experiences."
        primaryBtnText="Explore Collection"
        primaryBtnLink="/collection"
        secondaryBtnText="Book Experience"
        secondaryBtnLink="/experience"
      />
    </motion.div>
  );
}

