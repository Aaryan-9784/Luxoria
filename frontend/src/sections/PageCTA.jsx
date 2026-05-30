import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

export default function PageCTA({ 
  bgImage, 
  headline, 
  subheadline, 
  primaryBtnText, 
  primaryBtnLink, 
  secondaryBtnText, 
  secondaryBtnLink,
  secondaryBtnIcon: SecondaryIcon = Sparkles
}) {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-primary">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <LuxuryImage
          src={bgImage}
          alt="Luxury CTA"
          className="w-full h-full object-cover opacity-50 transition-transform duration-[2s] hover:scale-105"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none" />
      </div>

      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px] relative z-10 text-center flex flex-col items-center">
        <motion.h2 
          className="text-[40px] md:text-[50px] lg:text-[70px] font-bold text-white leading-[1.1] tracking-tight uppercase max-w-4xl mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {headline}
        </motion.h2>

        <motion.p
          className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Primary Button */}
          <Link
            to={primaryBtnLink}
            className="group relative px-10 py-[18px] bg-[#D4AF37] text-white rounded-[2px] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(212,175,55,0.6)] hover:-translate-y-[2px] flex items-center gap-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#E5C76B] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
            <span className="relative z-10 font-bold tracking-[0.25em] uppercase text-[11px] group-hover:text-white transition-colors duration-700 antialiased">{primaryBtnText}</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-white group-hover:translate-x-2 transition-transform duration-700" />
          </Link>

          {/* Secondary Button */}
          <Link 
            to={secondaryBtnLink}
            className="flex items-center gap-6 text-white font-semibold hover:text-[#D4AF37] transition-all duration-700 group hover:-translate-y-[2px]"
          >
            <div className="w-[52px] h-[52px] rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#D4AF37]/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-700 relative bg-white/10 backdrop-blur-md">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/0 to-[#D4AF37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <SecondaryIcon className="w-4 h-4 relative z-10 text-white group-hover:text-[#D4AF37] opacity-90 group-hover:opacity-100 transition-all duration-700" />
            </div>
            <span className="text-[11px] tracking-[0.25em] uppercase relative z-10 font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-700 antialiased">{secondaryBtnText}</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
