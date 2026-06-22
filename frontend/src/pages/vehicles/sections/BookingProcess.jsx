import React from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointerClick, ScanFace, CreditCard, Truck, Gauge } from 'lucide-react';
import { BOOKING_STEPS } from '../data/vehiclesPageData';
import { EASE_LUXE, staggerContainer, staggerItem, revealOnScroll } from '@/lib/motion';

const iconMap = {
  Search, MousePointerClick, ScanFace, CreditCard, Truck, Gauge
};

export default function BookingProcess() {
  return (
    <motion.section {...revealOnScroll} className="py-20 md:py-32 overflow-hidden">
      <div className="container-luxe">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-overline text-accent mb-3 block">Simple & Seamless</span>
          <h2 className="text-h2 text-primary">The Luxoria Experience</h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-border/50 hidden md:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: EASE_LUXE }}
            className="absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-accent/20 via-accent to-accent/20 hidden md:block origin-left"
          />

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10"
          >
            {BOOKING_STEPS.map((step) => {
              const Icon = iconMap[step.icon] || Search;
              return (
                <motion.div key={step.step} variants={staggerItem} className="flex flex-col items-center text-center relative group">
                  {/* Icon Circle */}
                  <div className="w-24 h-24 rounded-full bg-background border-2 border-border flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(201,167,93,0.15)] transition-all duration-500 relative z-10">
                    <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-500" />
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-4 border-background">
                      {step.step}
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-primary mb-2">{step.title}</h4>
                  <p className="text-xs text-secondary leading-relaxed max-w-[200px]">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
