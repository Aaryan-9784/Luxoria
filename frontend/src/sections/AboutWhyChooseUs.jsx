import React from 'react';
import { motion } from 'framer-motion';
import { CarFront, ShieldCheck, UserCheck, MapPin, HeadphonesIcon, FileCheck, Globe, Award } from 'lucide-react';

const REASONS = [
  { icon: CarFront, title: 'Handpicked Luxury Fleet', desc: 'Curated selection of the world\'s finest automobiles.' },
  { icon: ShieldCheck, title: 'Verified Premium Vehicles', desc: 'Rigorous inspection and pristine maintenance standards.' },
  { icon: UserCheck, title: 'Personal Concierge Service', desc: 'Dedicated specialists to manage your entire itinerary.' },
  { icon: MapPin, title: 'Doorstep Vehicle Delivery', desc: 'Seamless handover at your hotel, airport, or residence.' },
  { icon: HeadphonesIcon, title: '24/7 VIP Support', desc: 'Round-the-clock assistance for complete peace of mind.' },
  { icon: FileCheck, title: 'Premium Insurance Coverage', desc: 'Comprehensive protection plans for worry-free driving.' },
  { icon: Globe, title: 'Nationwide Availability', desc: 'Access to luxury mobility across all major premium destinations.' },
  { icon: Award, title: 'Exclusive Member Benefits', desc: 'Priority booking, upgrades, and private event access.' }
];

export default function AboutWhyChooseUs() {
  return (
    <section className="py-[140px] bg-white relative overflow-hidden">
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
            <span className="text-overline tracking-[0.2em] text-primary">The Luxoria Standard</span>
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

        {/* 4x2 Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                className="flex flex-col items-start p-8 bg-surface rounded-sm border border-border group hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-500 border border-border relative z-10">
                  <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 tracking-wide relative z-10">{reason.title}</h3>
                <p className="text-body text-secondary leading-relaxed relative z-10">
                  {reason.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
