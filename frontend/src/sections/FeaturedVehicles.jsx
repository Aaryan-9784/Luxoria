import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import LuxuryVehicleCard from '@/pages/vehicles/components/LuxuryVehicleCard';
import { fetchFeaturedVehicles } from '@/redux/slices/vehicleSlice';

// Fallback mock data — only used when the API is unavailable
export const HOME_FEATURED_VEHICLES = [
  {
    id: 'feat-1',
    name: 'Ghost Series II',
    brand: 'Rolls-Royce',
    image: 'https://calibremag.com/wp-content/uploads/2025/04/Rolls-Royce-Ghost-Series-II-Scotland-2025-CALIBRE-01.webp',
    pricePerDay: 2500,
    category: 'luxury',
    rating: { average: 4.9, count: 128 },
    seats: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '250 km/h',
    horsepower: '571 HP',
    engine: '6.75L V12 Twin-Turbo',
    location: 'Mumbai',
    isAvailable: true,
  },
  {
    id: 'feat-2',
    name: '296 GTB',
    brand: 'Ferrari',
    image: 'https://images.collectingcars.com/081193/AS-01-10-06.jpg?w=1920&q=95',
    pricePerDay: 3200,
    category: 'sports',
    rating: { average: 4.8, count: 96 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'hybrid',
    topSpeed: '330 km/h',
    horsepower: '830 HP',
    engine: '3.0L V6 Hybrid',
    location: 'Delhi',
    isAvailable: true,
  },
  {
    id: 'feat-3',
    name: 'Mistral',
    brand: 'Bugatti',
    image: 'https://cdn.motor1.com/images/mgl/eoBpg8/s1/bugatti-brouillard.webp',
    pricePerDay: 15000,
    category: 'sports',
    rating: { average: 5.0, count: 82 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '420 km/h',
    horsepower: '1600 HP',
    engine: '8.0L W16 Quad-Turbo',
    location: 'Bangalore',
    isAvailable: true,
  },
  {
    id: 'feat-4',
    name: 'Huracán EVO',
    brand: 'Lamborghini',
    image: 'https://houstonexotics.blob.core.windows.net/ech-ga12749/full/1img4066.jpg',
    pricePerDay: 2800,
    category: 'sports',
    rating: { average: 4.7, count: 84 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '325 km/h',
    horsepower: '640 HP',
    engine: '5.2L V10',
    location: 'Mumbai',
    isAvailable: true,
  },
  {
    id: 'feat-5',
    name: '911 Turbo S',
    brand: 'Porsche',
    image: 'https://images.collectingcars.com/023148/DSC03123-EDITED.jpg?w=3840&q=75',
    pricePerDay: 2200,
    category: 'sports',
    rating: { average: 4.8, count: 210 },
    seats: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '330 km/h',
    horsepower: '650 HP',
    engine: '3.8L Flat-6 Twin-Turbo',
    location: 'Delhi',
    isAvailable: true,
  },
  {
    id: 'feat-6',
    name: '720S',
    brand: 'McLaren',
    image: 'https://issimi-vehicles-cdn.b-cdn.net/publicamlvehiclemanagement/VehicleDetails/628/timestamped-1722570747278-2018%20McLaren%20720S_001.jpg?width=3840&quality=75',
    pricePerDay: 2500,
    category: 'sports',
    rating: { average: 4.9, count: 110 },
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    topSpeed: '341 km/h',
    horsepower: '710 HP',
    engine: '4.0L V8 Twin-Turbo',
    location: 'Hyderabad',
    isAvailable: true,
  },
];

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

  // Use live data if available, otherwise fall back to static mock data
  const rawVehicles = featuredVehicles.length > 0 ? featuredVehicles : HOME_FEATURED_VEHICLES;
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
