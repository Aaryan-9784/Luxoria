import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, Zap, Mountain, Crown, Wind, Truck } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import LuxuryImage from '@/components/ui/LuxuryImage';

const CATEGORIES = [
  { name: 'Sports Cars', icon: Car, count: 86, slug: 'sports', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600&auto=format&fit=crop' },
  { name: 'Luxury SUVs', icon: Mountain, count: 124, slug: 'suv', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop' },
  { name: 'Electric', icon: Zap, count: 52, slug: 'electric', image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=600&auto=format&fit=crop' },
  { name: 'Sedans', icon: Crown, count: 98, slug: 'sedan', image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=600&auto=format&fit=crop' },
  { name: 'Convertibles', icon: Wind, count: 41, slug: 'convertible', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop' },
  { name: 'Luxury Vans', icon: Truck, count: 28, slug: 'limousine', image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600&auto=format&fit=crop' },
];

export default function CategoriesSection() {
  return (
    <section className="section-spacing bg-background">
      <div className="container-luxe">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-overline tracking-[0.2em] text-primary">Categories</span>
            <span className="w-8 h-px bg-accent" />
          </motion.div>
          <motion.h2 
            className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find Your <span className="text-secondary italic font-light lowercase">Perfect Match</span>
          </motion.h2>
          <motion.p 
            className="text-secondary text-lg leading-relaxed max-w-2xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From exhilarating sports cars to ultra-comfortable luxury SUVs — explore vehicles tailored to every desire.
          </motion.p>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.slug} variants={staggerItem}>
              <Link
                to={`/vehicles?category=${cat.slug}`}
                className="group relative flex flex-col items-center justify-end p-6 h-64 md:h-80 rounded-3xl border border-white/10 bg-primary overflow-hidden shadow-sm hover:shadow-glow-gold hover:-translate-y-2 transition-all duration-500"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <LuxuryImage 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover object-center opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="w-12 h-12 rounded-full glass-dark flex items-center justify-center mb-4 group-hover:bg-accent group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-500 border border-white/20">
                    <cat.icon className="w-5 h-5 text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-body font-bold text-white mb-1 tracking-wide">{cat.name}</h3>
                  <span className="text-caption text-white/70 uppercase tracking-widest">{cat.count} vehicles</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
