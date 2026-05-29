import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Play, ArrowRight, CalendarCheck, Crown } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

export default function LuxuryHero() {
  return (
    <section className="relative w-full h-[100vh] min-h-[820px] max-h-[980px] flex items-center bg-background overflow-hidden pt-[110px] pb-[50px]">

      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-surface/50 rounded-bl-[100px] z-0" />
      <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] z-0" />

      <div className="container-luxe relative z-10 grid lg:grid-cols-2 gap-[60px] items-center h-full">

        {/* Left: Editorial Content */}
        <motion.div
          className="flex flex-col justify-center max-w-xl xl:max-w-2xl relative z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="w-12 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">Unrivaled Automotive Excellence</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-[clamp(72px,7vw,92px)] leading-[0.9] font-bold text-primary tracking-[-0.04em] mb-6 uppercase">
            Drive <br />
            <span className="text-secondary italic font-light lowercase">the</span> <br />
            Exceptional
          </h1>

          <p className="text-body text-secondary leading-relaxed mb-8 max-w-[480px]">
            Curated collection of the world's most prestigious vehicles.
            Experience unparalleled luxury, performance, and white-glove service.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/vehicles"
              className="btn bg-primary text-white hover:bg-[#222] px-8 py-4 rounded-full flex items-center gap-3 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <span className="font-semibold tracking-wide uppercase text-sm">Browse Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center gap-4 text-primary font-medium hover:text-accent transition-colors group">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-accent transition-colors">
                <Play className="w-4 h-4 translate-x-0.5" />
              </div>
              <span className="text-sm tracking-wide uppercase">Watch Experience</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 border-t border-border mt-[40px] pt-6">
            <div>
              <p className="text-2xl font-bold text-primary mb-1">12k+</p>
              <p className="text-caption text-secondary uppercase tracking-widest">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary mb-1">500+</p>
              <p className="text-caption text-secondary uppercase tracking-widest">Vehicles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary mb-1">45</p>
              <p className="text-caption text-secondary uppercase tracking-widest">Cities</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Vehicle Image (16:10 Ratio) & Floating Cards */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Image Container 16:10 */}
          <div
            className="relative w-[90%] max-w-[620px] aspect-[16/10] rounded-[40px] overflow-hidden z-10 mx-auto lg:mr-0"
            style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.12)' }}
          >
            <LuxuryImage
              src="https://images.unsplash.com/photo-1631262562208-8e6f1f51cb32?q=80&w=2070&auto=format&fit=crop"
              alt="Rolls Royce Spectre"
              className="w-full h-full object-cover object-center"
              priority={true}
            />
            {/* Premium Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
          </div>

          {/* Floating Card: Top Left */}
          <motion.div
            className="absolute top-[5%] -left-4 lg:-left-12 bg-white/90 backdrop-blur-xl p-4 scale-[0.85] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/40 z-20 flex flex-col gap-1 origin-top-left"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex text-accent mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-body-sm font-bold text-primary">4.9/5 Rating</p>
            <p className="text-[10px] text-secondary uppercase tracking-wider">12,000+ Members</p>
          </motion.div>

          {/* Floating Card: Top Right */}
          <motion.div
            className="absolute top-[15%] -right-2 lg:-right-8 bg-white/90 backdrop-blur-xl p-4 scale-[0.85] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/40 z-20 flex items-center gap-4 origin-top-right"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-primary">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-body-sm font-bold text-primary">Available Today</p>
              <p className="text-[10px] text-secondary uppercase tracking-wider">500+ Vehicles</p>
            </div>
          </motion.div>

          {/* Floating Card: Bottom Left */}
          <motion.div
            className="absolute -bottom-6 left-[10%] bg-white/90 backdrop-blur-xl p-4 scale-[0.85] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/40 z-20 flex items-center gap-4 origin-bottom-left"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-body-sm font-bold text-primary">Global Delivery</p>
              <p className="text-[10px] text-secondary uppercase tracking-wider">45 Cities</p>
            </div>
          </motion.div>

          {/* Floating Card: Bottom Right */}
          <motion.div
            className="absolute bottom-[5%] -right-4 lg:-right-4 bg-white/90 backdrop-blur-xl p-4 scale-[0.85] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/40 z-20 flex items-center gap-4 origin-bottom-right"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-primary">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-body-sm font-bold text-primary">White Glove</p>
              <p className="text-[10px] text-secondary uppercase tracking-wider">24/7 Concierge</p>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
