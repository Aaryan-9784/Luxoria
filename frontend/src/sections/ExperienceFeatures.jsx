import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const FEATURES = [
  'Handpicked Luxury Fleet',
  'Verified Premium Vehicles',
  'Instant Booking',
  'Professional Chauffeurs',
  'Flexible Rental Packages',
  'Premium Insurance',
  'Luxury Support Team',
  'Nationwide Coverage'
];

export default function ExperienceFeatures() {
  return (
    <section className="py-[140px] bg-surface relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px] relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">Uncompromising Quality</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Why Choose <span className="text-secondary italic font-light lowercase">Luxoria</span>
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center p-6 bg-white border border-border/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mr-4 group-hover:bg-accent/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <span className="text-lg font-bold text-primary tracking-wide group-hover:text-accent transition-colors">{feature}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
