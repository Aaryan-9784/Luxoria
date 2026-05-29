import React from 'react';
import { motion } from 'framer-motion';
import { CarFront, ShieldCheck, Zap } from 'lucide-react';

const REASONS = [
  {
    icon: CarFront,
    title: 'Premium Fleet',
    description: 'An immaculate collection of the worlds most prestigious vehicles, meticulously maintained to factory standards.'
  },
  {
    icon: ShieldCheck,
    title: 'White-Glove Service',
    description: 'Dedicated 24/7 concierge, global delivery, and personalized itineraries curated for your exact specifications.'
  },
  {
    icon: Zap,
    title: 'Instant Reservation',
    description: 'Seamless digital booking experience with immediate confirmation and guaranteed vehicle availability.'
  }
];

export default function LuxuryWhyChooseUs() {
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
            <span className="text-overline tracking-[0.2em] text-primary">Excellence Delivered</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Luxoria <span className="text-secondary italic font-light lowercase">Difference</span>
          </motion.h2>
        </div>

        {/* 3 Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 ease-out border border-border">
                  <Icon className="w-10 h-10 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 tracking-wide">{reason.title}</h3>
                <p className="text-body text-secondary leading-relaxed max-w-sm">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
