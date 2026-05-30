import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Car, Headphones, ShieldCheck } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const TRUST_INDICATORS = [
  { icon: Lock, label: 'Secure Booking' },
  { icon: Car, label: 'Premium Fleet' },
  { icon: Headphones, label: '24/7 Concierge' },
  { icon: ShieldCheck, label: 'Verified Partners' }
];

export default function ExperienceCTA() {
  return (
    <section className="py-[140px] bg-background px-6 lg:px-20">
      <div className="container-luxe mx-auto max-w-[1440px]">
        
        <motion.div 
          className="relative w-full rounded-[40px] overflow-hidden py-24 px-8 lg:px-24 flex flex-col items-center text-center shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background Image & Overlay */}
          <LuxuryImage
            src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Car CTA"
            className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/90" />
          
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-overlay" />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-8 rounded-full bg-accent shadow-[0_0_20px_rgba(201,167,93,0.5)]" />
            </motion.div>

            <motion.h2 
              className="text-[48px] lg:text-[72px] font-bold text-white leading-[1.05] tracking-tight uppercase mb-8 max-w-4xl drop-shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Begin Your <br className="hidden lg:block" />
              <span className="text-accent italic font-light lowercase">Extraordinary</span> Journey Today
            </motion.h2>

            <motion.p 
              className="text-body text-white/80 leading-relaxed max-w-xl mb-14 drop-shadow-md text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience the highest standard of luxury mobility with Luxoria.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link 
                to="/vehicles" 
                className="w-full sm:w-auto btn bg-accent text-white hover:bg-[#B59345] px-10 py-5 rounded-full flex items-center justify-center gap-3 group transition-all duration-300 shadow-[0_0_40px_rgba(201,167,93,0.3)] hover:shadow-[0_0_60px_rgba(201,167,93,0.5)] hover:-translate-y-1"
              >
                <span className="font-bold tracking-widest uppercase text-sm">Book Experience</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/register" 
                className="w-full sm:w-auto btn bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 px-10 py-5 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="font-bold tracking-widest uppercase text-sm">Become Member</span>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-4xl border-t border-white/10 pt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {TRUST_INDICATORS.map((indicator) => (
                <div key={indicator.label} className="flex flex-col items-center text-center">
                  <indicator.icon className="w-6 h-6 text-accent mb-3" />
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{indicator.label}</span>
                </div>
              ))}
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
