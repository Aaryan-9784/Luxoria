import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUp, staggerContainer } from '@/lib/motion';

const lifestyles = [
  { id: 1, title: 'Business Travel', desc: 'Arrive with authority. Our executive fleet ensures you command respect before you even speak.', image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=800', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: 2, title: 'Wedding Experience', desc: 'Make your special day truly unforgettable with our pristine bridal collection.', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', span: 'col-span-1 row-span-1' },
  { id: 3, title: 'Celebrity Events', desc: 'Discreet, secure, and spectacularly elegant arrivals for high-profile engagements.', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800', span: 'col-span-1 row-span-1' },
  { id: 4, title: 'Airport Transfers', desc: 'Seamless transition from tarmac to city with our punctual luxury service.', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800', span: 'col-span-1 md:col-span-2 row-span-1' },
  { id: 5, title: 'Weekend Escapes', desc: 'Unleash the power of an exotic supercar on open scenic routes.', image: 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&q=80&w=800', span: 'col-span-1 md:col-span-2 row-span-1' },
];

export default function WatchLifestyle() {
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
          <span className="uppercase tracking-[0.2em] text-sm text-gray-500 font-medium">Curated Occasions</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900">
            A Lifestyle Elevated
          </h2>
          <p className="mt-4 text-gray-600 font-light text-lg">
            We provide more than a vehicle; we provide the perfect setting for your life's most important moments.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]"
        >
          {lifestyles.map((item) => (
            <motion.div 
              key={item.id}
              variants={fadeUp}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${item.span}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90" />
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-2xl font-serif text-white mb-2">{item.title}</h3>
                  <p className="text-white/80 font-light text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
