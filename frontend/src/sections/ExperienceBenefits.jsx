import React from 'react';
import { motion } from 'framer-motion';
import { Crown, CalendarCheck, Ticket, Headphones, ArrowUpCircle, Gem, Percent } from 'lucide-react';

const BENEFITS = [
  { icon: CalendarCheck, title: 'Priority Booking' },
  { icon: Ticket, title: 'VIP Event Invitations' },
  { icon: Headphones, title: 'Dedicated Concierge' },
  { icon: ArrowUpCircle, title: 'Complimentary Upgrades' },
  { icon: Gem, title: 'Luxury Lifestyle Access' },
  { icon: Percent, title: 'Special Member Pricing' }
];

export default function ExperienceBenefits() {
  return (
    <section className="py-[140px] bg-primary relative overflow-hidden">
      
      {/* Background Details */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-primary to-[#1a1a1a]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px] relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Crown className="w-8 h-8 text-accent" />
          </motion.div>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-white/70">The Inner Circle</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Exclusive Member <span className="text-white/60 italic font-light lowercase">Benefits</span>
          </motion.h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="group relative p-8 rounded-[24px] bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:border-accent/40 transition-all duration-500">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="relative z-10 text-xl font-bold text-white tracking-wide">{benefit.title}</h3>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
