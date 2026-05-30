import React from 'react';
import { motion } from 'framer-motion';
import LuxuryImage from '@/components/ui/LuxuryImage';

const TIMELINE = [
  { year: '2020', title: 'Founded', desc: 'Luxoria was established with a singular vision to redefine luxury mobility.' },
  { year: '2021', title: 'Expanded Fleet', desc: 'Introduced hypercars and exclusive limited-edition vehicles to the collection.' },
  { year: '2022', title: 'VIP Membership', desc: 'Launched our exclusive membership program offering unparalleled benefits.' },
  { year: '2023', title: 'Global Growth', desc: 'Expanded operations to major international luxury hubs including Dubai & Monaco.' },
  { year: '2024', title: 'Premium Platform', desc: 'Unveiled our next-generation digital booking and concierge platform.' },
];

export default function AboutStory() {
  return (
    <section className="py-[140px] bg-white relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          
          {/* Left: Premium Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full aspect-[4/5] rounded-[2px] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-black/10 z-10 transition-opacity duration-700 group-hover:opacity-0" />
            <LuxuryImage 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop"
              alt="Luxoria Heritage"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            {/* Decorative Elements */}
            <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-white/40 z-20" />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-white/40 z-20" />
          </motion.div>

          {/* Right: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
               <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A227]">Our Journey</span>
            </div>
            
            <h2 className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase mb-8">
              A Legacy of <span className="text-secondary italic font-light lowercase">Excellence</span>
            </h2>

            <p className="text-[#6B6B6B] text-lg leading-relaxed mb-12">
              Luxoria was born from a profound passion for automotive excellence and a desire to deliver unforgettable driving experiences. Our commitment to perfection drives every aspect of our service, from our meticulously curated fleet to our personalized white-glove concierge. We do not just rent cars; we orchestrate moments of pure luxury.
            </p>

            {/* Timeline */}
            <div className="relative pl-6 border-l border-black/10 space-y-10">
              {TIMELINE.map((item, index) => (
                <motion.div 
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
                  
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2">
                    <span className="text-[#C9A227] font-bold tracking-widest text-lg">{item.year}</span>
                    <h4 className="text-primary font-bold text-xl">{item.title}</h4>
                  </div>
                  <p className="text-[#6B6B6B] leading-relaxed max-w-md">{item.desc}</p>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
