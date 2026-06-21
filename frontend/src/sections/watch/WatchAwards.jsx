import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUp, staggerContainer } from '@/lib/motion';

const awards = [
  { year: '2025', title: 'Best Luxury Fleet', org: 'Global Auto Awards' },
  { year: '2024', title: 'Excellence in Service', org: 'Premium Travel Digest' },
  { year: '2024', title: 'Top Executive Transport', org: 'Business Traveler Weekly' },
  { year: '2023', title: '5-Star Safety Rating', org: 'International Safety Council' }
];

export default function WatchAwards() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100" ref={ref}>
      <div className="container-luxe">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          {/* Left: Heading */}
          <motion.div variants={fadeUp} className="lg:w-1/3 text-center lg:text-left">
            <span className="uppercase tracking-[0.2em] text-sm text-gray-500 font-medium">Global Recognition</span>
            <h2 className="text-3xl md:text-4xl font-serif mt-4 text-gray-900">
              Award-Winning <br className="hidden lg:block"/> Excellence
            </h2>
            <p className="mt-4 text-gray-600 font-light">
              Our commitment to providing unparalleled luxury experiences has been recognized worldwide.
            </p>
          </motion.div>

          {/* Right: Awards Grid */}
          <motion.div 
            variants={staggerContainer}
            className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6 w-full"
          >
            {awards.map((award, index) => (
              <motion.div 
                key={index} 
                variants={fadeUp}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="text-gray-400 font-serif text-sm mb-2">{award.year}</span>
                <h4 className="font-serif text-gray-900 leading-snug mb-2">{award.title}</h4>
                <p className="text-xs uppercase tracking-wider text-gray-500">{award.org}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
