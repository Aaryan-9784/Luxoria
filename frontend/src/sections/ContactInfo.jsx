import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, HeadphonesIcon } from 'lucide-react';

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: 'Phone Support',
    value: '+91 82380 12515',
    subtitle: '24/7 Availability'
  },
  {
    icon: Mail,
    title: 'Email Support',
    value: 'concierge@luxoria.com',
    subtitle: 'Fast Response'
  },
  {
    icon: MapPin,
    title: 'Head Office',
    value: 'Ahmedabad, Gujarat',
    subtitle: 'Premium Location'
  },
  {
    icon: HeadphonesIcon,
    title: 'Live Concierge',
    value: 'Available Anytime',
    subtitle: 'Instant Assistance'
  }
];

export default function ContactInfo() {
  return (
    <section className="py-[140px] bg-white relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        
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
            <span className="text-overline tracking-[0.2em] text-primary">Get In Touch</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Contact <span className="text-secondary italic font-light lowercase">Information</span>
          </motion.h2>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CONTACT_METHODS.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group p-8 bg-surface border border-border hover:border-accent/30 rounded-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-all duration-500 border border-border relative z-10">
                  <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 uppercase tracking-widest relative z-10">{method.title}</h3>
                <p className="text-xl font-medium text-secondary mb-2 relative z-10">{method.value}</p>
                <p className="text-sm text-accent/80 font-bold uppercase tracking-widest relative z-10">{method.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
