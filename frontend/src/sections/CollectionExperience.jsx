import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Plane, HeadphonesIcon, Award } from 'lucide-react';

const experiences = [
  {
    icon: <ShieldCheck size={32} strokeWidth={1.5} />,
    title: "Fully Insured",
    desc: "Comprehensive premium coverage included with every reservation for absolute peace of mind."
  },
  {
    icon: <Clock size={32} strokeWidth={1.5} />,
    title: "24/7 Concierge",
    desc: "Dedicated personal concierge available around the clock to handle your bespoke requests."
  },
  {
    icon: <Plane size={32} strokeWidth={1.5} />,
    title: "Airport Delivery",
    desc: "Seamless handover directly at the private terminal or arrival gate of your choice."
  },
  {
    icon: <Award size={32} strokeWidth={1.5} />,
    title: "Chauffeur Available",
    desc: "Experience ultimate relaxation with our elite team of professional, discreet drivers."
  },
  {
    icon: <HeadphonesIcon size={32} strokeWidth={1.5} />,
    title: "VIP Support",
    desc: "Priority routing for all communications and expedited on-road assistance globally."
  }
];

export default function CollectionExperience() {
  return (
    <section className="py-[140px] bg-background relative overflow-hidden">
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
            <span className="text-overline tracking-[0.2em] text-primary">The Luxoria Standard</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Beyond the <span className="text-secondary italic font-light lowercase">Drive</span>
          </motion.h2>
          <motion.p 
            className="text-secondary text-lg leading-relaxed max-w-2xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Every vehicle in our collection comes with white-glove service designed to exceed the expectations of the most discerning clientele.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-surface border border-border/50 group relative overflow-hidden transition-all duration-500 ease-out shadow-sm hover:shadow-float hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 w-20 h-20 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:shadow-lg transition-all duration-500 ease-out border border-border">
                <div className="text-primary group-hover:text-accent transition-colors duration-300">
                  {exp.icon}
                </div>
              </div>
              <h3 className="relative z-10 text-xl font-bold text-primary mb-3 tracking-wide">{exp.title}</h3>
              <p className="relative z-10 text-sm text-secondary leading-relaxed">
                {exp.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
