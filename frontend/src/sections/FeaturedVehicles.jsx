import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import LuxuryVehicleCard from '@/pages/vehicles/components/LuxuryVehicleCard';
import { fetchFeaturedVehicles } from '@/redux/slices/vehicleSlice';



/**
 * Normalise a DB vehicle document into the shape LuxuryVehicleCard expects.
 */
function normaliseVehicle(v) {
  return {
    id: v._id || v.id,
    name: v.name,
    brand: v.brand,
    image: v.images?.[0]?.url || v.image || null,
    pricePerDay: v.pricePerDay,
    category: v.category,
    rating: v.rating,
    seats: v.seats,
    transmission: v.transmission,
    fuelType: v.fuelType,
    topSpeed: v.topSpeed,
    horsepower: v.horsepower,
    engine: v.engine,
    location: v.location?.city || v.location || null,
    isAvailable: v.availability === 'available' || v.isAvailable,
  };
}

export default function FeaturedVehicles() {
  const dispatch = useDispatch();
  const { featuredVehicles, loading } = useSelector((state) => state.vehicle);

  useEffect(() => {
    // Only fetch if not already loaded
    if (featuredVehicles.length === 0) {
      dispatch(fetchFeaturedVehicles());
    }
  }, [dispatch, featuredVehicles.length]);

  // Use live database data only
  const rawVehicles = featuredVehicles;
  const vehicles = rawVehicles.slice(0, 6).map(normaliseVehicle);

  return (
    <section className="pt-24 md:pt-32 pb-8 md:pb-12 bg-surface">
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
              <span className="text-overline tracking-[0.2em] text-primary">Our Collection</span>
            </motion.div>
            <motion.h2
              className="text-[48px] lg:text-[64px] font-bold text-primary leading-[1.1] tracking-tight uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Featured <br /> <span className="text-secondary italic font-light lowercase">vehicles</span>
            </motion.h2>
            <motion.p
              className="text-secondary text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the pinnacle of automotive engineering with our handpicked selection of the world's most prestigious vehicles.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/vehicles" className="group flex items-center gap-3 text-primary font-medium hover:text-accent transition-colors pb-2 border-b border-primary hover:border-accent uppercase tracking-widest text-sm">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {loading && featuredVehicles.length === 0 ? (
          // Skeleton placeholders while loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface border border-border/40 overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-border/20" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-border/20 rounded w-1/3" />
                  <div className="h-5 bg-border/20 rounded w-2/3" />
                  <div className="h-3 bg-border/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
          >
            {vehicles.map((vehicle) => (
              <motion.div key={vehicle.id} variants={staggerItem}>
                <LuxuryVehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
