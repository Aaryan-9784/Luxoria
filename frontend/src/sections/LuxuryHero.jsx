import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

export default function LuxuryHero() {
  return (
    <section className="relative w-full h-[100vh] min-h-[820px] max-h-[1080px] flex items-center overflow-hidden pt-[110px] pb-[50px] bg-white">
      
      {/* Seamless Premium Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffffff] via-[#fdfdfd] to-[#f7f7f8] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-transparent to-[#D4AF37]/5 z-0 pointer-events-none" />

      {/* FULL HERO BACKGROUND VEHICLE (Right Side) */}
      <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full z-0 overflow-hidden pointer-events-none flex items-center justify-end">
        
        {/* Soft Champagne Ambient Lighting */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] bg-[#D4AF37]/8 rounded-full blur-[140px] z-0 mix-blend-overlay" />
        <div className="absolute top-[35%] right-[20%] w-[35vw] h-[35vw] max-w-[550px] max-h-[550px] bg-white rounded-full blur-[100px] z-0 opacity-95" />
        
        {/* Elegant Shadow beneath vehicle */}
        <div className="absolute bottom-[18%] right-[10%] w-[45vw] h-[12vw] bg-black/20 rounded-[100%] blur-[35px] z-0" />
        
        {/* Vehicle Image - Increased Clarity */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="relative w-full h-[110%] -right-[2%] lg:-right-[3%] flex items-center"
        >
          <LuxuryImage
            src="https://images.unsplash.com/photo-1632245889029-e406faaa34cd?q=80&w=2070&auto=format&fit=crop" 
            alt="Rolls-Royce"
            className="w-full h-full object-cover object-center scale-[1.02] brightness-[1.05] contrast-[1.12]"
            priority={true}
          />
        </motion.div>
        
        {/* Cinematic Blend & Overlays - Removed hard lines & center divider */}
        <div className="absolute top-[35%] right-[25%] w-[200px] h-[200px] bg-[#ffffff] rounded-full blur-[80px] mix-blend-overlay opacity-50" />
        
        {/* Seamless gradient transition - completely invisible boundary */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] via-[#ffffff]/90 to-transparent w-[100%] lg:w-[50%] left-0 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent w-[30%] left-0 z-10" />
        
        {/* Soft reflection without hard lines */}
        <div className="absolute top-0 right-[15%] w-[150px] h-full bg-white/5 backdrop-blur-[1px] transform rotate-[15deg] opacity-30 z-20 pointer-events-none mix-blend-overlay" />
      </div>

      <div className="container-luxe relative z-20 grid lg:grid-cols-12 gap-8 items-center h-full">
        
        {/* LEFT CONTENT AREA */}
        <motion.div
          className="col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col justify-center relative z-20 pt-16 lg:pt-0 lg:pr-12"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow - Fixed spacing and alignment */}
          <div className="flex items-center gap-4 mb-5 opacity-95">
             <div className="w-10 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A227] antialiased">
                Exclusive Automotive Collection
             </span>
          </div>

          {/* Headline - Refined typography */}
          <h1 className="text-[clamp(55px,6vw,85px)] leading-[1.1] font-bold text-[#0A0A0A] tracking-[-0.01em] mb-9 uppercase flex flex-col antialiased drop-shadow-[0_10px_30px_rgba(255,255,255,0.9)]">
            <span className="relative z-10">DRIVE</span>
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#C9A227] italic font-normal lowercase text-[clamp(50px,5.5vw,75px)] my-1 translate-x-5 font-serif drop-shadow-[0_2px_15px_rgba(212,175,55,0.15)] tracking-normal">the</span>
            <span className="relative z-10">EXCEPTIONAL</span>
          </h1>

          {/* Subheadline - Luxury brochure quality */}
          <p className="text-[16px] text-[#6B6B6B] leading-[2.2] mb-12 max-w-[500px] font-normal tracking-[0.02em] antialiased">
            Curated access to the world's most prestigious automotive experiences, reserved for discerning members.
          </p>

          {/* CTA SECTION */}
          <div className="flex flex-wrap items-center gap-10 mb-8">
            {/* Primary Button */}
            <Link
              to="/vehicles"
              className="group relative px-10 py-[18px] bg-[#050505] text-white rounded-[2px] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-[2px] flex items-center gap-6 border border-[#050505] hover:border-[#D4AF37]/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#050505] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
              <span className="relative z-10 font-bold tracking-[0.25em] uppercase text-[11px] group-hover:text-[#E5C76B] transition-colors duration-700 antialiased">Browse Collection</span>
              <ArrowRight className="relative z-10 w-4 h-4 text-white/80 group-hover:text-[#E5C76B] group-hover:translate-x-2 transition-all duration-700" />
            </Link>

            {/* Secondary Button */}
            <button className="flex items-center gap-6 text-[#050505] font-semibold hover:text-[#C9A227] transition-all duration-700 group hover:-translate-y-[2px]">
              <div className="w-[52px] h-[52px] rounded-full border border-white/40 flex items-center justify-center group-hover:border-[#C9A227]/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-700 relative bg-white/40 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Play className="w-3.5 h-3.5 translate-x-0.5 relative z-10 fill-[#050505]/80 group-hover:fill-[#C9A227] opacity-90 group-hover:opacity-100 transition-all duration-700" />
              </div>
              <span className="text-[11px] tracking-[0.25em] uppercase relative z-10 font-bold text-[#050505]/80 group-hover:text-[#C9A227] transition-colors duration-700 antialiased">Watch Experience</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
