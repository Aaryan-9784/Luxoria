import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicStats } from '@/redux/slices/vehicleSlice';

const DEFAULT_BRANDS = [
  'Rolls-Royce', 'Bugatti', 'Porsche', 
  'McLaren', 'Ferrari', 'Lamborghini'
];

export default function BrandShowcase() {
  const dispatch = useDispatch();
  const { publicStats, featuredVehicles } = useSelector((state) => state.vehicle);

  useEffect(() => {
    if (!publicStats) {
      dispatch(fetchPublicStats());
    }
  }, [dispatch, publicStats]);

  const liveBrands = (publicStats?.brands && publicStats.brands.length > 0)
    ? publicStats.brands
    : (featuredVehicles && featuredVehicles.length > 0)
      ? Array.from(new Set(featuredVehicles.map(v => v.brand).filter(Boolean)))
      : DEFAULT_BRANDS;

  // Duplicate array for seamless looping
  const marqueeBrands = [...liveBrands, ...liveBrands, ...liveBrands];

  return (
    <section className="py-20 bg-primary overflow-hidden border-y border-white/5 relative">
      {/* Gradients to mask edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

      <div className="container-luxe mb-8">
        <p className="text-center text-overline text-white/40 tracking-[0.2em] uppercase">
          Curated selection of the world's finest
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        <motion.div
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30
          }}
          className="flex whitespace-nowrap"
        >
          {marqueeBrands.map((brand, i) => (
            <Link
              to={`/vehicles?brand=${encodeURIComponent(brand)}`}
              key={`${brand}-${i}`}
              className="px-8 md:px-16 flex items-center justify-center cursor-pointer group/brand inline-block"
            >
              <span className="text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase text-white/30 grayscale transition-all duration-500 ease-out group-hover/brand:grayscale-0 group-hover/brand:opacity-100 group-hover/brand:text-accent group-hover/brand:scale-110 group-hover/brand:drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                {brand}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
