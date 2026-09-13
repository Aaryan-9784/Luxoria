import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function WatchCTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative py-32 md:py-48 overflow-hidden" ref={ref}>
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury vehicle back view" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container-luxe relative z-20 text-center text-white">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <motion.span variants={fadeUp} className="uppercase tracking-[0.3em] text-sm font-light text-white/80 mb-6 block">
            Begin Your Journey
          </motion.span>
          
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8">
            Ready To Experience <br className="hidden md:block"/> Extraordinary?
          </motion.h2>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-6 mt-8">
            <Link 
              to="/collection"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium tracking-wide hover:bg-gray-100 transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Browse Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/vehicles"
              className="px-8 py-4 bg-transparent border border-white text-white rounded-full font-medium tracking-wide hover:bg-white/10 transition-colors w-full sm:w-auto justify-center text-center"
            >
              Book Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
