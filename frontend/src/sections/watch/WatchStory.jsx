import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { staggerContainer, fadeUp, slideInRight, slideInLeft } from '@/lib/motion';

export default function WatchStory() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden" ref={ref}>
      <div className="container-luxe">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Left: Image */}
          <motion.div variants={slideInLeft} className="relative h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-700" />
            <img 
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1400" 
              alt="Luxury Interior"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
            />
            
            {/* Glassmorphism Badge */}
            <div className="absolute bottom-8 left-8 z-20 glass-panel px-6 py-4 rounded-xl max-w-xs">
              <p className="font-serif text-2xl text-white">Unmatched <br/> Refinement.</p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div variants={slideInRight} className="space-y-8">
            <motion.div variants={fadeUp}>
              <span className="uppercase tracking-[0.2em] text-sm text-gray-500 font-medium">The Luxoria Story</span>
              <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900 leading-tight">
                Redefining the Art <br/> of Motion
              </h2>
            </motion.div>
            
            <motion.div variants={fadeUp} className="space-y-6 text-gray-600 font-light text-lg">
              <p>
                At Luxoria, we believe that transportation is not merely about reaching a destination; it is about the poetry of the journey. Every curve of the road, every hum of the engine, curated to absolute perfection.
              </p>
              <p>
                Our fleet is a meticulously selected gallery of the world's finest automotive engineering. From the aggressive elegance of modern supercars to the quiet majesty of chauffeur-driven sedans, we offer an experience that transcends the ordinary.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-serif text-gray-900 mb-2">150+</h4>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Premium Vehicles</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-gray-900 mb-2">24/7</h4>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Concierge Service</p>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
