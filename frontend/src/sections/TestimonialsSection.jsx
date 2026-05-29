import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { SectionHeader } from '@/components/ui/Typography';
import { Star, Quote, BadgeCheck, MapPin } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'James Rothwell',
    role: 'CEO, TechVentures',
    location: 'Silicon Valley, CA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    text: 'The most incredible rental experience I\'ve ever had. The Porsche 911 was immaculate, and the concierge service was beyond anything I\'ve experienced. Luxoria is now my exclusive choice for business travel.',
    vehicle: 'Porsche 911 GT3 RS',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Fashion Director, Vogue',
    location: 'Paris, France',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=200',
    text: 'Luxoria understands luxury on a different level. From booking to return — effortless, elegant, extraordinary. The Rolls Royce Phantom was a dream for Paris Fashion Week.',
    vehicle: 'Rolls Royce Phantom',
    rating: 5,
  },
  {
    id: 3,
    name: 'Michael Kraft',
    role: 'Entrepreneur & Investor',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    text: 'The G63 arrived detailed to perfection. Their team handled every detail from pick-up to drop-off. This is how luxury should be — invisible yet unforgettable.',
    vehicle: 'Mercedes-AMG G63',
    rating: 5,
  },
  {
    id: 4,
    name: 'Elena Rostova',
    role: 'Architectural Designer',
    location: 'Milan, Italy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    text: 'Impeccable service. The Ferrari F8 Tributo was breathtaking. The entire process was seamless, allowing me to focus entirely on my clients and my work.',
    vehicle: 'Ferrari F8 Tributo',
    rating: 5,
  }
];

export default function TestimonialsSection() {
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="container-luxe">
        <SectionHeader
          overline="Client Stories"
          title="Echoes of Excellence"
          description="Hear from the world's most discerning individuals who have experienced the unparalleled Luxoria standard."
          align="left"
        />

        <div className="relative mt-12 cursor-grab active:cursor-grabbing">
          {/* Fade edges */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none hidden md:block" />

          <motion.div ref={carouselRef} className="overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              className="flex gap-6 md:gap-8"
              whileTap={{ cursor: "grabbing" }}
            >
              {TESTIMONIALS.map((t) => (
                <motion.div
                  key={t.id}
                  className="min-w-[320px] md:min-w-[450px] lg:min-w-[500px] p-8 md:p-10 rounded-3xl bg-background border border-border/60 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="w-10 h-10 text-accent/20" />
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-accent fill-accent" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-body md:text-lg text-primary font-medium leading-relaxed mb-8">
                    "{t.text}"
                  </p>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-border">
                    <div className="flex items-center gap-4">
                      <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover shadow-md" draggable="false" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-body font-bold text-primary">{t.name}</p>
                          <BadgeCheck className="w-4 h-4 text-accent" />
                        </div>
                        <p className="text-caption text-secondary font-medium">{t.role}</p>
                        <div className="flex items-center gap-1 mt-1 text-muted">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[11px] uppercase tracking-wider">{t.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface px-4 py-2 rounded-xl border border-border/50 text-right w-fit">
                      <p className="text-[10px] uppercase tracking-widest text-muted mb-0.5">Vehicle</p>
                      <p className="text-body-sm font-bold text-primary">{t.vehicle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <div className="mt-8 flex items-center justify-center gap-2">
            <p className="text-caption text-muted tracking-widest uppercase">Drag to explore</p>
            <div className="w-12 h-px bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
