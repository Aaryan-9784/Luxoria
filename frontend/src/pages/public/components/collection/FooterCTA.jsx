import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FooterCTA() {
  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden text-center py-20 px-4 md:px-12 shadow-2xl"
        >
          {/* Abstract glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
              Your Dream Drive Awaits
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl font-light mb-10 leading-relaxed">
              Join an exclusive community of automotive enthusiasts. Elevate your journey and reserve your vehicle today to ensure availability.
            </p>
            
            <button className="bg-white text-slate-900 px-8 py-4 rounded-full flex items-center gap-2 hover:bg-slate-100 hover:scale-105 transition-all font-medium text-lg">
              Reserve Your Luxury Experience
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
