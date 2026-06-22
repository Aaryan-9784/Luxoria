import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Building2, Award, CheckCircle2, Heart } from 'lucide-react';
import { TRUST_STATS } from '../data/vehiclesPageData';
import { EASE_LUXE, staggerContainer, staggerItem, revealOnScroll } from '@/lib/motion';

const iconMap = {
  Building2, Award, CheckCircle2, Heart
};

export default function TrustCredibility() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.section {...revealOnScroll} className="py-20 bg-background border-y border-border/50">
      <div className="container-luxe">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12" ref={ref}>
          {TRUST_STATS.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Heart;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_LUXE }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
                  {inView ? (
                    <CountUp end={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} duration={2.5} separator="," />
                  ) : (
                    '0'
                  )}
                  <span className="text-accent">{stat.suffix}</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-secondary uppercase tracking-widest">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
