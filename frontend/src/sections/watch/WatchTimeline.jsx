import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUp, staggerContainer } from '@/lib/motion';

const steps = [
  { num: '01', title: 'Browse Collection', desc: 'Explore our meticulously curated selection of the worlds finest vehicles.' },
  { num: '02', title: 'Choose Vehicle', desc: 'Select the perfect match for your journey, style, and unique requirements.' },
  { num: '03', title: 'Instant Verification', desc: 'Our streamlined process ensures your credentials are verified in moments.' },
  { num: '04', title: 'Secure Payment', desc: 'Complete your reservation through our encrypted, premium payment gateway.' },
  { num: '05', title: 'Vehicle Delivery', desc: 'White-glove delivery to your location, perfectly detailed and ready.' },
  { num: '06', title: 'Premium Experience', desc: 'Embark on an unforgettable journey with 24/7 dedicated concierge support.' }
];

export default function WatchTimeline() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden" ref={ref}>
      <div className="container-luxe">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="uppercase tracking-[0.2em] text-sm text-gray-500 font-medium">The Process</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900">
            A Seamless Journey
          </h2>
          <p className="mt-6 text-gray-600 font-light text-lg">
            From the moment you browse to the second you return the keys, every step is designed for absolute friction-free luxury.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 relative"
        >
          {/* Subtle background connecting lines (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gray-200 z-0" />
          <div className="hidden lg:block absolute top-[calc(50%+3rem)] left-[10%] right-[10%] h-[1px] bg-gray-200 z-0" />

          {steps.map((step, index) => (
            <motion.div 
              key={step.num}
              variants={fadeUp}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl font-serif text-gray-900">{step.num}</span>
                {/* Decorative outer ring */}
                <div className="absolute inset-0 border border-gray-900/10 rounded-full scale-[1.2] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
