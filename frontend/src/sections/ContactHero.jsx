import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

export default function ContactHero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[700px] max-h-[900px] flex items-center overflow-hidden pt-[110px] pb-[50px] bg-[#050505]">
      
      {/* Seamless Premium Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-[#0a0a0a] to-[#050505] z-0 pointer-events-none" />

      {/* FULL HERO BACKGROUND VEHICLE (Right Side) */}
      <div className="absolute top-0 right-0 w-full lg:w-[70%] h-full z-0 overflow-hidden pointer-events-none flex items-center justify-end">
        
        {/* Soft Champagne Ambient Lighting */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] bg-[#D4AF37]/10 rounded-full blur-[140px] z-0 mix-blend-screen" />
        
        {/* Vehicle/Showroom Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="relative w-full h-[110%] -right-[2%] lg:-right-[3%] flex items-center"
        >
          <LuxuryImage
            src="https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxoria Showroom"
            className="w-full h-full object-cover object-center scale-[1.02] brightness-75 contrast-125"
            priority={true}
          />
        </motion.div>
        
        {/* Seamless gradient transition */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent w-[100%] lg:w-[60%] left-0 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] to-transparent w-[40%] left-0 z-10" />
      </div>

      <div className="container-luxe relative z-20 grid lg:grid-cols-12 gap-8 items-center h-full">
        
        {/* LEFT CONTENT AREA */}
        <motion.div
          className="col-span-12 lg:col-span-8 xl:col-span-7 flex flex-col justify-center relative z-20 pt-16 lg:pt-0 lg:pr-12"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-5 opacity-95">
             <div className="w-10 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A227] antialiased">
                Concierge Services
             </span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(45px,5vw,75px)] leading-[1.1] font-bold text-white tracking-[-0.01em] mb-9 uppercase flex flex-col antialiased">
            <span className="relative z-10">Let's Create Your</span>
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#C9A227] italic font-normal lowercase text-[clamp(40px,4.5vw,65px)] my-1 translate-x-5 font-serif drop-shadow-[0_2px_15px_rgba(212,175,55,0.15)] tracking-normal">perfect</span>
            <span className="relative z-10">Experience</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[16px] text-white/70 leading-[2.2] mb-12 max-w-[500px] font-normal tracking-[0.02em] antialiased">
            Our concierge specialists are available around the clock to assist you with inquiries, bespoke itineraries, and seamless vehicle arrangements.
          </p>

          {/* CTA SECTION */}
          <div className="flex flex-wrap items-center gap-10 mb-8">
            {/* Primary Button */}
            <a
              href="#contact-form"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-10 py-[18px] bg-white text-[#050505] rounded-[2px] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:-translate-y-[2px] flex items-center gap-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#e5e5e5] via-white to-[#f0f0f0] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
              <span className="relative z-10 font-bold tracking-[0.25em] uppercase text-[11px] transition-colors duration-700 antialiased">Contact Concierge</span>
              <MessageSquare className="relative z-10 w-4 h-4 text-[#050505]/80 group-hover:translate-x-2 transition-all duration-700" />
            </a>

            {/* Secondary Button */}
            <Link 
              to="/experience"
              className="flex items-center gap-6 text-white font-semibold hover:text-[#C9A227] transition-all duration-700 group hover:-translate-y-[2px]"
            >
              <div className="w-[52px] h-[52px] rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#C9A227]/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-700 relative bg-white/5 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <ArrowRight className="w-3.5 h-3.5 relative z-10 text-white/80 group-hover:text-[#C9A227] opacity-90 group-hover:opacity-100 transition-all duration-700" />
              </div>
              <span className="text-[11px] tracking-[0.25em] uppercase relative z-10 font-bold text-white/80 group-hover:text-[#C9A227] transition-colors duration-700 antialiased">Book Experience</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
