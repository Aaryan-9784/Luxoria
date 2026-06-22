import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
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
          src="https://www.williamloughran.co.uk/media/8006/ferrari-812-competizione-2339-1.jpg"
          alt="Luxury vehicle cinematic"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradients for text legibility and smooth blending */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/30 to-black/90" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 z-[1] bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent/5 blur-[100px] animate-float z-[1]" />
      <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-accent/3 blur-[120px] z-[1]" style={{ animationDelay: '3s' }} />

      {/* Main Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-5xl mx-auto px-6 mt-16 md:mt-24">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE_LUXE }}
          className="text-[clamp(3.5rem,6vw,6rem)] font-black leading-tight tracking-tight uppercase text-white mb-6"
        >
          DRIVE <span className="lowercase italic font-light text-gradient-gold pr-4">extraordinary</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE_LUXE }}
          className="text-sm md:text-base text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Curated luxury, performance and prestige vehicles for every exceptional journey.
        </motion.p>



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
        className="absolute bottom-[5.5rem] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
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
