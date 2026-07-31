import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Vikramaditya Singhania',
    vehicle: 'Rolls Royce Ghost',
    image: '/images/vikramaditya.png',
    quote: 'The level of service provided was absolutely world-class. The Ghost arrived in immaculate condition for our Mumbai grand gala, and the white-glove concierge attentive care made the entire event unforgettable.'
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    vehicle: 'Lamborghini Huracán Evo',
    image: '/images/ananya.png',
    quote: 'An extraordinary experience from start to finish. The seamless digital booking process and the sheer thrill of driving through Bengaluru made our celebration truly regal.'
  },
  {
    id: 3,
    name: 'Rajeshwar Verma',
    vehicle: 'Mercedes-Maybach S-Class',
    image: '/images/rajeshwar.png',
    quote: 'Luxoria defines true luxury mobility in India. From the flawless vehicle presentation to their dedicated concierge team, their commitment to perfection is not just a promise, but a standard.'
  }
];

export default function LuxuryTestimonials() {
  return (
    <section className="py-[140px] bg-surface relative">
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
            <span className="text-overline tracking-[0.2em] text-primary">Client Experiences</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Words of <span className="text-secondary italic font-light lowercase">Excellence</span>
          </motion.h2>
        </div>

        {/* 3 Static Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-background p-12 rounded-[32px] border border-border shadow-sm flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Quote */}
              <div className="flex text-accent mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-body text-primary leading-relaxed mb-12 flex-grow">
                "{testimonial.quote}"
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-5 border-t border-border pt-8 mt-auto">
                <LuxuryImage 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full object-cover border border-border"
                />
                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">{testimonial.name}</h4>
                  <p className="text-caption text-secondary uppercase tracking-widest">{testimonial.vehicle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
