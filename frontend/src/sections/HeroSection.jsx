import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Shield, Award, Clock, Star, ArrowRight, Play } from 'lucide-react';
import { EASE_LUXE, staggerContainer, staggerItem } from '@/lib/motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-primary pt-24">
      {/* ── Cinematic Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2560"
            alt="Luxury vehicle on scenic road"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        
        {/* Overlays: Gradient, Vignette, Film Grain */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />
        {/* Film Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* ── Content ── */}
      <div className="container-luxe relative z-10 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
        
        {/* Left Column: Typography & CTAs */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="w-full lg:w-[55%] flex flex-col items-start text-left"
        >
          {/* Overline Badge */}
          <motion.div variants={staggerItem}>
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass-dark text-accent text-overline mb-8 border border-white/10 shadow-glow-gold">
              <Award className="w-3.5 h-3.5" />
              Rated #1 Luxury Rental Experience
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={staggerItem} className="text-display text-white mb-6 font-light">
            <span className="font-bold">EXPERIENCE</span> <br />
            <span className="text-gradient-gold font-light tracking-wide">LUXURY</span> <br />
            <span className="font-thin">REDEFINED</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p variants={staggerItem} className="text-lg text-white/70 max-w-xl mb-12 font-light leading-relaxed">
            Discover our curated collection of the world's most prestigious vehicles.
            Designed for those who demand nothing but the absolute best in automotive engineering and comfort.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-4 mb-16">
            <Link
              to="/vehicles"
              className="btn btn-accent btn-lg rounded-full px-8 shadow-glow-gold hover:-translate-y-1 transition-transform relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-[#F3E5AB] to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                Browse Fleet <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <button className="btn btn-ghost btn-lg rounded-full px-8 text-white hover:bg-white/10 flex items-center gap-2 group">
              <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors">
                <Play className="w-4 h-4 ml-1" />
              </span>
              Watch Experience
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-6 lg:gap-10 text-white/40">
            {[
              { label: '12,000+ Elite Clients', bold: '12,000+' },
              { label: '500+ Premium Vehicles', bold: '500+' },
              { label: '45+ Cities', bold: '45+' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-white text-body font-semibold">{stat.bold}</span>
                <span className="text-caption tracking-wider uppercase text-white/50">{stat.label.replace(stat.bold, '').trim()}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Booking Console & Floating Cards */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_LUXE }}
          className="w-full lg:w-[45%] relative"
        >
          {/* Floating Trust Card */}
          <div className="absolute -top-12 -right-8 glass-card-elevated p-4 rounded-2xl z-20 hidden md:flex items-center gap-4 animate-float border border-white/20">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-accent fill-accent" />
            </div>
            <div>
              <p className="text-primary font-bold text-body-sm">4.9/5 Rating</p>
              <p className="text-muted text-caption">Based on 2,500+ reviews</p>
            </div>
          </div>

          {/* Luxury Booking Console */}
          <div className="glass-card-elevated p-8 rounded-3xl border border-white/30 shadow-float relative z-10 w-full max-w-md ml-auto">
            <h3 className="text-h4 text-primary mb-6 font-bold flex items-center gap-2">
              <Search className="w-5 h-5 text-accent" /> Reserve Your Experience
            </h3>
            
            <div className="flex flex-col gap-4">
              {/* Location Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Pickup Location"
                  className="w-full bg-surface border border-border/50 rounded-xl py-3.5 pl-12 pr-4 text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                />
              </div>

              {/* Date Inputs - Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Pickup Date"
                    className="w-full bg-surface border border-border/50 rounded-xl py-3.5 pl-9 pr-3 text-primary placeholder:text-muted text-body-sm focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Return Date"
                    className="w-full bg-surface border border-border/50 rounded-xl py-3.5 pl-9 pr-3 text-primary placeholder:text-muted text-body-sm focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <select className="w-full bg-surface border border-border/50 rounded-xl py-3.5 pl-12 pr-4 text-primary focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all appearance-none cursor-pointer">
                  <option value="" disabled selected className="text-muted">Select Vehicle Type</option>
                  <option value="sports">Sports Cars</option>
                  <option value="suv">Luxury SUVs</option>
                  <option value="sedan">Premium Sedans</option>
                  <option value="exotic">Exotic</option>
                </select>
              </div>

              <Link
                to="/vehicles"
                className="btn btn-primary btn-lg w-full rounded-xl mt-2 relative overflow-hidden group shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Search className="w-5 h-5 mr-2" /> Find Available Vehicles
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-caption text-secondary">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Fully Insured</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24/7 Concierge</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
