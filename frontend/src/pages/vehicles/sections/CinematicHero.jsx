import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { EASE_LUXE } from '@/lib/motion';
import { HERO_STATS } from '../data/vehiclesPageData';

export default function CinematicHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const scrollToCollection = () => {
    const el = document.getElementById('vehicle-collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=2560"
          alt="Luxury vehicle cinematic"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent/5 blur-[100px] animate-float z-[1]" />
      <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-accent/3 blur-[120px] z-[1]" style={{ animationDelay: '3s' }} />

      {/* Main Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXE }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/80">
            Exclusive Vehicle Collection
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE_LUXE }}
          className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white mb-6"
        >
          Drive{' '}
          <span className="text-gradient-gold inline-block">Extraordinary</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE_LUXE }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Curated luxury, performance and prestige vehicles for every exceptional journey.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE_LUXE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={scrollToCollection}
            className="group relative px-8 py-4 bg-white text-black font-semibold text-sm tracking-wide rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105"
          >
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-hover translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              Explore Collection
            </span>
          </button>

          <Link
            to="/contact"
            className="px-8 py-4 border border-white/20 text-white font-semibold text-sm tracking-wide rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-500"
          >
            Luxury Concierge
          </Link>
        </motion.div>

        {/* Animated Statistics */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE_LUXE }}
          className="flex items-center justify-center gap-8 md:gap-16"
        >
          {HERO_STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {statsInView ? (
                  <CountUp end={stat.value} duration={2.5} delay={i * 0.2} separator="," />
                ) : (
                  '0'
                )}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <div className="text-[11px] text-white/50 uppercase tracking-[0.15em] mt-1.5 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
        onClick={scrollToCollection}
      >
        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
