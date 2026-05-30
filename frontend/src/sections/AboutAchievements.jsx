import React from 'react';
import { motion } from 'framer-motion';

const ACHIEVEMENTS = [
  { value: '100+', label: 'Premium Vehicles' },
  { value: '500+', label: 'Luxury Experiences' },
  { value: '50+', label: 'Cities Worldwide' },
  { value: '98%', label: 'Satisfaction Rate' }
];

export default function AboutAchievements() {
  return (
    <section className="py-[100px] bg-primary relative overflow-hidden text-white">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay z-0"></div>

      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px] relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-x divide-white/10">
          {ACHIEVEMENTS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="flex flex-col items-center text-center px-4"
            >
              <h3 className="text-[50px] lg:text-[70px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#C9A227] leading-none mb-4 font-serif italic tracking-tight drop-shadow-[0_2px_15px_rgba(212,175,55,0.2)]">
                {item.value}
              </h3>
              <p className="text-sm lg:text-base font-bold uppercase tracking-[0.2em] text-white/80">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
