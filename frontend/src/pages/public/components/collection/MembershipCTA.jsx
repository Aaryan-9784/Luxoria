import React from 'react';
import { motion } from 'framer-motion';

export default function MembershipCTA() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-luxe border border-border p-10 md:p-16 lg:p-24 flex flex-col items-center justify-center text-center shadow-2xl shadow-black/5"
      >
        {/* Glassmorphism effects internal to the card */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
        
        {/* Subtle animated background shapes */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[60px]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-[60px]" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center mb-8 shadow-xl">
            {/* Simple logo representation */}
            <div className="w-8 h-8 border-2 border-accent rounded-sm transform rotate-45" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-primary font-serif mb-6 leading-tight">
            Experience Automotive Excellence
          </h2>
          
          <p className="text-lg text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            Join the LUXORIA elite. Become a member to access our complete private collection, exclusive events, and priority reservations worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto btn btn-primary px-8 py-3.5 rounded-full text-base shadow-xl">
              Become Member
            </button>
            <button className="w-full sm:w-auto btn btn-outline px-8 py-3.5 rounded-full text-base border-primary/20 hover:border-primary hover:bg-transparent">
              Book Private Viewing
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
