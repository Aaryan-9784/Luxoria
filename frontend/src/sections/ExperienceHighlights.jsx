import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, MapPin, Star, PhoneCall } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: UserCheck,
    title: 'Luxury Concierge',
    description: 'Dedicated personal assistance.'
  },
  {
    icon: MapPin,
    title: 'Doorstep Delivery',
    description: 'Vehicle delivered anywhere.'
  },
  {
    icon: Star,
    title: 'VIP Experiences',
    description: 'Exclusive luxury events.'
  },
  {
    icon: PhoneCall,
    title: '24/7 Support',
    description: 'Round-the-clock assistance.'
  }
];

export default function ExperienceHighlights() {
  return (
    <section className="py-[140px] bg-background relative overflow-hidden">
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
            <span className="text-overline tracking-[0.2em] text-primary">Signature Services</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Experience <span className="text-secondary italic font-light lowercase">Highlights</span>
          </motion.h2>
        </div>

        {/* 4 Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HIGHLIGHTS.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-surface border border-border/50 group relative overflow-hidden transition-all duration-500 ease-out shadow-sm hover:shadow-float hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:shadow-lg transition-all duration-500 ease-out border border-border">
                  <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <h3 className="relative z-10 text-xl font-bold text-primary mb-3 tracking-wide">{highlight.title}</h3>
                <p className="relative z-10 text-sm text-secondary leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
