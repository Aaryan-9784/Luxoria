import React from 'react';
import { motion } from 'framer-motion';
import { EASE_LUXE, staggerContainer, staggerItem } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/Typography';
import { Car, Clock, Shield, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  { 
    icon: Car, 
    title: 'Premium Fleet', 
    desc: 'Over 500 luxury vehicles from Porsche, Rolls Royce, Lamborghini, and the world\'s most prestigious marques.',
    stat: '500+ Vehicles',
    isLarge: true,
    img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
  },
  { 
    icon: Clock, 
    title: 'Instant Booking', 
    desc: 'Reserve your dream car in under 60 seconds. No paperwork, no waiting — pure digital elegance.',
    stat: '< 60s Booking',
    isLarge: true,
    img: 'https://images.unsplash.com/photo-1614026480418-2e008d5b8393?auto=format&fit=crop&q=80&w=800'
  },
  { 
    icon: ShieldCheck, 
    title: 'Verified Vendors', 
    desc: 'Every vendor is vetted and certified for peace of mind.',
    stat: '100% Certified',
    isLarge: false
  },
  { 
    icon: Shield, 
    title: 'Fully Insured', 
    desc: 'Comprehensive coverage on every rental for absolute confidence.',
    stat: '$5M Coverage',
    isLarge: false
  },
  { 
    icon: Headphones, 
    title: '24/7 Concierge', 
    desc: 'Personal concierge available around the clock.',
    stat: 'White-Glove',
    isLarge: false
  },
  { 
    icon: CreditCard, 
    title: 'Secure Payments', 
    desc: 'Bank-grade encryption. Transparent pricing with no hidden fees.',
    stat: '256-bit Secure',
    isLarge: false
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-spacing bg-surface relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px] opacity-[0.15] pointer-events-none" />

      <div className="container-luxe relative z-10">
        <SectionHeader
          overline="Why Luxoria"
          title="The Art of Effortless Luxury"
          description="Every detail is crafted for perfection — from the vehicles we curate to the experience we deliver."
          align="center"
        />

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className={cn(
                "group relative rounded-3xl overflow-hidden border border-border bg-background hover:shadow-card-hover transition-all duration-500",
                feat.isLarge ? "md:col-span-2 lg:col-span-2 row-span-2 min-h-[360px]" : "col-span-1 min-h-[220px]"
              )}
            >
              {feat.img && (
                <div className="absolute inset-0 z-0">
                  <img src={feat.img} alt={feat.title} className="w-full h-full object-cover opacity-[0.15] group-hover:opacity-[0.25] group-hover:scale-105 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>
              )}
              
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center group-hover:bg-accent group-hover:shadow-glow-gold transition-all duration-500 border border-border">
                    <feat.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="glass-card px-3 py-1.5 rounded-full border border-border">
                    <span className="text-caption font-bold text-primary">{feat.stat}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className={cn("font-bold text-primary mb-3", feat.isLarge ? "text-h3" : "text-h4")}>
                    {feat.title}
                  </h3>
                  <p className="text-body-sm text-secondary leading-relaxed max-w-md">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
