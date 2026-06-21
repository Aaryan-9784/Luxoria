import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

import ContactHero from '@/sections/ContactHero';
import ContactInfo from '@/sections/ContactInfo';
import ContactFormSection from '@/sections/ContactFormSection';
import ContactBookingProcess from '@/sections/ContactBookingProcess';
import ContactGlobalLocations from '@/sections/ContactGlobalLocations';

import ContactSupportFeatures from '@/sections/ContactSupportFeatures';
import ContactMap from '@/sections/ContactMap';
import PageCTA from '@/sections/PageCTA';
import { PhoneCall } from 'lucide-react';

export default function ContactPage() {
  // Ensure the page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div {...pageTransition} className="bg-background">
      <ContactHero />
      <ContactInfo />
      <ContactFormSection />
      <ContactBookingProcess />
      <ContactGlobalLocations />

      <ContactSupportFeatures />
      <ContactMap />
      
      <PageCTA 
        bgImage="https://www.mansory.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/661d6e0d2e84ef511db18f17/681b304b9da7339525a0907c_revuelto-black-lime-th.webp"
        headline={
          <>
            Your Luxury Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#C9A227] italic font-normal lowercase font-serif pr-2 drop-shadow-[0_2px_15px_rgba(212,175,55,0.15)]">Starts Here</span>
          </>
        }
        subheadline="Our concierge team is ready to assist you."
        primaryBtnText="Book Experience"
        primaryBtnLink="/experience"
        secondaryBtnText="Speak With Concierge"
        secondaryBtnLink="#contact-form"
        secondaryBtnIcon={PhoneCall}
      />
    </motion.div>
  );
}

