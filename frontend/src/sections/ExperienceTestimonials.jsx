import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import LuxuryImage from '@/components/ui/LuxuryImage';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'James Harrison',
    vehicle: 'Supercar Experience',
    image: 'https://i.pravatar.cc/150?img=11',
    quote: 'The track day with the McLaren 720S was beyond exhilarating. The instructors were professional, and the hospitality was truly world-class. An experience I will never forget.'
  },
  {
    id: 2,
    name: 'Sophia Laurent',
    vehicle: 'Luxury Sedan Journey',
    image: 'https://i.pravatar.cc/150?img=5',
    quote: 'We booked a chauffeur-driven Rolls Royce for our anniversary. The driver was impeccably dressed, courteous, and made the entire evening feel like a cinematic dream.'
  },
  {
    id: 3,
    name: 'Marcus Chen',
    vehicle: 'Weekend Escape',
    image: 'https://i.pravatar.cc/150?img=12',
    quote: 'Renting the Porsche 911 for a weekend getaway in the Alps was the best decision. The car was in pristine condition, and the Luxoria team handled all the logistics flawlessly.'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    vehicle: 'Wedding Collection',
    image: 'https://i.pravatar.cc/150?img=9',
    quote: 'The Bentley made our wedding day perfect. The floral arrangements inside and the red carpet service provided by Luxoria exceeded our wildest expectations.'
  }
];

export default function ExperienceTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-[140px] bg-background relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

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
            <span className="text-overline tracking-[0.2em] text-primary">Customer Experiences</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Unforgettable <span className="text-secondary italic font-light lowercase">Moments</span>
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto h-[450px] sm:h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="bg-white/40 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] h-full flex flex-col items-center text-center">
                
                {/* Rating Stars */}
                <div className="flex text-accent mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current mx-0.5" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-xl md:text-2xl text-primary font-medium leading-relaxed italic mb-8 max-w-2xl flex-grow flex items-center justify-center">
                  "{TESTIMONIALS[currentIndex].quote}"
                </p>

                {/* Client Info */}
                <div className="flex flex-col items-center mt-auto">
                  <LuxuryImage 
                    src={TESTIMONIALS[currentIndex].image} 
                    alt={TESTIMONIALS[currentIndex].name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-3"
                  />
                  <h4 className="text-lg font-bold text-primary tracking-wide">{TESTIMONIALS[currentIndex].name}</h4>
                  <p className="text-[10px] text-secondary uppercase tracking-[0.2em]">{TESTIMONIALS[currentIndex].vehicle}</p>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-primary hover:text-accent hover:border-accent transition-colors z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12">
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-primary hover:text-accent hover:border-accent transition-colors z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-12 gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-border hover:bg-accent/50'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
