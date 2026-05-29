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
      {prefix}{display.toLocaleString()}{suffix}
    </motion.span>
  );
}

const STATS = [
  { value: 500, suffix: '+', label: 'Premium Vehicles', description: 'Curated luxury fleet' },
  { value: 12000, suffix: '+', label: 'Happy Clients', description: 'Across the globe' },
  { value: 45, suffix: '+', label: 'Cities Covered', description: 'Nationwide presence' },
  { value: 200, suffix: '+', label: 'Verified Vendors', description: 'Certified partners' },
];

export default function StatsSection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden border-y border-white/10">
      {/* Subtle gold accent and background glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent rounded-full blur-[250px] opacity-[0.08] pointer-events-none" />

      <div className="container-luxe relative z-10">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 rounded-3xl overflow-hidden glass-dark border border-white/10 shadow-2xl relative"
        >
          {/* Glass highlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_LUXE }}
              className={`p-10 md:p-14 text-center relative ${
                i !== STATS.length - 1 ? 'lg:border-r border-white/10' : ''
              } ${
                i % 2 === 0 ? 'md:border-r border-white/10 lg:border-r' : ''
              } ${
                i < 2 ? 'border-b border-white/10 lg:border-b-0' : ''
              }`}
            >
              <div className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white mb-4 tracking-tight drop-shadow-md flex items-center justify-center">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-body font-bold text-accent mb-2 tracking-widest uppercase">{stat.label}</p>
              <p className="text-caption text-white/50">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
