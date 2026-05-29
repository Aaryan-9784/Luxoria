import React from 'react';
import { motion } from 'framer-motion';
import LuxuryImage from '@/components/ui/LuxuryImage';

export default function LuxuryStorytelling() {
  return (
    <section className="py-[140px] bg-background">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Image (16:10 Ratio) */}
          <motion.div
            className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LuxuryImage
              src="https://images.unsplash.com/photo-1616422285623-14ff0160d5b4?q=80&w=2070&auto=format&fit=crop"
              alt="Bentley Flying Spur at Luxury Estate"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          </motion.div>

          {/* Right: Editorial Copy */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-12 h-px bg-accent" />
              <span className="text-overline tracking-[0.2em] text-primary">The Heritage</span>
            </div>

            <h2 className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight mb-8">
              Redefining <br />
              Automotive <br />
              <span className="text-secondary italic font-light lowercase">Excellence</span>
            </h2>

            <p className="text-body text-secondary leading-relaxed mb-12 max-w-lg">
              Since our inception, Luxoria has been synonymous with the pinnacle of automotive prestige.
              We don't just provide vehicles; we engineer unforgettable moments.
              Every journey with us is a statement of uncompromising quality and refined taste,
              curated for those who demand nothing but the absolute best.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-3xl font-bold text-primary mb-2">98%</p>
                <p className="text-caption text-secondary uppercase tracking-widest">Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">12k+</p>
                <p className="text-caption text-secondary uppercase tracking-widest">Rentals</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">24/7</p>
                <p className="text-caption text-secondary uppercase tracking-widest">Concierge</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
