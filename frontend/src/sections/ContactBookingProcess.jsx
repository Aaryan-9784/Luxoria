import React from 'react';
import { motion } from 'framer-motion';
import { Send, PhoneCall, Car, CalendarCheck, Key } from 'lucide-react';

const STEPS = [
  { icon: Send, title: 'Submit Inquiry', desc: 'Provide your details and preferences.' },
  { icon: PhoneCall, title: 'Personal Consultation', desc: 'Our concierge will contact you to curate your experience.' },
  { icon: Car, title: 'Vehicle Selection', desc: 'Finalize the perfect vehicle for your journey.' },
  { icon: CalendarCheck, title: 'Booking Confirmation', desc: 'Secure your reservation with seamless payment.' },
  { icon: Key, title: 'Luxury Delivery', desc: 'White-glove handover at your preferred location.' }
];

export default function ContactBookingProcess() {
  return (
    <section className="py-[140px] bg-white relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        
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
            <span className="text-overline tracking-[0.2em] text-primary">Effortless Journey</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Booking <span className="text-secondary italic font-light lowercase">Assistance</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-border z-0">
            <div className="h-full bg-accent w-0" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-4 relative z-10">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative">
                    {/* Circle Background */}
                    <div className="w-20 h-20 rounded-full bg-surface border-2 border-border flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-500 relative z-10 bg-white">
                      <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold border-2 border-white z-20">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-primary mb-3 tracking-wide">{step.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed max-w-[200px]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
