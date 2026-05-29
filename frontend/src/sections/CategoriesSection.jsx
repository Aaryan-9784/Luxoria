import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, Zap, Mountain, Crown, Wind, Truck } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { SectionHeader } from '@/components/ui/Typography';

const CATEGORIES = [
  { name: 'Sports Cars', icon: Car, count: 86, slug: 'sports', image: 'https://images.unsplash.com/photo-1583121280346-081cb5f6f4c1?auto=format&fit=crop&q=80&w=600' },
  { name: 'Luxury SUVs', icon: Mountain, count: 124, slug: 'suv', image: 'https://images.unsplash.com/photo-1609520778173-e5e5424dfd0f?auto=format&fit=crop&q=80&w=600' },
  { name: 'Electric', icon: Zap, count: 52, slug: 'electric', image: 'https://images.unsplash.com/photo-1617704548623-a1789c02ffec?auto=format&fit=crop&q=80&w=600' },
  { name: 'Sedans', icon: Crown, count: 98, slug: 'sedan', image: 'https://images.unsplash.com/photo-1580274453535-4dbb2c34d3d7?auto=format&fit=crop&q=80&w=600' },
  { name: 'Convertibles', icon: Wind, count: 41, slug: 'convertible', image: 'https://images.unsplash.com/photo-1603584173870-7d4323c91e4f?auto=format&fit=crop&q=80&w=600' },
  { name: 'Luxury Vans', icon: Truck, count: 28, slug: 'limousine', image: 'https://images.unsplash.com/photo-1623880404395-515c0e181467?auto=format&fit=crop&q=80&w=600' },
];

export default function CategoriesSection() {
  return (
    <section className="section-spacing bg-background">
      <div className="container-luxe">
        <SectionHeader
          overline="Categories"
          title="Find Your Perfect Match"
          description="From exhilarating sports cars to ultra-comfortable luxury SUVs — explore vehicles tailored to every desire."
          align="center"
        />

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
                  <img 
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
