import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-[140px] bg-background px-6 lg:px-20">
      <div className="container-luxe mx-auto max-w-[1440px]">
        
        <motion.div 
          className="relative w-full rounded-[40px] overflow-hidden bg-primary py-24 px-8 lg:px-24 flex flex-col items-center text-center shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-primary to-[#1a1a1a]" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-8 rounded-full bg-accent" />
            </motion.div>

            <motion.h2 
              className="text-[48px] lg:text-[72px] font-bold text-white leading-[1.05] tracking-tight uppercase mb-8 max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Experience Automotive <br className="hidden lg:block" />
              <span className="text-white/60 italic font-light lowercase">Excellence</span>
            </motion.h2>

            <motion.p 
              className="text-body text-white/50 leading-relaxed max-w-xl mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join an exclusive circle of discerning individuals. Elevate your journey with priority access to our signature fleet and dedicated concierge service.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link 
                to="/register" 
                className="w-full sm:w-auto btn bg-accent text-white hover:bg-[#B59345] px-10 py-5 rounded-full flex items-center justify-center gap-3 group transition-all duration-300 shadow-[0_0_40px_rgba(201,167,93,0.3)] hover:shadow-[0_0_60px_rgba(201,167,93,0.5)] hover:-translate-y-1"
              >
                <span className="font-bold tracking-widest uppercase text-sm">Become Member</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/vehicles" 
                className="w-full sm:w-auto btn bg-white/5 text-white hover:bg-white/10 border border-white/10 px-10 py-5 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="font-bold tracking-widest uppercase text-sm">Browse Fleet</span>
              </Link>
            </motion.div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
