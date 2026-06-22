import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setFilter, fetchVehicles } from '@/redux/slices/vehicleSlice';
import { COLLECTIONS } from '../data/vehiclesPageData';
import { EASE_LUXE, staggerContainer, staggerItem, revealOnScroll } from '@/lib/motion';

function CollectionCard({ collection, onClick }) {
  return (
    <motion.button
      variants={staggerItem}
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl aspect-[4/5] sm:aspect-square md:aspect-[3/4] cursor-pointer text-left w-full"
    >
      {/* Background Image */}
      <img
        src={collection.image}
        alt={collection.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Premium Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-accent/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="inline-block px-3 py-1 mb-3 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-[0.15em] uppercase border border-white/20">
            {collection.vehicleCount} Vehicles
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
            {collection.title}
          </h3>
          <p className="text-sm text-white/70 font-medium max-w-[90%] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            {collection.description}
          </p>
        </motion.div>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-3xl transition-colors duration-500" />
    </motion.button>
  );
}

export default function CollectionsShowcase() {
  const dispatch = useDispatch();

  const handleCollectionClick = (category) => {
    dispatch(setFilter({ category }));
    dispatch(fetchVehicles());
    setTimeout(() => {
      const el = document.getElementById('vehicle-collection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <motion.section {...revealOnScroll} className="py-16 md:py-24 bg-surface/30">
      <div className="container-luxe">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-accent/60" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Curated Collections</span>
            <div className="w-12 h-[1px] bg-accent/60" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-4 tracking-tight uppercase">
            DISCOVER YOUR <span className="lowercase italic font-light text-secondary">style</span>
          </h2>
          <p className="text-sm md:text-base text-secondary max-w-2xl mx-auto leading-relaxed">
            Explore our meticulously organized collections tailored for specific experiences, events, and driving preferences.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {COLLECTIONS.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onClick={() => handleCollectionClick(collection.category)}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
