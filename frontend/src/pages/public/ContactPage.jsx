import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function ContactPage() {
  return (
    <motion.div {...pageTransition} className="pt-28 pb-16 min-h-screen bg-background flex items-center justify-center">
      <div className="container-luxe text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Contact Us</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto mb-8">
          Our concierge team is available around the clock to assist you with your booking or any inquiries.
          <br /><br />
          <span className="text-muted text-sm">(Contact Page Content Coming Soon)</span>
        </p>
        <div className="text-primary font-medium">
          <p>Email: concierge@luxoria.com</p>
          <p>Phone: +1 (800) 555-LUXE</p>
        </div>
      </div>
    </motion.div>
  );
}
