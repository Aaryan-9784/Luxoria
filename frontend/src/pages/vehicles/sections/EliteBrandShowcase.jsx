import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, fetchVehicles } from '@/redux/slices/vehicleSlice';
import { LUXURY_BRANDS } from '../data/vehiclesPageData';
import { EASE_LUXE, staggerContainer, staggerItem, revealOnScroll } from '@/lib/motion';

function BrandCard({ brand, isActive, onClick }) {
  return (
    <motion.button
      variants={staggerItem}
      onClick={onClick}
      className={`group relative flex-shrink-0 w-[140px] md:w-[160px] flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
        isActive
          ? 'bg-primary text-white border-primary shadow-xl scale-[1.02]'
          : 'bg-background border-border hover:border-accent/40 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {/* Brand Initial */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500 ${
          isActive
            ? 'bg-white/15 text-white'
            : 'bg-surface text-primary group-hover:bg-accent/10 group-hover:text-accent'
        }`}
        style={!isActive ? { borderLeft: `3px solid ${brand.color}` } : {}}
      >
        {brand.initial}
      </div>

      {/* Brand Name */}
      <span className={`text-xs font-semibold tracking-wide text-center leading-tight ${
        isActive ? 'text-white' : 'text-primary'
      }`}>
        {brand.name}
      </span>

      {/* Vehicle Count */}
      <span className={`text-[10px] font-medium tracking-wider uppercase ${
        isActive ? 'text-white/60' : 'text-muted'
      }`}>
        {brand.vehicleCount} vehicles
      </span>

      {/* Active glow */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(201,167,93,0.2)]" />
      )}
    </motion.button>
  );
}

export default function EliteBrandShowcase() {
  const dispatch = useDispatch();
  const currentBrand = useSelector(state => state.vehicle.filters.brand);

  const handleBrandClick = (brandName) => {
    const newBrand = currentBrand === brandName ? '' : brandName;
    dispatch(setFilter({ brand: newBrand }));
    dispatch(fetchVehicles());

    // Scroll to results
    setTimeout(() => {
      const el = document.getElementById('vehicle-collection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <motion.section
      {...revealOnScroll}
      className="py-16 md:py-24 overflow-hidden"
    >
      <div className="container-luxe">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="w-12 h-[1px] bg-accent/60" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Elite Marques</span>
            <div className="w-12 h-[1px] bg-accent/60" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_LUXE }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-4 tracking-tight uppercase"
          >
            THE WORLD'S FINEST <span className="lowercase italic font-light text-secondary">brands</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_LUXE }}
            className="text-sm md:text-base text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Select from our curated collection of the most prestigious automotive brands in the world
          </motion.p>
        </div>

        {/* Brand Carousel */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4 md:justify-center md:flex-wrap"
        >
          {LUXURY_BRANDS.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              isActive={currentBrand === brand.name}
              onClick={() => handleBrandClick(brand.name)}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
