import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { id: '01', title: 'Select Your Vehicle' },
  { id: '02', title: 'Customize Experience' },
  { id: '03', title: 'Confirm Booking' },
  { id: '04', title: 'Vehicle Delivery' },
  { id: '05', title: 'Enjoy Journey' },
  { id: '06', title: 'VIP Support' }
];

export default function ExperienceTimeline() {
  return (
    <section className="py-[140px] bg-surface relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px] relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">The Process</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            How the Experience <span className="text-secondary italic font-light lowercase">Works</span>
          </motion.h2>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-12 md:space-y-24">
            {STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={step.id}
                  className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Content Box */}
                  <div className="w-full md:w-[45%] flex flex-col group relative">
                    <div className="p-8 bg-white border border-border/50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative z-10">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                      <div className="text-accent text-lg font-bold tracking-[0.2em] mb-2">STEP {step.id}</div>
                      <h3 className="text-2xl font-bold text-primary">{step.title}</h3>
                    </div>
                  </div>

                  {/* Center Marker */}
                  <div className="relative hidden md:flex w-10 h-10 items-center justify-center z-10">
                    <div className="w-4 h-4 rounded-full bg-primary z-10" />
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1.5, opacity: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>

                  {/* Empty Spacer */}
                  <div className="hidden md:block w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
