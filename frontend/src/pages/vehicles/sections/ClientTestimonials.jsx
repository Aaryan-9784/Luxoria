import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/vehiclesPageData';
import { EASE_LUXE, revealOnScroll } from '@/lib/motion';

export default function ClientTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: EASE_LUXE },
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: EASE_LUXE },
    }),
  };

  const testimonial = TESTIMONIALS[currentIndex];

  return (
    <motion.section {...revealOnScroll} className="py-20 md:py-32 bg-primary text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-luxe relative z-10">
        <div className="text-center mb-16">
          <span className="text-overline text-accent mb-3 block">Client Experiences</span>
          <h2 className="text-h2 mb-4">Words From Our Elite Clientele</h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass-dark rounded-[2.5rem] p-8 md:p-12 text-center relative border border-white/10"
            >
              <Quote className="w-12 h-12 text-accent/20 mx-auto mb-6" />
              
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>

              <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90 mb-10 italic">
                "{testimonial.review}"
              </p>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-accent/30 p-0.5">
                  <img src={testimonial.photo} alt={testimonial.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h4 className="text-lg font-bold tracking-wide">{testimonial.name}</h4>
                <p className="text-sm text-accent mb-1">{testimonial.role}</p>
                <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-widest mt-2">
                  <span>{testimonial.vehicle}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12">
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-accent' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
