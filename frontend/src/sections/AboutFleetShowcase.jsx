import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LuxuryImage from '@/components/ui/LuxuryImage';

const FLEET_CATEGORIES = [
  {
    title: 'Luxury Sedans',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2070&auto=format&fit=crop',
    link: '/collection?category=sedans'
  },
  {
    title: 'Supercars',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop',
    link: '/collection?category=supercars'
  },
  {
    title: 'Luxury SUVs',
    image: 'https://images.unsplash.com/photo-1606822292023-e4d06a9d701e?q=80&w=2070&auto=format&fit=crop',
    link: '/collection?category=suvs'
  },
  {
    title: 'Executive Vehicles',
    image: 'https://images.unsplash.com/photo-1549419131-7e829352eef0?q=80&w=2070&auto=format&fit=crop',
    link: '/collection?category=executive'
  },
  {
    title: 'Wedding Collection',
    image: 'https://images.unsplash.com/photo-1520849495147-3f309cbdf2e6?q=80&w=2070&auto=format&fit=crop',
    link: '/collection?category=wedding'
  },
  {
    title: 'Chauffeur Collection',
    image: 'https://images.unsplash.com/photo-1536690786523-28c0b2f56193?q=80&w=2070&auto=format&fit=crop',
    link: '/collection?category=chauffeur'
  }
];

export default function AboutFleetShowcase() {
  return (
    <section className="py-[140px] bg-background relative overflow-hidden">
      <div className="container-luxe px-6 lg:px-20 mx-auto max-w-[1440px]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-8 h-px bg-accent" />
              <span className="text-overline tracking-[0.2em] text-primary">Unrivaled Selection</span>
            </motion.div>
            <motion.h2 
              className="text-[40px] lg:text-[56px] font-bold text-primary leading-[1.1] tracking-tight uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Our Premium <span className="text-secondary italic font-light lowercase">Fleet</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/collection" className="group flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-sm hover:text-accent transition-colors duration-300">
              View All Categories
              <span className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FLEET_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-[2px] bg-black block"
            >
              <Link to={category.link} className="absolute inset-0 z-20" aria-label={category.title}></Link>
              
              <LuxuryImage
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full flex items-end justify-between z-10">
                <h3 className="text-2xl font-bold text-white tracking-wide">{category.title}</h3>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-accent group-hover:border-accent group-hover:scale-110 transition-all duration-500">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
