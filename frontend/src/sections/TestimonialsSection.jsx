import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { SectionHeader } from '@/components/ui/Typography';
import { Star, Quote, BadgeCheck, MapPin } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Vikramaditya Singhania',
    role: 'Managing Director, TechVentures India',
    location: 'Mumbai, Maharashtra',
    avatar: '/images/vikramaditya.png',
    text: 'The most incredible luxury rental experience in India. The Porsche 911 GT3 RS was immaculate, and the white-glove concierge service was beyond world-class. Luxoria is now my exclusive choice for business travel.',
    vehicle: 'Porsche 911 GT3 RS',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    role: 'Founder & CEO, Luxe Living',
    location: 'Bengaluru, Karnataka',
    avatar: '/images/ananya.png',
    text: 'Luxoria understands luxury on a different level. From booking to return — effortless, elegant, and extraordinary. The Rolls Royce Phantom was a triumph for our corporate summit.',
    vehicle: 'Rolls Royce Phantom',
    rating: 5,
  },
  {
    id: 3,
    name: 'Rajeshwar Verma',
    role: 'Senior Managing Partner, Capital One',
    location: 'New Delhi, NCR',
    avatar: '/images/rajeshwar.png',
    text: 'The G63 arrived detailed to absolute perfection. Their team handled every detail from VIP airport pick-up to drop-off. This is how true luxury mobility should be — invisible yet unforgettable.',
    vehicle: 'Mercedes-AMG G63',
    rating: 5,
  },
  {
    id: 4,
    name: 'Kavita Reddy',
    role: 'Principal Architect, Studio Luxe',
    location: 'Hyderabad, Telangana',
    avatar: '/images/ananya.png',
    text: 'Impeccable service. The Ferrari F8 Tributo was breathtaking. The entire process was seamless, allowing me to focus entirely on my clients and architectural summit.',
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-12 h-px bg-accent" />
              <span className="text-overline tracking-[0.2em] text-primary">Client Stories</span>
            </motion.div>
            <motion.h2
              className="text-[48px] lg:text-[64px] font-bold text-primary leading-[1.1] tracking-tight uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Echoes of <br /> <span className="text-secondary italic font-light lowercase">excellence</span>
            </motion.h2>
            <motion.p
              className="text-secondary text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hear from the world's most discerning individuals who have experienced the unparalleled Luxoria standard.
            </motion.p>
          </div>
        </div>

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
