import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE_LUXE } from '@/lib/motion';
import { ArrowRight, Play, Star, CalendarCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExperienceShowcase() {
  const { scrollYProgress } = useScroll();
  // Simple parallax for the main image
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container-luxe">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* ── Left: Parallax Image Composition ── */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: EASE_LUXE }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[3/4]"
            >
              <motion.div style={{ y: yImage }} className="absolute inset-0 -top-[20%] -bottom-[20%]">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1600"
                  alt="Luxury driving experience"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/20 mix-blend-multiply" />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full glass-dark flex items-center justify-center group cursor-pointer border border-white/30 shadow-float"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-2 group-hover:scale-110 transition-transform duration-500" />
                </motion.button>
              </div>
            </motion.div>

            {/* Floating Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE_LUXE }}
              className="absolute top-12 -left-4 md:-left-12 glass-card-elevated p-6 rounded-3xl max-w-[240px] border border-white/40 shadow-2xl"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent fill-accent" />
              </div>
              <p className="text-display text-primary font-bold mb-1 text-4xl">98%</p>
              <p className="text-caption text-secondary font-medium uppercase tracking-widest">Client Satisfaction</p>
            </motion.div>

            {/* Floating Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE_LUXE }}
              className="absolute -bottom-8 right-4 md:-right-8 glass-dark p-6 rounded-3xl max-w-[240px] border border-white/20 shadow-float"
            >
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-display text-white font-bold mb-1 text-4xl">12k+</p>
              <p className="text-caption text-white/60 font-medium uppercase tracking-widest">Elite Rentals</p>
            </motion.div>
          </div>

          {/* ── Right: Editorial Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXE }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <span className="text-overline text-accent mb-6 tracking-[0.2em] uppercase flex items-center gap-4">
              <span className="w-12 h-[1px] bg-accent" />
              The Luxoria Standard
            </span>
            
            <h2 className="text-h1 text-primary mb-8 font-light leading-[1.1]">
              <span className="font-bold">More Than a Rental.</span><br />
              <span className="text-secondary italic font-serif">A Statement.</span>
            </h2>
            
            <p className="text-lg text-secondary leading-relaxed mb-10 font-light">
              Every Luxoria journey is meticulously crafted. From the moment you browse our collection
              to the second you return the keys, we deliver an experience that redefines what luxury
              automotive hospitality means.
            </p>

            <div className="space-y-6 mb-12">
              {[
                { title: 'White-Glove Delivery', desc: 'Hand-delivered to your doorstep, detailed to absolute perfection.' },
                { title: '24/7 Concierge', desc: 'A dedicated lifestyle manager for your entire journey.' },
                { title: 'Complete Discretion', desc: 'Private bookings with utmost confidentiality.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                  <div>
                    <h4 className="text-body font-bold text-primary">{item.title}</h4>
                    <p className="text-body-sm text-secondary mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/vehicles" className="group flex items-center gap-4 w-fit">
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-body font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors">
                Explore The Fleet
              </span>
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
