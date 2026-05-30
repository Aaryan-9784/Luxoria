import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Gem, ShieldCheck, Lightbulb, Crown, Heart, Clock } from 'lucide-react';

const VALUES = [
  { icon: Gem, title: 'Excellence' },
  { icon: ShieldCheck, title: 'Trust' },
  { icon: Lightbulb, title: 'Innovation' },
  { icon: Crown, title: 'Luxury' },
  { icon: Heart, title: 'Customer First' },
  { icon: Clock, title: 'Reliability' },
];

export default function AboutMission() {
  return (
    <section className="py-[140px] bg-surface relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-surface to-surface z-0 pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px] relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">Purpose & Ambition</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Mission & <span className="text-secondary italic font-light lowercase">Vision</span>
          </motion.h2>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group p-12 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-8 shadow-lg group-hover:bg-[#D4AF37] transition-colors duration-500">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4 tracking-tight">Our Mission</h3>
              <p className="text-[#6B6B6B] text-lg leading-relaxed">
                To deliver world-class luxury mobility experiences by providing unparalleled access to the finest vehicles, complemented by impeccable, personalized service that anticipates every desire.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group p-12 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-8 shadow-lg group-hover:bg-[#D4AF37] transition-colors duration-500">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4 tracking-tight">Our Vision</h3>
              <p className="text-[#6B6B6B] text-lg leading-relaxed">
                To become the world's most trusted and prestigious luxury automotive platform, setting the global standard for mobility excellence, exclusivity, and unforgettable experiences.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-primary tracking-wide uppercase mb-2">Core Values</h3>
          <div className="w-16 h-px bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {VALUES.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-white/50 backdrop-blur-md border border-white/40 rounded-sm hover:bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group cursor-default"
              >
                <Icon className="w-8 h-8 text-primary mb-4 group-hover:text-accent transition-colors duration-300" />
                <span className="text-sm font-bold text-primary uppercase tracking-widest text-center">{value.title}</span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
