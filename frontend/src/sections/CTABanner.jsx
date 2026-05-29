import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE_LUXE } from '@/lib/motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTABanner() {
  const { scrollYProgress } = useScroll();
  const yImage1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yImage2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Deep cinematic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-gradient-to-r from-accent/20 via-transparent to-accent/20 rounded-full blur-[200px] opacity-[0.15] pointer-events-none" />
      
      {/* Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: yImage1 }} className="absolute -left-20 top-10 opacity-40 blur-[2px] hidden lg:block">
          <img src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=400" alt="Luxury Car Detail" className="w-[400px] rounded-[3rem] transform -rotate-12" />
        </motion.div>
        <motion.div style={{ y: yImage2 }} className="absolute -right-20 bottom-10 opacity-40 blur-[2px] hidden lg:block">
          <img src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=400" alt="Luxury Interior Detail" className="w-[400px] rounded-[3rem] transform rotate-12" />
        </motion.div>
      </div>

      <div className="container-luxe relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="text-center max-w-4xl mx-auto glass-dark border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden"
        >
          {/* Inner card glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mx-auto mb-8 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-20" />
            <Sparkles className="w-8 h-8 text-accent" />
          </div>

          <h2 className="text-display text-white mb-6 leading-[1.1] font-light">
             Begin Your <span className="text-gradient-gold font-bold italic">Journey.</span>
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            The extraordinary awaits. Join the world's most discerning individuals who choose Luxoria for an unparalleled driving experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/vehicles" className="relative group overflow-hidden rounded-full p-[2px]">
              <span className="absolute inset-0 bg-gradient-to-r from-accent via-white/50 to-accent rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              <div className="relative flex items-center gap-3 px-10 py-5 bg-background rounded-full transition-all group-hover:bg-primary">
                <span className="text-body font-bold text-white uppercase tracking-widest group-hover:text-accent transition-colors">Reserve Now</span>
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
            <Link to="/register" className="btn btn-outline border-white/20 text-white hover:bg-white hover:text-primary btn-xl rounded-full px-10">
              Become a Member
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
