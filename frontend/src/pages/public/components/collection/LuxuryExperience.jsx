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

export default function LuxuryExperience() {
  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-medium uppercase tracking-widest text-slate-500">The Luxoria Standard</span>
          <h2 className="text-3xl md:text-4xl font-light text-slate-900 mt-3 mb-4 tracking-tight">Beyond the Drive</h2>
          <p className="text-slate-500 font-light leading-relaxed">
            Every vehicle in our collection comes with white-glove service designed to exceed the expectations of the most discerning clientele.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:bg-white transition-colors group"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:scale-110 transition-transform duration-500">
                {exp.icon}
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">{exp.title}</h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {exp.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
