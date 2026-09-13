import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Quote, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { fadeUp, staggerContainer } from '@/lib/motion';

const testimonials = [
  {
    id: 1,
    name: 'Alexander V.',
    role: 'CEO, Global Tech',
    text: '"The level of service is simply unmatched. The vehicle arrived pristine, and the chauffeur was exceptionally professional. Luxoria is my only choice for corporate travel."',
    videoUrl: 'https://videos.pexels.com/video-files/3205730/3205730-hd_1920_1080_25fps.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    rating: 5
  },
  {
    id: 2,
    name: 'Sophia L.',
    role: 'Private Client',
    text: '"We rented the Ferrari for our anniversary weekend. The entire process from verification to handover was frictionless. It felt less like renting a car and more like joining an exclusive club."',
    videoUrl: 'https://videos.pexels.com/video-files/5309605/5309605-hd_1920_1080_25fps.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: 5
  },
  {
    id: 3,
    name: 'James C.',
    role: 'Film Director',
    text: '"Required a fleet of specific exotics for a shoot. Luxoria not only sourced them within 48 hours but ensured they were delivered discreetly. Absolute perfection."',
    videoUrl: 'https://videos.pexels.com/video-files/8569830/8569830-hd_1920_1080_30fps.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    rating: 5
  }
];

export default function WatchTestimonials() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-24 md:py-32 bg-gray-900 text-white overflow-hidden relative" ref={ref}>
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black pointer-events-none" />

      <div className="container-luxe relative z-10">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-sm text-gray-400 font-medium">Client Perspectives</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-white">
            Words of Excellence
          </h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((item) => (
            <motion.div 
              key={item.id}
              variants={fadeUp}
              className="glass-panel p-8 rounded-2xl relative border border-white/10 group"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-white/10" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/50 transition-colors">
                  <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Play Overlay */}
                  <button 
                    onClick={() => setActiveVideo(item.videoUrl)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
                <div>
                  <h4 className="font-serif text-lg">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                ))}
              </div>

              <p className="text-gray-300 font-light leading-relaxed">
                {item.text}
              </p>

              {/* Watch Full Review Button */}
               <button 
                  onClick={() => setActiveVideo(item.videoUrl)}
                  className="mt-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
                >
                  <Play className="w-4 h-4" /> Watch Review
                </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-12"
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-8 right-8 text-white/70 hover:text-white z-50 p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-2xl relative"
            >
              <video 
                autoPlay 
                controls 
                className="w-full h-full object-contain"
                src={activeVideo}
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
