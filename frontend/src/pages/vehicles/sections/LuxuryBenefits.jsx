import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Crown, Headphones, MapPin, Shield, Lock, UserCheck, Star } from 'lucide-react';
import { BENEFITS } from '../data/vehiclesPageData';
import { EASE_LUXE, staggerContainer, staggerItem, revealOnScroll } from '@/lib/motion';

const iconMap = {
  ShieldCheck, Crown, Headphones, MapPin, Shield, Lock, UserCheck, Star
};

function BenefitCard({ benefit }) {
  const Icon = iconMap[benefit.icon] || Star;

  return (
    <motion.div
      variants={staggerItem}
      className="group p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out"
    >
      <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors duration-500">
        <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-500" />
      </div>
      <h3 className="text-lg font-bold text-primary mb-3">{benefit.title}</h3>
      <p className="text-sm text-secondary leading-relaxed">{benefit.description}</p>
    </motion.div>
  );
}

export default function LuxuryBenefits() {
  return (
    <motion.section {...revealOnScroll} className="py-20 md:py-32">
      <div className="container-luxe">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-overline text-accent mb-3 block">The Luxoria Standard</span>
          <h2 className="text-h2 text-primary mb-4">Uncompromising Excellence</h2>
          <p className="text-secondary text-body">
            We don't just provide vehicles; we deliver an end-to-end luxury experience defined by meticulous attention to detail and unparalleled service.
          </p>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
