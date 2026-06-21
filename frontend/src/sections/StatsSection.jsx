import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { EASE_LUXE } from '@/lib/motion';

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  return (
    <motion.span
      onViewportEnter={() => {
        animate(count, target, { duration: 2, ease: EASE_LUXE });
      }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {prefix}{display.toLocaleString()}
    </motion.span>
  );
}

const STATS = [
  { value: 500, suffix: '+', label: 'Premium Vehicles', description: 'Curated luxury fleet' },
  { value: 12, suffix: 'K+', label: 'Happy Clients', description: 'Across the globe' },
  { value: 45, suffix: '+', label: 'Cities Covered', description: 'Nationwide presence' },
  { value: 200, suffix: '+', label: 'Verified Partners', description: 'Certified excellence' },
];

export default function StatsSection() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="container-luxe">
        
        {/* Animated Premium Header - Left Aligned to match Collection pages */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-12 h-px bg-accent" />
              <span className="text-overline tracking-[0.2em] text-primary">By The Numbers</span>
            </motion.div>
            <motion.h2
              className="text-[48px] lg:text-[64px] font-bold text-primary leading-[1.1] tracking-tight uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              The Scale of <br />
              <span className="text-secondary italic font-light lowercase">excellence</span>
            </motion.h2>
            <motion.p
              className="text-secondary text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover the impressive scale of our curated luxury fleet and the thousands of clients who trust Luxoria worldwide.
            </motion.p>
          </div>
        </div>

        {/* Distinct Floating Cards Grid - Light/Dark Theme Compatible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: EASE_LUXE }}
              className="group relative bg-background border border-border/60 shadow-sm rounded-3xl p-12 text-center overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-lg hover:border-accent/40"
            >
              {/* Card Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="text-[56px] lg:text-[64px] font-bold tracking-tight mb-4 flex justify-center items-baseline font-serif text-primary">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} />
                  <span className="text-accent italic font-light text-[40px] lg:text-[48px] ml-1">{stat.suffix}</span>
                </div>
                
                <div className="w-12 h-px bg-border mx-auto mb-6 group-hover:bg-accent/50 transition-colors duration-500" />
                
                <p className="text-[13px] font-bold text-primary mb-2 tracking-[0.2em] uppercase">{stat.label}</p>
                <p className="text-sm text-secondary font-medium">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
