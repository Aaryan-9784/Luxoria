import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "The seamless process and immaculate condition of the Ferrari SF90 made our anniversary weekend in Monaco absolutely unforgettable. Luxoria sets a standard that others can only aspire to.",
    author: "Alexander Rothschild",
    role: "Venture Capitalist",
    location: "Monaco",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 2,
    quote: "As someone who demands perfection, I was blown away by the 24/7 concierge. Having the Phantom delivered directly to my private jet was the touch of class I expect.",
    author: "Elena Petrova",
    role: "CEO, TechNova",
    location: "Dubai",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 3,
    quote: "An extraordinary fleet managed by extraordinary people. The sheer quality of the vehicles and the discretion of the chauffeurs makes Luxoria my only choice for European travel.",
    author: "James Sterling",
    role: "Real Estate Developer",
    location: "London",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
          
          {/* Left Column */}
          <div className="w-full md:w-1/3">
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500">Clientele</span>
            <h2 className="text-4xl font-light text-slate-900 mt-2 mb-6">A Legacy of Excellence</h2>
            <p className="text-slate-500 font-light leading-relaxed mb-8">
              Hear from our distinguished members who have experienced the unrivaled luxury and meticulous attention to detail that defines Luxoria.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={prev}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={next}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right Column: Carousel */}
          <div className="w-full md:w-2/3 relative min-h-[300px]">
            <Quote className="absolute -top-10 -left-10 text-slate-100 rotate-180" size={120} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative z-10 bg-white/60 backdrop-blur-md border border-white/40 p-8 md:p-12 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)]"
              >
                <p className="text-xl md:text-2xl font-light text-slate-800 leading-relaxed mb-10 italic">
                  "{testimonials[currentIndex].quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].author}
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <h4 className="font-medium text-slate-900">{testimonials[currentIndex].author}</h4>
                    <p className="text-sm font-light text-slate-500">
                      {testimonials[currentIndex].role} &bull; {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
