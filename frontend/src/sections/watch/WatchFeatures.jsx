import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Headset, CreditCard, Award, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { fadeUp, staggerContainer } from '@/lib/motion';

const features = [
  { icon: ShieldCheck, title: 'Verified Fleet', desc: 'Every vehicle undergoes rigorous multi-point inspection before and after every journey.' },
  { icon: Sparkles, title: 'Luxury Brands', desc: 'Exclusive access to limited-edition models from the worlds most prestigious manufacturers.' },
  { icon: Headset, title: 'Dedicated Concierge', desc: 'Personalized support available 24/7 to cater to your specific itinerary and requests.' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Enterprise-grade encryption ensures your financial transactions are entirely protected.' },
  { icon: Award, title: 'Elite Customer Service', desc: 'Discreet, professional, and highly trained staff anticipating your every need.' },
  { icon: Zap, title: 'Instant Booking', desc: 'Seamless reservation process allowing you to secure your vehicle in moments, not days.' }
];

export default function WatchFeatures() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="container-luxe">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-sm text-gray-500 font-medium">The Luxoria Standard</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900">
            Why Choose Us
          </h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index}
                variants={fadeUp}
                className="group flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500 bg-gray-50/50 hover:bg-white"
              >
                <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Icon className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
