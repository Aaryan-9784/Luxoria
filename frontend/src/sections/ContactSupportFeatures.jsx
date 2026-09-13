import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Star, Users, Briefcase, Zap, HeartHandshake } from 'lucide-react';

const FEATURES = [
  { icon: ShieldAlert, title: '24/7 Concierge' },
  { icon: Star, title: 'Priority Member Support' },
  { icon: Users, title: 'Dedicated Relationship Manager' },
  { icon: Briefcase, title: 'Emergency Roadside Assistance' },
  { icon: Zap, title: 'Instant Booking Support' },
  { icon: HeartHandshake, title: 'Premium Service Guarantee' }
];

export default function ContactSupportFeatures() {
  return (
    <section className="py-[100px] bg-primary relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0 pointer-events-none" />

      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px] relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-2 group cursor-default text-center"
              >
                <Icon className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform duration-500" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">{feature.title}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
